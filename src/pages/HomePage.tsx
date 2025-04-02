
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useTask } from '@/contexts/TaskContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CirclePlus, CheckCircle, Star, Trophy, Swords, Crown, Sparkles, Flame } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useLeaderboard } from '@/contexts/LeaderboardContext';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { calculateXpProgress } from '@/utils/gamification';
import { Link } from 'react-router-dom';
import TaskForm from '@/components/tasks/TaskForm';
import XpGain from '@/components/ui/XpGain';
import LevelUp from '@/components/ui/LevelUp';

const HomePage: React.FC = () => {
  const { user } = useAuth();
  const { tasks, getTodayTasksCount, addTask } = useTask();
  const { userRank } = useLeaderboard();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showXpGain, setShowXpGain] = useState(false);
  const [xpAmount, setXpAmount] = useState(0);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [newLevel, setNewLevel] = useState(1);
  
  if (!user) return null;
  
  // Filter recent tasks
  const recentTasks = tasks
    .filter(task => !task.completed)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3);
  
  // Calculate completed tasks today
  const todaysCompletedTasks = tasks.filter(task => {
    if (!task.completed || !task.completedAt) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return new Date(task.completedAt) >= today;
  }).length;
  
  const handleAddTask = (values: { title?: string; description?: string; deadline?: Date; xpReward?: number }) => {
    // Convert Date to ISO string for the API
    const taskData = {
      title: values.title || '',
      description: values.description || '',
      deadline: values.deadline ? values.deadline.toISOString() : null,
      xpReward: values.xpReward || 10
    };
    
    addTask(taskData);
    setShowAddDialog(false);
    
    // Show XP gain animation (simulate reward for creating task)
    setXpAmount(5);
    setShowXpGain(true);
  };
  
  // Mock level up function (for demo)
  const simulateLevelUp = () => {
    setNewLevel(user.level + 1);
    setShowLevelUp(true);
  };
  
  const xpProgress = calculateXpProgress(user);
  
  // Get class for level display
  const getLevelDisplayClass = () => {
    if (user.level >= 30) return "bg-gradient-to-r from-epic-purple to-epic-blue";
    if (user.level >= 20) return "bg-gradient-to-r from-epic-blue to-epic-green";
    if (user.level >= 10) return "bg-gradient-to-r from-epic-yellow to-epic-green";
    return "bg-gradient-to-r from-epic-yellow to-amber-400";
  };
  
  return (
    <div className="space-y-6">
      {/* Welcome Card */}
      <Card className="bg-gradient-to-r from-epic-purple/10 to-epic-blue/10 border-2 border-epic-purple/50 shadow-lg transform hover:scale-[1.01] transition-all">
        <CardHeader>
          <div className="flex items-center">
            <Sparkles className="h-6 w-6 mr-2 text-epic-yellow animate-pulse" />
            <CardTitle className="text-2xl">Welcome back, {user.username}!</CardTitle>
          </div>
          <CardDescription className="flex items-center">
            <div className={`px-2 py-1 rounded-md text-white ${getLevelDisplayClass()} mr-2 font-bold`}>
              Level {user.level}
            </div>
            <span>{user.level >= 20 ? "Epic " : user.level >= 10 ? "Skilled " : ""}Adventurer</span>
            <span className="mx-2">•</span>
            <div className="flex items-center">
              <Crown className="h-4 w-4 mr-1 text-epic-yellow" />
              <span>Rank #{userRank || '?'}</span>
            </div>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium flex items-center">
                <Flame className="h-4 w-4 mr-1 text-epic-purple" />
                Experience Progress
              </span>
              <span className="text-sm text-muted-foreground">{xpProgress}% to Level {user.level + 1}</span>
            </div>
            <div className="h-2 relative rounded-full overflow-hidden bg-primary/20">
              <Progress value={xpProgress} className="h-full absolute inset-0 transition-all animate-pulse" />
            </div>
          </div>
          
          <div className="flex justify-between mt-6">
            <div className="text-center p-3 bg-muted/30 rounded-lg transform hover:scale-105 transition-transform">
              <p className="text-3xl font-bold">{getTodayTasksCount()}/10</p>
              <p className="text-sm text-muted-foreground">Daily Quests</p>
            </div>
            <div className="text-center p-3 bg-muted/30 rounded-lg transform hover:scale-105 transition-transform">
              <p className="text-3xl font-bold text-epic-green">{todaysCompletedTasks}</p>
              <p className="text-sm text-muted-foreground">Completed Today</p>
            </div>
            <div className="text-center p-3 bg-muted/30 rounded-lg transform hover:scale-105 transition-transform">
              <p className="text-3xl font-bold xp-text animate-pulse-scale">{user.xp}</p>
              <p className="text-sm text-muted-foreground">Total XP</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-4">
        <Button 
          variant="default" 
          size="lg" 
          className="h-16 bg-epic-purple hover:bg-epic-purple/90 border-2 border-epic-purple/50 shadow-md transform hover:translate-y-[-2px] transition-all"
          onClick={() => setShowAddDialog(true)}
        >
          <CirclePlus className="h-5 w-5 mr-2" />
          Start New Quest
        </Button>
        <Button 
          variant="outline" 
          size="lg" 
          className="h-16 border-2 border-epic-yellow/50 hover:bg-epic-yellow/10 shadow-md transform hover:translate-y-[-2px] transition-all"
          onClick={simulateLevelUp} // This is just for demonstration
        >
          <Trophy className="h-5 w-5 mr-2 text-epic-yellow" />
          View Leaderboard
        </Button>
      </div>
      
      {/* Recent Tasks Section */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-xl font-bold flex items-center">
            <Swords className="h-5 w-5 mr-2 text-epic-purple" />
            Active Quests
          </h2>
          <Link to="/tasks">
            <Button variant="ghost" size="sm" className="hover:bg-epic-purple/10 hover:text-epic-purple">View All</Button>
          </Link>
        </div>
        
        {recentTasks.length === 0 ? (
          <Card className="border-2 border-dashed border-epic-purple/30">
            <CardContent className="text-center py-8">
              <p className="text-muted-foreground mb-4">No active quests</p>
              <Button 
                onClick={() => setShowAddDialog(true)}
                className="bg-epic-purple hover:bg-epic-purple/90"
              >Start your first quest</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {recentTasks.map(task => {
              // Get border color based on XP reward
              let borderClass = "";
              if (task.xpReward >= 80) borderClass = "border-epic-purple";
              else if (task.xpReward >= 50) borderClass = "border-epic-blue";
              else if (task.xpReward >= 30) borderClass = "border-epic-yellow";
              
              return (
                <Card key={task.id} className={`task-card-hover border-2 ${borderClass} transform hover:translate-x-1 transition-all`}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{task.title}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-1 mt-1">
                          {task.description}
                        </p>
                      </div>
                      <Badge variant="outline" className="ml-2 flex items-center">
                        <Star className="h-3 w-3 mr-1 fill-epic-yellow stroke-epic-yellow" />
                        {task.xpReward} XP
                      </Badge>
                    </div>
                    
                    <Link to="/tasks">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="w-full mt-3 border border-muted bg-epic-green/10 hover:bg-epic-green/20"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Complete Quest
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
      
      {/* Add Task Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="border-2 border-epic-purple/50">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Swords className="h-5 w-5 mr-2 text-epic-purple" />
              Create New Quest
            </DialogTitle>
          </DialogHeader>
          <TaskForm 
            onSubmit={handleAddTask} 
            onCancel={() => setShowAddDialog(false)} 
          />
        </DialogContent>
      </Dialog>
      
      {/* XP Gain Animation */}
      {showXpGain && <XpGain amount={xpAmount} onComplete={() => setShowXpGain(false)} />}
      
      {/* Level Up Animation */}
      {showLevelUp && <LevelUp level={newLevel} onComplete={() => setShowLevelUp(false)} />}
    </div>
  );
};

export default HomePage;
