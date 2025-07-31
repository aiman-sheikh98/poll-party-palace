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
    },
    {
      id: '3',
      question: 'What is your preferred development environment?',
      options: [
        { id: '3a', text: 'Visual Studio Code', votes: 89 },
        { id: '3b', text: 'IntelliJ IDEA', votes: 43 },
        { id: '3c', text: 'Sublime Text', votes: 18 },
        { id: '3d', text: 'Vim/Neovim', votes: 22 }
      ],
      totalVotes: 172
    },
    {
      id: '4',
      question: 'Which database technology do you prefer for new projects?',
      options: [
        { id: '4a', text: 'PostgreSQL', votes: 67 },
        { id: '4b', text: 'MongoDB', votes: 54 },
        { id: '4c', text: 'MySQL', votes: 41 },
        { id: '4d', text: 'SQLite', votes: 28 }
      ],
      totalVotes: 190
    },
    {
      id: '5',
      question: 'What is the biggest challenge in software development?',
      options: [
        { id: '5a', text: 'Managing technical debt', votes: 58 },
        { id: '5b', text: 'Meeting deadlines', votes: 45 },
        { id: '5c', text: 'Debugging complex issues', votes: 37 },
        { id: '5d', text: 'Keeping up with new technologies', votes: 42 }
      ],
      totalVotes: 182
    },
    {
      id: '6',
      question: 'Which frontend framework/library do you prefer?',
      options: [
        { id: '6a', text: 'React', votes: 76 },
        { id: '6b', text: 'Vue.js', votes: 34 },
        { id: '6c', text: 'Angular', votes: 28 },
        { id: '6d', text: 'Svelte', votes: 19 }
      ],
      totalVotes: 157
    },
    {
      id: '7',
      question: 'How do you prefer to learn new programming concepts?',
      options: [
        { id: '7a', text: 'Hands-on coding projects', votes: 72 },
        { id: '7b', text: 'Online tutorials and courses', votes: 48 },
        { id: '7c', text: 'Reading documentation', votes: 31 },
        { id: '7d', text: 'Pair programming with others', votes: 25 }
      ],
      totalVotes: 176
    },
    {
      id: '8',
      question: 'What is your preferred method for code version control?',
      options: [
        { id: '8a', text: 'Git with GitHub', votes: 94 },
        { id: '8b', text: 'Git with GitLab', votes: 32 },
        { id: '8c', text: 'Git with Bitbucket', votes: 18 },
        { id: '8d', text: 'Other VCS (SVN, Mercurial)', votes: 6 }
      ],
      totalVotes: 150
    },
    {
      id: '9',
      question: 'Which testing approach do you find most valuable?',
      options: [
        { id: '9a', text: 'Unit testing', votes: 63 },
        { id: '9b', text: 'Integration testing', votes: 41 },
        { id: '9c', text: 'End-to-end testing', votes: 35 },
        { id: '9d', text: 'Manual testing', votes: 21 }
      ],
      totalVotes: 160
    },
    {
      id: '10',
      question: 'What motivates you most as a developer?',
      options: [
        { id: '10a', text: 'Solving complex problems', votes: 68 },
        { id: '10b', text: 'Building products that help people', votes: 55 },
        { id: '10c', text: 'Learning new technologies', votes: 43 },
        { id: '10d', text: 'Working with a great team', votes: 39 }
      ],
      totalVotes: 205
    },
    {
      id: '11',
      question: 'Which deployment strategy do you prefer?',
      options: [
        { id: '11a', text: 'Continuous deployment (CD)', votes: 52 },
        { id: '11b', text: 'Blue-green deployment', votes: 38 },
        { id: '11c', text: 'Rolling deployment', votes: 29 },
        { id: '11d', text: 'Manual deployment', votes: 16 }
      ],
      totalVotes: 135
    },
    {
      id: '12',
      question: 'What is your preferred approach to API development?',
      options: [
        { id: '12a', text: 'RESTful APIs', votes: 71 },
        { id: '12b', text: 'GraphQL', votes: 44 },
        { id: '12c', text: 'gRPC', votes: 23 },
        { id: '12d', text: 'WebSocket APIs', votes: 18 }
      ],
      totalVotes: 156
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