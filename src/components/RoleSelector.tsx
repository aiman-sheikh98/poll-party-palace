import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GraduationCap, Users } from 'lucide-react';

interface RoleSelectorProps {
  onSelectRole: (role: 'teacher' | 'student') => void;
}

const RoleSelector: React.FC<RoleSelectorProps> = ({ onSelectRole }) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-primary-glow to-accent bg-clip-text text-transparent mb-4">
            Real-Time Polling System
          </h1>
          <p className="text-xl text-muted-foreground">
            Choose your role to get started
          </p>
        </div>

        {/* Role Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Teacher Card */}
          <Card 
            className="glass-card hover:scale-105 transition-all duration-300 cursor-pointer group"
            onClick={() => onSelectRole('teacher')}
          >
            <CardHeader className="text-center">
              <div className="mx-auto p-4 bg-primary/10 rounded-full w-fit group-hover:bg-primary/20 transition-colors duration-300">
                <GraduationCap className="h-12 w-12 text-primary" />
              </div>
              <CardTitle className="text-2xl">Teacher</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-muted-foreground">
                Create and manage live polling sessions for your students
              </p>
              <ul className="text-sm text-left space-y-2">
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-primary rounded-full" />
                  <span>Create new polls with custom questions</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-primary rounded-full" />
                  <span>View live polling results</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-primary rounded-full" />
                  <span>Manage student participants</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-primary rounded-full" />
                  <span>Configure poll time limits</span>
                </li>
              </ul>
              <Button className="w-full" size="lg">
                Continue as Teacher
              </Button>
            </CardContent>
          </Card>

          {/* Student Card */}
          <Card 
            className="glass-card hover:scale-105 transition-all duration-300 cursor-pointer group"
            onClick={() => onSelectRole('student')}
          >
            <CardHeader className="text-center">
              <div className="mx-auto p-4 bg-secondary/10 rounded-full w-fit group-hover:bg-secondary/20 transition-colors duration-300">
                <Users className="h-12 w-12 text-secondary" />
              </div>
              <CardTitle className="text-2xl">Student</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-muted-foreground">
                Join a polling session and participate in real-time polls
              </p>
              <ul className="text-sm text-left space-y-2">
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-secondary rounded-full" />
                  <span>Join with your name</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-secondary rounded-full" />
                  <span>Submit answers to polls</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-secondary rounded-full" />
                  <span>View live results after voting</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-secondary rounded-full" />
                  <span>60-second time limit per question</span>
                </li>
              </ul>
              <Button variant="secondary" className="w-full" size="lg">
                Continue as Student
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Features Footer */}
        <div className="text-center mt-12 space-y-4">
          <h3 className="text-lg font-medium">System Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
            <div className="p-4 bg-muted/20 rounded-lg">
              <strong className="text-foreground">Real-Time Updates</strong>
              <br />
              See results update live as students vote
            </div>
            <div className="p-4 bg-muted/20 rounded-lg">
              <strong className="text-foreground">Time Management</strong>
              <br />
              Configurable time limits with automatic endings
            </div>
            <div className="p-4 bg-muted/20 rounded-lg">
              <strong className="text-foreground">Session Control</strong>
              <br />
              Teachers control when new polls can be created
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleSelector;