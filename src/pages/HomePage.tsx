
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useTask } from '@/contexts/TaskContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CirclePlus, CheckCircle, Star, Trophy } from 'lucide-react';
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
  
  const handleAddTask = (taskData: any) => {
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
  
  return (
    <div className="space-y-6">
      {/* Welcome Card */}
      <Card className="bg-gradient-to-r from-epic-purple/20 to-epic-blue/20">
        <CardHeader>
          <CardTitle className="text-2xl">Welcome back, {user.username}!</CardTitle>
          <CardDescription>
            Level {user.level} Adventurer • Rank #{userRank || '?'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Level Progress</span>
              <span className="text-sm text-muted-foreground">{xpProgress}% to Level {user.level + 1}</span>
            </div>
            <Progress value={xpProgress} className="h-2" />
          </div>
          
          <div className="flex justify-between mt-4">
            <div className="text-center">
              <p className="text-3xl font-bold">{getTodayTasksCount()}/10</p>
              <p className="text-sm text-muted-foreground">Daily Tasks</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold">{todaysCompletedTasks}</p>
              <p className="text-sm text-muted-foreground">Completed Today</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold xp-text">{user.xp}</p>
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
          className="h-16 bg-epic-purple hover:bg-epic-purple/90"
          onClick={() => setShowAddDialog(true)}
        >
          <CirclePlus className="h-5 w-5 mr-2" />
          Add New Task
        </Button>
        <Button 
          variant="outline" 
          size="lg" 
          className="h-16"
          onClick={simulateLevelUp} // This is just for demonstration
        >
          <Trophy className="h-5 w-5 mr-2" />
          View Leaderboard
        </Button>
      </div>
      
      {/* Recent Tasks Section */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-xl font-bold">Recent Tasks</h2>
          <Link to="/tasks">
            <Button variant="ghost" size="sm">View All</Button>
          </Link>
        </div>
        
        {recentTasks.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-muted-foreground mb-4">No active tasks</p>
              <Button onClick={() => setShowAddDialog(true)}>Create your first task</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {recentTasks.map(task => (
              <Card key={task.id} className="task-card-hover">
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
                      className="w-full mt-3 border border-muted"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Mark Complete
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
      
      {/* Add Task Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create a New Task</DialogTitle>
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
