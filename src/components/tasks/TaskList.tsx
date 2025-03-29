
import React, { useState } from 'react';
import { Task } from '@/types';
import { useTask } from '@/contexts/TaskContext';
import TaskCard from './TaskCard';
import TaskForm from './TaskForm';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, ListFilter } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import Loading from '../ui/Loading';

const TaskList: React.FC = () => {
  const { tasks, isLoading, addTask, updateTask } = useTask();
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [sortOption, setSortOption] = useState<'newest' | 'oldest' | 'xp-high' | 'xp-low' | 'deadline'>('newest');
  
  // Filter tasks based on the active tab
  const filteredTasks = tasks.filter(task => {
    if (activeTab === 'all') return true;
    if (activeTab === 'active') return !task.completed;
    if (activeTab === 'completed') return task.completed;
    return true;
  });
  
  // Sort the filtered tasks
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    switch (sortOption) {
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'oldest':
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case 'xp-high':
        return b.xpReward - a.xpReward;
      case 'xp-low':
        return a.xpReward - b.xpReward;
      case 'deadline':
        if (!a.deadline) return 1;
        if (!b.deadline) return -1;
        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
      default:
        return 0;
    }
  });
  
  const handleAddTask = (taskData: Omit<Task, 'id' | 'completed' | 'createdAt' | 'completedAt' | 'userId'>) => {
    addTask(taskData);
    setShowAddDialog(false);
  };
  
  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setShowEditDialog(true);
  };
  
  const handleUpdateTask = (taskData: Omit<Task, 'id' | 'completed' | 'createdAt' | 'completedAt' | 'userId'>) => {
    if (editingTask) {
      updateTask(editingTask.id, taskData);
      setShowEditDialog(false);
      setEditingTask(null);
    }
  };
  
  if (isLoading) {
    return <Loading message="Loading tasks..." />;
  }
  
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <Tabs 
          defaultValue="all" 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="w-full"
        >
          <div className="flex justify-between items-center">
            <TabsList>
              <TabsTrigger value="all">All Tasks</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>
            
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <ListFilter className="h-4 w-4 mr-1" />
                    Sort
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setSortOption('newest')}>
                    Newest First
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortOption('oldest')}>
                    Oldest First
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortOption('xp-high')}>
                    Highest XP
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortOption('xp-low')}>
                    Lowest XP
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortOption('deadline')}>
                    Earliest Deadline
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-1" />
                    Add Task
                  </Button>
                </DialogTrigger>
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
            </div>
          </div>
          
          <TabsContent value="all" className="mt-4">
            {sortedTasks.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-muted-foreground mb-4">No tasks found</p>
                <Button onClick={() => setShowAddDialog(true)}>Create your first task</Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {sortedTasks.map(task => (
                  <TaskCard 
                    key={task.id} 
                    task={task} 
                    onEdit={() => handleEditTask(task)} 
                  />
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="active" className="mt-4">
            {sortedTasks.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-muted-foreground mb-4">No active tasks</p>
                <Button onClick={() => setShowAddDialog(true)}>Add a new task</Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {sortedTasks.map(task => (
                  <TaskCard 
                    key={task.id} 
                    task={task} 
                    onEdit={() => handleEditTask(task)} 
                  />
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="completed" className="mt-4">
            {sortedTasks.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-muted-foreground">No completed tasks yet</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {sortedTasks.map(task => (
                  <TaskCard 
                    key={task.id} 
                    task={task} 
                    onEdit={() => handleEditTask(task)} 
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Edit Task Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
          </DialogHeader>
          {editingTask && (
            <TaskForm 
              task={editingTask}
              onSubmit={handleUpdateTask} 
              onCancel={() => {
                setShowEditDialog(false);
                setEditingTask(null);
              }} 
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TaskList;
