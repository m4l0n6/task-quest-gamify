
import React from 'react';
import TaskList from '@/components/tasks/TaskList';

const TasksPage: React.FC = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Manage Tasks</h1>
      <TaskList />
    </div>
  );
};

export default TasksPage;
