
import React from 'react';
import { Task } from '@/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, CheckCircle2, Edit, Star, Trash2 } from 'lucide-react';
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
      <Badge variant={isPastDeadline ? "destructive" : isTodayDeadline ? "default" : "secondary"}>
        <Calendar className="h-3 w-3 mr-1" />
        {isTodayDeadline 
          ? "Today" 
          : isPastDeadline 
            ? "Overdue" 
            : formatDistanceToNow(deadlineDate, { addSuffix: true })}
      </Badge>
    );
  };
  
  return (
    <Card className={`task-card-hover ${task.completed ? 'bg-muted/50' : ''}`}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className={`${task.completed ? 'line-through text-muted-foreground' : ''}`}>
            {task.title}
          </CardTitle>
          <Badge variant="outline" className="ml-2 flex items-center">
            <Star className="h-3 w-3 mr-1 fill-epic-yellow stroke-epic-yellow" />
            {task.xpReward} XP
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        <p className={`text-sm ${task.completed ? 'text-muted-foreground' : ''}`}>
          {task.description}
        </p>
        
        <div className="flex flex-wrap gap-2 mt-3">
          {getDeadlineDisplay()}
          
          {task.completed && (
            <Badge variant="success" className="bg-epic-green text-white">
              <CheckCircle2 className="h-3 w-3 mr-1" />
              Completed
            </Badge>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="pt-1">
        {task.completed ? (
          <div className="w-full text-right text-xs text-muted-foreground">
            Completed {formatDistanceToNow(parseISO(task.completedAt!), { addSuffix: true })}
          </div>
        ) : (
          <div className="flex w-full justify-between gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="flex-1">
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Confirm Deletion</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to delete this task? This action cannot be undone.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button variant="outline" onClick={() => {}}>Cancel</Button>
                  <Button variant="destructive" onClick={handleDelete}>Delete</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            
            <Button variant="outline" size="sm" className="flex-1" onClick={onEdit}>
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Button>
            
            <Button 
              variant="default" 
              size="sm" 
              className="flex-1 bg-epic-green hover:bg-epic-green/90"
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
