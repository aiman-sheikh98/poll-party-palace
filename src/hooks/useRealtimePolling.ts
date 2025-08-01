import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Poll {
  id: string;
  question: string;
  options: string[];
  teacher_id: string;
  is_active: boolean;
  time_limit: number;
  created_at: string;
  ends_at?: string;
}

export interface PollResponse {
  id: string;
  poll_id: string;
  student_session_id: string;
  student_name: string;
  selected_option: number;
  submitted_at: string;
}

export interface Student {
  id: string;
  name: string;
  session_id: string;
  joined_at: string;
}

export const useRealtimePolling = () => {
  const [currentPoll, setCurrentPoll] = useState<Poll | null>(null);
  const [responses, setResponses] = useState<PollResponse[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [userRole, setUserRole] = useState<'teacher' | 'student' | null>(null);
  const [studentName, setStudentName] = useState<string>('');
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random()}`);

  // Load active poll and responses
  const loadCurrentPoll = useCallback(async () => {
    const { data: poll } = await (supabase as any)
      .from('polls')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (poll) {
      setCurrentPoll(poll);
      
      // Load responses for this poll
      const { data: pollResponses } = await (supabase as any)
        .from('poll_responses')
        .select('*')
        .eq('poll_id', poll.id);
      
      setResponses(pollResponses || []);

      // Calculate time left
      if (poll.ends_at) {
        const endTime = new Date(poll.ends_at).getTime();
        const now = Date.now();
        setTimeLeft(Math.max(0, Math.floor((endTime - now) / 1000)));
      }
    } else {
      setCurrentPoll(null);
      setResponses([]);
      setTimeLeft(0);
    }
  }, []);

  // Load students
  const loadStudents = useCallback(async () => {
    const { data } = await (supabase as any)
      .from('students')
      .select('*')
      .order('joined_at', { ascending: true });
    
    setStudents(data || []);
  }, []);

  // Register student
  const registerStudent = useCallback(async (name: string) => {
    const { error } = await (supabase as any)
      .from('students')
      .upsert([
        {
          name,
          session_id: sessionId,
        }
      ], { onConflict: 'session_id' });

    if (!error) {
      setStudentName(name);
      setUserRole('student');
    }
    return { error };
  }, [sessionId]);

  // Create new poll (teacher)
  const createPoll = useCallback(async (question: string, options: string[], timeLimit: number = 60) => {
    const endsAt = new Date(Date.now() + timeLimit * 1000);
    
    const { data, error } = await (supabase as any)
      .from('polls')
      .insert([
        {
          question,
          options,
          teacher_id: sessionId,
          time_limit: timeLimit,
          ends_at: endsAt.toISOString(),
        }
      ])
      .select()
      .single();

    if (!error && data) {
      setCurrentPoll(data);
      setTimeLeft(timeLimit);
    }
    return { error };
  }, [sessionId]);

  // Submit response (student)
  const submitResponse = useCallback(async (optionIndex: number) => {
    if (!currentPoll || !studentName) return { error: new Error('No active poll or student name') };

    const { error } = await (supabase as any)
      .from('poll_responses')
      .insert([
        {
          poll_id: currentPoll.id,
          student_session_id: sessionId,
          student_name: studentName,
          selected_option: optionIndex,
        }
      ]);

    return { error };
  }, [currentPoll, studentName, sessionId]);

  // End poll (teacher)
  const endPoll = useCallback(async () => {
    if (!currentPoll) return;

    const { error } = await (supabase as any)
      .from('polls')
      .update({ is_active: false })
      .eq('id', currentPoll.id);

    return { error };
  }, [currentPoll]);

  // Check if student has responded
  const hasStudentResponded = useCallback(() => {
    return responses.some(r => r.student_session_id === sessionId);
  }, [responses, sessionId]);

  // Check if all students have responded
  const haveAllStudentsResponded = useCallback(() => {
    if (students.length === 0) return false;
    const responseSessionIds = new Set(responses.map(r => r.student_session_id));
    return students.every(s => responseSessionIds.has(s.session_id));
  }, [students, responses]);

  // Get poll results
  const getPollResults = useCallback(() => {
    if (!currentPoll) return [];
    
    const results = currentPoll.options.map((option, index) => ({
      option,
      votes: responses.filter(r => r.selected_option === index).length,
      percentage: responses.length > 0 
        ? Math.round((responses.filter(r => r.selected_option === index).length / responses.length) * 100)
        : 0
    }));

    return results;
  }, [currentPoll, responses]);

  // Timer effect
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            // Auto-end poll when time runs out
            if (currentPoll && userRole === 'teacher') {
              endPoll();
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [timeLeft, currentPoll, userRole, endPoll]);

  // Real-time subscriptions
  useEffect(() => {
    const pollsChannel = supabase
      .channel('polls_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'polls' }, 
        () => loadCurrentPoll()
      )
      .subscribe();

    const responsesChannel = supabase
      .channel('responses_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'poll_responses' }, 
        () => loadCurrentPoll()
      )
      .subscribe();

    const studentsChannel = supabase
      .channel('students_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'students' }, 
        () => loadStudents()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(pollsChannel);
      supabase.removeChannel(responsesChannel);
      supabase.removeChannel(studentsChannel);
    };
  }, [loadCurrentPoll, loadStudents]);

  // Initial load
  useEffect(() => {
    loadCurrentPoll();
    loadStudents();
  }, [loadCurrentPoll, loadStudents]);

  return {
    // State
    currentPoll,
    responses,
    students,
    timeLeft,
    userRole,
    studentName,
    sessionId,
    
    // Actions
    registerStudent,
    createPoll,
    submitResponse,
    endPoll,
    setUserRole,
    
    // Computed
    hasStudentResponded: hasStudentResponded(),
    haveAllStudentsResponded: haveAllStudentsResponded(),
    pollResults: getPollResults(),
  };
};