import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Users, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PollOption {
  id: string;
  text: string;
  votes: number;
}

interface Poll {
  id: string;
  question: string;
  options: PollOption[];
  totalVotes: number;
}

const PollSystem = () => {
  const [polls] = useState<Poll[]>([
    {
      id: '1',
      question: 'What is the most important skill for a software developer?',
      options: [
        { id: '1a', text: 'Problem-solving abilities', votes: 45 },
        { id: '1b', text: 'Technical expertise', votes: 38 },
        { id: '1c', text: 'Communication skills', votes: 25 },
        { id: '1d', text: 'Continuous learning mindset', votes: 52 }
      ],
      totalVotes: 160
    },
    {
      id: '2',
      question: 'Which programming language would you recommend for beginners?',
      options: [
        { id: '2a', text: 'Python', votes: 78 },
        { id: '2b', text: 'JavaScript', votes: 65 },
        { id: '2c', text: 'Java', votes: 32 },
        { id: '2d', text: 'C++', votes: 15 }
      ],
      totalVotes: 190
    }
  ]);

  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [votedPolls, setVotedPolls] = useState<Set<string>>(new Set());

  const handleVote = (pollId: string, optionId: string) => {
    if (votedPolls.has(pollId)) return;
    
    setSelectedOptions(prev => ({ ...prev, [pollId]: optionId }));
    setVotedPolls(prev => new Set([...prev, pollId]));
  };

  const getPercentage = (votes: number, total: number) => {
    return total > 0 ? Math.round((votes / total) * 100) : 0;
  };

  const getMaxVotes = (options: PollOption[]) => {
    return Math.max(...options.map(option => option.votes));
  };

  const isWinningOption = (option: PollOption, options: PollOption[]) => {
    return option.votes === getMaxVotes(options) && option.votes > 0;
  };

  return (
    <div className="min-h-screen bg-gradient-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4 animate-fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-primary rounded-2xl shadow-poll mb-4">
            <TrendingUp className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Interview Poll System
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Participate in our interactive polls and see what the community thinks about key topics in software development.
          </p>
        </div>

        {/* Polls */}
        <div className="space-y-8">
          {polls.map((poll, pollIndex) => (
            <Card 
              key={poll.id} 
              className="bg-gradient-card border-0 shadow-card-custom animate-scale-in overflow-hidden"
              style={{ animationDelay: `${pollIndex * 0.1}s` }}
            >
              <CardHeader className="pb-4">
                <CardTitle className="text-xl md:text-2xl text-foreground flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mt-1">
                    <span className="text-sm font-bold text-primary">{pollIndex + 1}</span>
                  </div>
                  {poll.question}
                </CardTitle>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="w-4 h-4" />
                  <span>{poll.totalVotes} total votes</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {poll.options.map((option, optionIndex) => {
                  const percentage = getPercentage(option.votes, poll.totalVotes);
                  const isSelected = selectedOptions[poll.id] === option.id;
                  const hasVoted = votedPolls.has(poll.id);
                  const isWinner = isWinningOption(option, poll.options);
                  
                  return (
                    <div
                      key={option.id}
                      className={cn(
                        "relative group transition-all duration-300",
                        hasVoted ? "cursor-default" : "cursor-pointer"
                      )}
                      style={{ animationDelay: `${(pollIndex * 0.1) + (optionIndex * 0.05)}s` }}
                    >
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full h-auto p-4 justify-start text-left relative overflow-hidden transition-all duration-300",
                          "border-2 bg-card/50 backdrop-blur-sm",
                          !hasVoted && "hover:border-primary/50 hover:shadow-md",
                          isSelected && hasVoted && "border-primary bg-primary/5",
                          isWinner && hasVoted && "border-success bg-success/5"
                        )}
                        onClick={() => handleVote(poll.id, option.id)}
                        disabled={hasVoted}
                      >
                        {/* Progress Background */}
                        {hasVoted && (
                          <div 
                            className={cn(
                              "absolute inset-0 transition-all duration-1000 ease-out",
                              isSelected ? "bg-primary/10" : "bg-muted/30",
                              isWinner && "bg-success/10"
                            )}
                            style={{ 
                              width: `${percentage}%`,
                              animationDelay: `${(pollIndex * 0.2) + (optionIndex * 0.1)}s`
                            }}
                          />
                        )}
                        
                        {/* Content */}
                        <div className="relative z-10 flex items-center justify-between w-full">
                          <div className="flex items-center gap-3">
                            {hasVoted && isSelected && (
                              <CheckCircle className={cn(
                                "w-5 h-5 flex-shrink-0",
                                isWinner ? "text-success" : "text-primary"
                              )} />
                            )}
                            <span className={cn(
                              "font-medium text-sm md:text-base",
                              isSelected && hasVoted && (isWinner ? "text-success" : "text-primary"),
                              !hasVoted && "group-hover:text-primary"
                            )}>
                              {option.text}
                            </span>
                            {isWinner && hasVoted && (
                              <span className="text-xs px-2 py-1 bg-success/20 text-success rounded-full font-medium">
                                Leading
                              </span>
                            )}
                          </div>
                          
                          {hasVoted && (
                            <div className="flex items-center gap-3 text-sm">
                              <span className="font-semibold text-foreground">
                                {percentage}%
                              </span>
                              <span className="text-muted-foreground">
                                ({option.votes} votes)
                              </span>
                            </div>
                          )}
                        </div>
                      </Button>
                    </div>
                  );
                })}
                
                {!votedPolls.has(poll.id) && (
                  <div className="mt-4 p-3 bg-accent/50 rounded-lg border border-accent">
                    <p className="text-sm text-accent-foreground text-center">
                      Click on an option to vote and see the results
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Footer */}
        <div className="text-center py-8">
          <p className="text-muted-foreground">
            Thank you for participating in our polls! Your insights help shape our community.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PollSystem;