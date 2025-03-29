
import React from 'react';
import { useLeaderboard } from '@/contexts/LeaderboardContext';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trophy, Medal, Award } from 'lucide-react';
import Loading from '../ui/Loading';

const LeaderboardTable: React.FC = () => {
  const { leaderboard, userRank, isLoading, refreshLeaderboard } = useLeaderboard();
  const { user } = useAuth();
  
  React.useEffect(() => {
    refreshLeaderboard();
  }, [refreshLeaderboard]);
  
  if (isLoading) {
    return <Loading message="Loading leaderboard..." />;
  }
  
  // Get position-specific icons and styles
  const getRankDisplay = (rank: number) => {
    if (rank === 1) {
      return { 
        icon: <Trophy className="h-5 w-5 text-epic-yellow fill-epic-yellow" />,
        color: 'text-epic-yellow'
      };
    } else if (rank === 2) {
      return { 
        icon: <Medal className="h-5 w-5 text-slate-400 fill-slate-400" />,
        color: 'text-slate-400'
      };
    } else if (rank === 3) {
      return { 
        icon: <Award className="h-5 w-5 text-amber-700 fill-amber-700" />,
        color: 'text-amber-700'
      };
    }
    
    return { 
      icon: <span className="text-sm font-medium">{rank}</span>,
      color: 'text-muted-foreground'
    };
  };
  
  // Check if the user is in the top 10
  const isUserInTop = leaderboard.slice(0, 10).some(item => item.userId === user?.id);
  
  // Get user's rank entry if they're not in top 10
  const userRankEntry = !isUserInTop && user 
    ? leaderboard.find(item => item.userId === user.id) 
    : null;
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center">EpicTasks Leaderboard</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">Rank</TableHead>
              <TableHead>Player</TableHead>
              <TableHead className="text-right">Level</TableHead>
              <TableHead className="text-right">XP</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leaderboard.slice(0, 10).map((entry) => {
              const rankDisplay = getRankDisplay(entry.rank);
              const isCurrentUser = entry.userId === user?.id;
              
              return (
                <TableRow 
                  key={entry.userId} 
                  className={isCurrentUser ? 'bg-primary/10' : ''}
                >
                  <TableCell className="font-medium">
                    <div className="flex justify-center items-center h-8 w-8">
                      {rankDisplay.icon}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={entry.avatarUrl} alt={entry.username} />
                        <AvatarFallback>{entry.username.substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <span className={isCurrentUser ? 'font-bold' : ''}>
                        {entry.username} {isCurrentUser && '(You)'}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {entry.level}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {entry.xp}
                  </TableCell>
                </TableRow>
              );
            })}
            
            {/* Show user entry if not in top 10 */}
            {userRankEntry && (
              <>
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground py-1">
                    ...
                  </TableCell>
                </TableRow>
                <TableRow className="bg-primary/10">
                  <TableCell className="font-medium">
                    <div className="flex justify-center items-center h-8 w-8">
                      <span className="text-sm font-medium">{userRankEntry.rank}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={userRankEntry.avatarUrl} alt={userRankEntry.username} />
                        <AvatarFallback>{userRankEntry.username.substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <span className="font-bold">{userRankEntry.username} (You)</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {userRankEntry.level}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {userRankEntry.xp}
                  </TableCell>
                </TableRow>
              </>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default LeaderboardTable;
