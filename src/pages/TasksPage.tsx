
import React from 'react';
import TaskList from '@/components/tasks/TaskList';
import { Star, Swords } from 'lucide-react';

const TasksPage: React.FC = () => {
  return (
    <div>
      <div className="mb-6 flex items-center">
        <Swords className="h-8 w-8 mr-2 text-epic-purple" />
        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-epic-purple to-epic-blue">Your Quests</h1>
        <div className="ml-auto flex items-center px-3 py-1 bg-black/5 rounded-full text-sm">
          <Star className="h-4 w-4 mr-1 text-epic-yellow fill-epic-yellow" />
          <span className="font-medium">Complete quests to earn XP and level up!</span>
        </div>
      </div>
      <TaskList />
    </div>
  );
};

export default TasksPage;
