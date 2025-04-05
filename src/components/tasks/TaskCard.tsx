
import React from 'react';
import { Task } from '@/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, CheckCircle2, Edit, Star, Trash2, Clock, Award } from 'lucide-react';
import { formatDistanceToNow, isPast, isToday, parseISO } from 'date-fns';
import { useTask } from '@/contexts/TaskContext';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface TaskCardProps {
  task: Task;
  onEdit: () => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit }) => {
  const { deleteTask, markTaskComplete } = useTask();
  
  const handleComplete = () => {
    markTaskComplete(task.id);
  };
  
  const handleDelete = () => {
    deleteTask(task.id);
  };
  
  // Format deadline for display
  const getDeadlineDisplay = () => {
    if (!task.deadline) return null;
    
    const deadlineDate = parseISO(task.deadline);
    const isPastDeadline = isPast(deadlineDate) && !isToday(deadlineDate);
    const isTodayDeadline = isToday(deadlineDate);
    
    return (
      <Badge variant={isPastDeadline ? "destructive" : isTodayDeadline ? "default" : "secondary"} className="animate-pulse-scale">
        <Clock className="h-3 w-3 mr-1" />
        {isTodayDeadline 
          ? "Today" 
          : isPastDeadline 
            ? "Overdue" 
            : formatDistanceToNow(deadlineDate, { addSuffix: true })}
      </Badge>
    );
  };
  
  // Select a border color based on XP reward
  const getBorderColor = () => {
    if (task.xpReward >= 80) return "border-epic-purple";
    if (task.xpReward >= 50) return "border-epic-blue";
    if (task.xpReward >= 30) return "border-epic-yellow";
    return "border-gray-200";
  };
  
  // Get rarity label based on XP reward
  const getRarityLabel = () => {
    if (task.xpReward >= 80) return "Legendary";
    if (task.xpReward >= 50) return "Epic";
    if (task.xpReward >= 30) return "Rare";
    return "Common";
  };
  
  // Get rarity color class
  const getRarityColorClass = () => {
    if (task.xpReward >= 80) return "text-epic-purple";
    if (task.xpReward >= 50) return "text-epic-blue";
    if (task.xpReward >= 30) return "text-epic-yellow";
    return "text-gray-400";
  };
  
  return (
    <Card className={`task-card-hover ${task.completed ? 'bg-muted/50' : ''} border-2 ${getBorderColor()} transition-all hover:shadow-lg transform hover:-translate-y-1`}>
      <CardHeader className="pb-2 relative">
        <div className="flex justify-between items-start">
          <CardTitle className={`${task.completed ? 'line-through text-muted-foreground' : ''}`}>
            {task.title}
          </CardTitle>
          <div className="flex flex-col items-end">
            <Badge variant="outline" className="flex items-center animate-pulse mb-1">
              <Star className={`h-3 w-3 mr-1 fill-epic-yellow stroke-epic-yellow ${task.xpReward >= 50 ? 'animate-pulse' : ''}`} />
              <span className="font-bold text-epic-yellow">{task.xpReward} XP</span>
            </Badge>
            <span className={`text-xs font-semibold ${getRarityColorClass()}`}>
              {getRarityLabel()}
            </span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <p className={`text-sm ${task.completed ? 'text-muted-foreground' : ''}`}>
          {task.description}
        </p>
        
        <div className="flex flex-wrap gap-2 mt-3">
          {getDeadlineDisplay()}
          
          {task.completed && (
            <Badge variant="default" className="bg-epic-green text-white animate-bounce-in">
              <CheckCircle2 className="h-3 w-3 mr-1" />
              Completed
            </Badge>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="pt-1">
        {task.completed ? (
          <div className="w-full text-right text-xs text-muted-foreground">
            <span className="flex items-center justify-end">
              <Award className="h-3 w-3 mr-1 text-epic-green" />
              Completed {formatDistanceToNow(parseISO(task.completedAt!), { addSuffix: true })}
            </span>
          </div>
        ) : (
          <div className="flex w-full justify-between gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="flex-1 hover:bg-destructive/10 hover:text-destructive">
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </DialogTrigger>
              <DialogContent className="border-2 border-destructive/50">
                <DialogHeader>
                  <DialogTitle>Confirm Deletion</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to delete this quest? This action cannot be undone.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button variant="outline" onClick={() => {}}>Cancel</Button>
                  <Button variant="destructive" onClick={handleDelete}>Delete</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            
            <Button variant="outline" size="sm" className="flex-1 hover:bg-blue-500/10 hover:text-blue-500" onClick={onEdit}>
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Button>
            
            <Button 
              variant="default" 
              size="sm" 
              className="flex-1 bg-epic-green hover:bg-epic-green/90 animate-pulse-scale"
              onClick={handleComplete}
            >
              <CheckCircle2 className="h-4 w-4 mr-1" />
              Complete
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default TaskCard;
