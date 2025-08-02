import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Calendar, Users, BarChart3, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface PastPoll {
  id: string;
  question: string;
  options: string[];
  created_at: string;
  time_limit: number;
  total_responses: number;
  results: Array<{
    option: string;
    votes: number;
    percentage: number;
  }>;
}

const PastPollResults: React.FC = () => {
  const [pastPolls, setPastPolls] = useState<PastPoll[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPastPolls = async () => {
      try {
        // Get all past polls (inactive polls)
        const { data: polls } = await (supabase as any)
          .from('polls')
          .select('*')
          .eq('is_active', false)
          .order('created_at', { ascending: false });

        if (polls) {
          // Get responses for each poll
          const pollsWithResults = await Promise.all(
            polls.map(async (poll: any) => {
              const { data: responses } = await (supabase as any)
                .from('poll_responses')
                .select('selected_option')
                .eq('poll_id', poll.id);

              const totalResponses = responses?.length || 0;
              
              const results = poll.options.map((option: string, index: number) => {
                const votes = responses?.filter((r: any) => r.selected_option === index).length || 0;
                return {
                  option,
                  votes,
                  percentage: totalResponses > 0 ? Math.round((votes / totalResponses) * 100) : 0
                };
              });

              return {
                id: poll.id,
                question: poll.question,
                options: poll.options,
                created_at: poll.created_at,
                time_limit: poll.time_limit,
                total_responses: totalResponses,
                results
              };
            })
          );

          setPastPolls(pollsWithResults);
        }
      } catch (error) {
        console.error('Error loading past polls:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPastPolls();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Poll Analytics
          </h1>
          <p className="text-muted-foreground text-lg">Loading past poll results...</p>
        </div>
        <div className="grid gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-3">
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="h-3 bg-muted rounded"></div>
                <div className="h-3 bg-muted rounded w-4/5"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          Poll Analytics
        </h1>
        <p className="text-muted-foreground text-lg">
          View detailed results from past polling sessions
        </p>
      </div>

      {pastPolls.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <BarChart3 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Past Polls Found</h3>
            <p className="text-muted-foreground">
              Create and complete some polls to see analytics here.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {pastPolls.map((poll) => (
            <Card key={poll.id} className="hover-scale">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1 flex-1">
                    <CardTitle className="text-xl">{poll.question}</CardTitle>
                    <CardDescription className="flex items-center gap-4 text-sm">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {formatDistanceToNow(new Date(poll.created_at), { addSuffix: true })}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {poll.total_responses} responses
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {poll.time_limit}s time limit
                      </span>
                    </CardDescription>
                  </div>
                  <Badge variant="secondary" className="ml-4">
                    Completed
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {poll.results.map((result, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">{result.option}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground">
                            {result.votes} votes
                          </span>
                          <span className="font-semibold text-primary">
                            {result.percentage}%
                          </span>
                        </div>
                      </div>
                      <Progress 
                        value={result.percentage} 
                        className="h-2"
                      />
                    </div>
                  ))}
                </div>
                
                {poll.total_responses === 0 && (
                  <div className="text-center py-4 text-muted-foreground">
                    No responses were recorded for this poll
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default PastPollResults;