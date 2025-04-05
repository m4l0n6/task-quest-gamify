
import React from 'react';
import { Calendar, Gift, Coins, CalendarCheck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useDailyTask } from '@/contexts/DailyTaskContext';
import LoginStreak from '@/components/daily/LoginStreak';
import DailyTaskList from '@/components/daily/DailyTaskList';

const DailyRewardsPage: React.FC = () => {
  const { user } = useAuth();
  const { getActiveTasksCount, getCompletedTasksCount } = useDailyTask();
  
  if (!user) return null;
  
  const activeTasksCount = getActiveTasksCount();
  const completedTasksCount = getCompletedTasksCount();
  
  return (
    <div className="space-y-6">
      <div className="mb-6">
        <div className="flex items-center mb-2">
          <Calendar className="h-8 w-8 mr-2 text-epic-yellow" />
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-epic-yellow to-epic-purple">
            Daily Rewards
          </h1>
        </div>
        <p className="text-muted-foreground">Complete daily tasks and maintain your login streak to earn tokens!</p>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground flex items-center">
              <CalendarCheck className="h-4 w-4 mr-1 text-epic-green" />
              Login Streak
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{user.dailyLoginStreak} days</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground flex items-center">
              <Gift className="h-4 w-4 mr-1 text-epic-blue" />
              Daily Tasks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{completedTasksCount}/{completedTasksCount + activeTasksCount}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground flex items-center">
              <Coins className="h-4 w-4 mr-1 text-epic-yellow" />
              Tokens
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{user.tokens}</p>
          </CardContent>
        </Card>
      </div>
      
      {/* Login Streak Card */}
      <LoginStreak />
      
      {/* Daily Tasks */}
      <div>
        <h2 className="text-xl font-bold mb-4 flex items-center">
          <Gift className="h-5 w-5 mr-2 text-epic-yellow" />
          Daily Tasks
        </h2>
        <DailyTaskList />
      </div>
    </div>
  );
};

export default DailyRewardsPage;
