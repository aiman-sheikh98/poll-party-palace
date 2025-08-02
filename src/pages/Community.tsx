import React from 'react';
import { Users, MessageCircle, Award, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const Community: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background/90 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Community Hub
          </h1>
          <p className="text-muted-foreground text-lg">
            Connect with other educators and students using our polling system
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="hover-scale">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                Active Users
              </CardTitle>
              <CardDescription>Users currently online</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">24</div>
              <p className="text-sm text-muted-foreground">+12% from yesterday</p>
            </CardContent>
          </Card>

          <Card className="hover-scale">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-primary" />
                Discussions
              </CardTitle>
              <CardDescription>Community conversations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">156</div>
              <p className="text-sm text-muted-foreground">Active discussions</p>
            </CardContent>
          </Card>

          <Card className="hover-scale">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5 text-primary" />
                Top Contributors
              </CardTitle>
              <CardDescription>Most helpful members</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Prof. Smith</span>
                  <Badge>Gold</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Dr. Johnson</span>
                  <Badge variant="secondary">Silver</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Coming Soon
            </CardTitle>
            <CardDescription>Exciting features we're working on</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h3 className="font-semibold">Discussion Forums</h3>
                <p className="text-sm text-muted-foreground">
                  Share best practices and discuss polling strategies with other educators.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">Resource Sharing</h3>
                <p className="text-sm text-muted-foreground">
                  Upload and download poll templates, question banks, and educational resources.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">User Profiles</h3>
                <p className="text-sm text-muted-foreground">
                  Create detailed profiles showcasing your teaching experience and specializations.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">Collaboration Tools</h3>
                <p className="text-sm text-muted-foreground">
                  Work together on polls and share insights with your teaching team.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Community;