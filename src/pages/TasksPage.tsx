
import React from 'react';
import TaskList from '@/components/tasks/TaskList';
import { Star, Swords } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const TasksPage: React.FC = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className="max-w-full">
      <div className={`mb-4 ${isMobile ? 'flex flex-col gap-2' : 'flex items-center'}`}>
        <div className="flex items-center">
          <Swords className="h-5 w-5 mr-1.5 text-epic-purple" />
          <h1 className="text-lg md:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-epic-purple to-epic-blue">
            Your Quests
          </h1>
        </div>
        
        <div className={`${isMobile ? 'w-full' : 'ml-auto'} flex items-center px-2 py-1 bg-black/5 rounded-full text-sm`}>
          <Star className="h-3.5 w-3.5 mr-1 text-epic-yellow fill-epic-yellow" />
          <span className="font-medium text-xs truncate">Complete quests to earn XP!</span>
        </div>
      </div>
      <TaskList />
    </div>
  );
};

export default TasksPage;
