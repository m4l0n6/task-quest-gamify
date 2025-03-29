
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const LoginPage: React.FC = () => {
  const { login, isLoading } = useAuth();
  
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-epic-purple/10 to-epic-blue/10">
      <Card className="w-full max-w-md shadow-lg animate-fade-in">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-epic-purple to-epic-blue">
            EpicTasks
          </CardTitle>
          <CardDescription className="text-lg">
            Transform your tasks into an epic adventure
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="space-y-2 text-center">
            <h3 className="text-xl font-semibold">Game-like productivity</h3>
            <p className="text-muted-foreground">
              Complete tasks, earn XP, level up, and collect badges in a gamified experience
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="flex flex-col items-center p-3 bg-muted/30 rounded-lg">
              <div className="text-2xl mb-1">🏆</div>
              <span className="text-sm font-medium">XP & Levels</span>
            </div>
            <div className="flex flex-col items-center p-3 bg-muted/30 rounded-lg">
              <div className="text-2xl mb-1">🔥</div>
              <span className="text-sm font-medium">Badges</span>
            </div>
            <div className="flex flex-col items-center p-3 bg-muted/30 rounded-lg">
              <div className="text-2xl mb-1">🏅</div>
              <span className="text-sm font-medium">Leaderboard</span>
            </div>
            <div className="flex flex-col items-center p-3 bg-muted/30 rounded-lg">
              <div className="text-2xl mb-1">⚡</div>
              <span className="text-sm font-medium">Rewards</span>
            </div>
          </div>
        </CardContent>
        
        <CardFooter>
          <Button 
            className="w-full bg-gradient-to-r from-epic-purple to-epic-blue hover:opacity-90 transition-opacity"
            onClick={login} 
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login with Telegram'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoginPage;
