
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { Calendar, Flame, Gift } from 'lucide-react';
import { format } from 'date-fns';

const LoginStreak: React.FC = () => {
  const { user } = useAuth();
  
  if (!user || !user.lastDailyLogin) {
    return null;
  }
  
  // Format last login date
  const lastLogin = new Date(user.lastDailyLogin);
  const formattedDate = format(lastLogin, 'MMM d, yyyy');
  
  // Streak styles based on streak length
  const getStreakColor = () => {
    if (user.dailyLoginStreak >= 30) return "text-epic-purple";
    if (user.dailyLoginStreak >= 14) return "text-epic-blue";
    if (user.dailyLoginStreak >= 7) return "text-epic-green";
    if (user.dailyLoginStreak >= 3) return "text-epic-yellow";
    return "text-orange-500";
  };
  
  return (
    <Card className="border-2 border-epic-purple/20 bg-gradient-to-r from-epic-purple/5 to-epic-blue/5">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <Calendar className="h-5 w-5 mr-2 text-epic-purple" />
          Daily Login Streak
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Last Login</span>
            </div>
            <p className="font-medium">{formattedDate}</p>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Flame className={`h-4 w-4 mr-1 ${getStreakColor()}`} />
              <span className="text-sm text-muted-foreground">Current Streak</span>
            </div>
            <p className={`text-xl font-bold ${getStreakColor()}`}>{user.dailyLoginStreak} days</p>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t text-center">
          <div className="flex items-center justify-center mb-1">
            <Gift className="h-4 w-4 mr-1 text-epic-yellow" />
            <span className="text-sm text-muted-foreground">Keep logging in daily for bonus rewards!</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LoginStreak;
