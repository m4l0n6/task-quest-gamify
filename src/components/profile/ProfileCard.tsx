
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useTask } from '@/contexts/TaskContext';
import { useBadge } from '@/contexts/BadgeContext';
import { useLeaderboard } from '@/contexts/LeaderboardContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { calculateXpProgress, xpForNextLevel } from '@/utils/gamification';
import { formatDistance } from 'date-fns';
import { Award, CheckCircle2, Star, Trophy } from 'lucide-react';

const ProfileCard: React.FC = () => {
  const { user, logout } = useAuth();
  const { getCompletedTasksCount } = useTask();
  const { unlockedBadges } = useBadge();
  const { userRank } = useLeaderboard();
  
  if (!user) return null;
  
  const xpProgress = calculateXpProgress(user);
  const completedTasks = getCompletedTasksCount();
  const xpForNext = xpForNextLevel(user.level);
  const currentLevelXp = xpForNext - 100;
  const xpInCurrentLevel = user.xp - currentLevelXp;
  
  // Calculate days since joined
  const daysSinceJoined = formatDistance(
    new Date(user.createdAt),
    new Date(),
    { addSuffix: false }
  );
  
  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex flex-col items-center">
          <Avatar className="h-24 w-24 mb-4 border-4 border-epic-purple">
            <AvatarImage src={user.avatarUrl} alt={user.username} />
            <AvatarFallback className="text-2xl">{user.username.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          
          <CardTitle className="text-2xl font-bold">{user.username}</CardTitle>
          <CardDescription>Adventurer for {daysSinceJoined}</CardDescription>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-5">
        {/* Level and XP */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">
              Level {user.level}
            </span>
            <span className="text-sm text-muted-foreground">
              {xpInCurrentLevel} / {100} XP to Level {user.level + 1}
            </span>
          </div>
          <Progress value={xpProgress} className="h-2" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Total: {user.xp} XP</span>
            <span>Next: {xpForNext} XP</span>
          </div>
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 py-2">
          <div className="flex flex-col items-center p-3 bg-muted/30 rounded-lg">
            <Trophy className="h-6 w-6 text-epic-yellow mb-1" />
            <span className="text-xl font-bold">{userRank || '-'}</span>
            <span className="text-xs text-muted-foreground">Rank</span>
          </div>
          
          <div className="flex flex-col items-center p-3 bg-muted/30 rounded-lg">
            <CheckCircle2 className="h-6 w-6 text-epic-green mb-1" />
            <span className="text-xl font-bold">{completedTasks}</span>
            <span className="text-xs text-muted-foreground">Tasks</span>
          </div>
          
          <div className="flex flex-col items-center p-3 bg-muted/30 rounded-lg">
            <Award className="h-6 w-6 text-epic-purple mb-1" />
            <span className="text-xl font-bold">{unlockedBadges.length}</span>
            <span className="text-xs text-muted-foreground">Badges</span>
          </div>
        </div>
        
        {/* Total XP */}
        <div className="flex items-center justify-center p-4 bg-gradient-to-r from-epic-purple/10 to-epic-blue/10 rounded-lg">
          <Star className="h-8 w-8 text-epic-yellow fill-epic-yellow mr-3" />
          <div>
            <div className="text-2xl font-bold">{user.xp} XP</div>
            <div className="text-sm text-muted-foreground">Total Experience</div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-center">
        <Button variant="outline" onClick={logout}>
          Sign Out
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProfileCard;
