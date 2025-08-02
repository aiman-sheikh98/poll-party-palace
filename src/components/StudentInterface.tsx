import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Timer, CheckCircle, Clock, TrendingUp, Home } from 'lucide-react';
import { useRealtimePolling } from '@/hooks/useRealtimePolling';
import { useNavigate } from 'react-router-dom';

const StudentInterface: React.FC = () => {
  const navigate = useNavigate();
  const {
    currentPoll,
    timeLeft,
    studentName,
    hasStudentResponded,
    pollResults,
    registerStudent,
    submitResponse,
    setUserRole,
  } = useRealtimePolling();

  const [name, setName] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRegister = async () => {
    if (!name.trim()) return;

    setIsRegistering(true);
    const { error } = await registerStudent(name.trim());
    if (error) {
      console.error('Registration error:', error);
    }
    setIsRegistering(false);
  };

  const handleSubmitResponse = async () => {
    if (selectedOption === null) return;

    setIsSubmitting(true);
    const { error } = await submitResponse(selectedOption);
    if (error) {
      console.error('Submission error:', error);
    }
    setIsSubmitting(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleBackToHome = () => {
    setUserRole(null);
    navigate('/');
  };

  // Registration form
  if (!studentName) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md glass-card">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl bg-gradient-to-r from-primary via-primary-glow to-accent bg-clip-text text-transparent">
              Student Login
            </CardTitle>
            <p className="text-muted-foreground">Enter your name to join the polling session</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Your Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                className="mt-1"
                onKeyPress={(e) => e.key === 'Enter' && handleRegister()}
              />
            </div>
            <Button
              onClick={handleRegister}
              disabled={!name.trim() || isRegistering}
              className="w-full"
            >
              {isRegistering ? 'Joining...' : 'Join Session'}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Navigation */}
      <div className="flex items-center justify-start">
        <Button 
          variant="outline" 
          onClick={handleBackToHome}
          className="flex items-center gap-2"
        >
          <Home className="w-4 h-4" />
          Back to Home
        </Button>
      </div>

      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-primary-glow to-accent bg-clip-text text-transparent">
          Welcome, {studentName}!
        </h1>
        <p className="text-muted-foreground mt-2">Student Polling Interface</p>
      </div>

      {/* Current Poll */}
      {currentPoll?.is_active ? (
        <Card className="glass-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Current Poll</CardTitle>
              <div className="flex items-center space-x-2">
                <Timer className="h-4 w-4 text-accent" />
                <Badge variant={timeLeft <= 10 ? "destructive" : "secondary"}>
                  {formatTime(timeLeft)}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <h3 className="text-lg font-medium">{currentPoll.question}</h3>

            {!hasStudentResponded && timeLeft > 0 ? (
              // Voting interface
              <div className="space-y-4">
                <div className="space-y-3">
                  {currentPoll.options.map((option, index) => (
                    <div
                      key={index}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                        selectedOption === index
                          ? 'border-primary bg-primary/10 scale-105'
                          : 'border-muted hover:border-primary/50 hover:bg-muted/50'
                      }`}
                      onClick={() => setSelectedOption(index)}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-4 h-4 rounded-full border-2 ${
                          selectedOption === index 
                            ? 'border-primary bg-primary' 
                            : 'border-muted-foreground'
                        }`} />
                        <span className="font-medium">{option}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <Button
                  onClick={handleSubmitResponse}
                  disabled={selectedOption === null || isSubmitting}
                  className="w-full"
                  size="lg"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Answer'}
                </Button>

                {/* Time progress bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Time Remaining</span>
                    <span>{formatTime(timeLeft)}</span>
                  </div>
                  <Progress 
                    value={(timeLeft / currentPoll.time_limit) * 100} 
                    className="h-2"
                  />
                </div>
              </div>
            ) : (
              // Results view
              <div className="space-y-4">
                {hasStudentResponded && (
                  <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="text-green-800 dark:text-green-200 text-sm">
                      Your response has been submitted!
                    </span>
                  </div>
                )}

                <div className="space-y-3">
                  <h4 className="font-medium flex items-center space-x-2">
                    <TrendingUp className="h-4 w-4" />
                    <span>Live Results</span>
                  </h4>
                  {pollResults.map((result, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">{result.option}</span>
                        <span className="text-muted-foreground">
                          {result.votes} votes ({result.percentage}%)
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-3">
                        <div
                          className="bg-gradient-to-r from-primary to-primary-glow h-3 rounded-full transition-all duration-500 ease-out"
                          style={{ width: `${result.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {timeLeft === 0 && (
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center space-x-2">
                    <Clock className="h-5 w-5 text-blue-600" />
                    <span className="text-blue-800 dark:text-blue-200 text-sm">
                      Time's up! Poll has ended.
                    </span>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        // No active poll
        <Card className="glass-card">
          <CardContent className="text-center py-12">
            <Clock className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-medium mb-2">No Active Poll</h3>
            <p className="text-muted-foreground">
              Waiting for the teacher to start a new poll...
            </p>
          </CardContent>
        </Card>
      )}

      {/* Session Info */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-sm">Session Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Your Name</p>
              <p className="font-medium">{studentName}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Status</p>
              <Badge variant="outline" className="text-xs">
                Connected
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentInterface;