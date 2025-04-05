
import React from 'react';
import { DailyTask } from '@/types';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Coins, Calendar, CheckCircle2 } from 'lucide-react';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface DailyTaskCardProps {
  task: DailyTask;
}

const DailyTaskCard: React.FC<DailyTaskCardProps> = ({ task }) => {
  const progress = Math.min(100, (task.progress / task.requirement) * 100);
  
  // Format expiry date
  const expiryDate = new Date(task.expiresAt);
  const formattedExpiry = format(expiryDate, 'MMM d, h:mm a');
  
  // Get badge variant based on completion status
  const getBadgeVariant = () => {
    if (task.completed) return "success";
    const now = new Date();
    const expiry = new Date(task.expiresAt);
    return now > expiry ? "destructive" : "outline";
  };
  
  // Get task type icon
  const getTaskTypeIcon = () => {
    switch (task.type) {
      case 'login':
        return <Calendar className="h-5 w-5 mr-2" />;
      case 'complete_task':
        return <CheckCircle2 className="h-5 w-5 mr-2" />;
      case 'reach_streak':
        return <Calendar className="h-5 w-5 mr-2" />;
      default:
        return <CheckCircle2 className="h-5 w-5 mr-2" />;
    }
  };
  
  return (
    <Card className={cn(
      "border-2 transform hover:translate-y-[-2px] transition-all shadow-sm",
      task.completed ? "border-green-500/50 bg-green-50/10" : ""
    )}>
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex items-center">
            {getTaskTypeIcon()}
            <div>
              <h3 className="font-medium">{task.title}</h3>
              <p className="text-sm text-muted-foreground">{task.description}</p>
            </div>
          </div>
          <Badge variant={getBadgeVariant()} className="ml-2 flex items-center">
            <Coins className="h-3 w-3 mr-1" />
            {task.tokenReward}
          </Badge>
        </div>
        
        <div className="mt-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span>{task.progress}/{task.requirement}</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between text-sm">
        <span className="text-muted-foreground flex items-center">
          <Calendar className="h-3 w-3 mr-1" />
          Expires: {formattedExpiry}
        </span>
        {task.completed && (
          <Badge variant="success" className="text-xs">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Completed
          </Badge>
        )}
      </CardFooter>
    </Card>
  );
};

export default DailyTaskCard;
