import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Timer, Users, TrendingUp, Plus, X } from 'lucide-react';
import { useRealtimePolling } from '@/hooks/useRealtimePolling';

const TeacherInterface: React.FC = () => {
  const {
    currentPoll,
    students,
    timeLeft,
    haveAllStudentsResponded,
    pollResults,
    createPoll,
    endPoll,
  } = useRealtimePolling();

  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [timeLimit, setTimeLimit] = useState(60);
  const [isCreating, setIsCreating] = useState(false);

  const addOption = () => {
    if (options.length < 6) {
      setOptions([...options, '']);
    }
  };

  const removeOption = (index: number) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleCreatePoll = async () => {
    if (!question.trim() || options.some(opt => !opt.trim())) return;

    setIsCreating(true);
    const { error } = await createPoll(question, options.filter(opt => opt.trim()), timeLimit);
    
    if (!error) {
      setQuestion('');
      setOptions(['', '']);
      setTimeLimit(60);
    }
    setIsCreating(false);
  };

  const handleEndPoll = async () => {
    await endPoll();
  };

  const canCreateNewPoll = !currentPoll || !currentPoll.is_active || haveAllStudentsResponded;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-primary-glow to-accent bg-clip-text text-transparent">
          Teacher Dashboard
        </h1>
        <p className="text-muted-foreground mt-2">Create and manage live polling sessions</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="glass-card">
          <CardContent className="p-4 flex items-center space-x-4">
            <Users className="h-8 w-8 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Active Students</p>
              <p className="text-2xl font-bold">{students.length}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-4 flex items-center space-x-4">
            <Timer className="h-8 w-8 text-accent" />
            <div>
              <p className="text-sm text-muted-foreground">Time Left</p>
              <p className="text-2xl font-bold">
                {currentPoll?.is_active ? formatTime(timeLeft) : '--:--'}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-4 flex items-center space-x-4">
            <TrendingUp className="h-8 w-8 text-secondary" />
            <div>
              <p className="text-sm text-muted-foreground">Responses</p>
              <p className="text-2xl font-bold">
                {currentPoll ? pollResults.reduce((sum, r) => sum + r.votes, 0) : 0}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Create Poll */}
      {canCreateNewPoll && (
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Create New Poll</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="question">Question</Label>
              <Input
                id="question"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Enter your poll question..."
                className="mt-1"
              />
            </div>

            <div>
              <Label>Options</Label>
              <div className="space-y-2 mt-1">
                {options.map((option, index) => (
                  <div key={index} className="flex space-x-2">
                    <Input
                      value={option}
                      onChange={(e) => updateOption(index, e.target.value)}
                      placeholder={`Option ${index + 1}`}
                      className="flex-1"
                    />
                    {options.length > 2 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => removeOption(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                {options.length < 6 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addOption}
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Option
                  </Button>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="timeLimit">Time Limit (seconds)</Label>
              <Input
                id="timeLimit"
                type="number"
                value={timeLimit}
                onChange={(e) => setTimeLimit(Number(e.target.value))}
                min="30"
                max="300"
                className="mt-1"
              />
            </div>

            <Button
              onClick={handleCreatePoll}
              disabled={!question.trim() || options.some(opt => !opt.trim()) || isCreating}
              className="w-full"
            >
              {isCreating ? 'Creating...' : 'Start Poll'}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Active Poll */}
      {currentPoll?.is_active && (
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Active Poll</CardTitle>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary">
                {formatTime(timeLeft)} left
              </Badge>
              <Button variant="destructive" size="sm" onClick={handleEndPoll}>
                End Poll
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <h3 className="text-lg font-medium mb-4">{currentPoll.question}</h3>
            <div className="space-y-3">
              {pollResults.map((result, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{result.option}</span>
                    <span>{result.votes} votes ({result.percentage}%)</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-primary to-primary-glow h-2 rounded-full transition-all duration-300"
                      style={{ width: `${result.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            {haveAllStudentsResponded && (
              <div className="mt-4 p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <p className="text-green-800 dark:text-green-200 text-sm">
                  ✅ All students have responded!
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Students List */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Connected Students ({students.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {students.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              No students connected yet
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {students.map((student) => (
                <div
                  key={student.id}
                  className="flex items-center justify-between p-2 bg-muted/50 rounded-lg"
                >
                  <span className="text-sm">{student.name}</span>
                  <Badge variant="outline" className="text-xs">
                    {new Date(student.joined_at).toLocaleTimeString()}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TeacherInterface;