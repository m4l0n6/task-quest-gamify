
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Task } from '@/types';
import { getTasks, saveTasks, addTask as storageAddTask, updateTask as storageUpdateTask, deleteTask as storageDeleteTask } from '@/utils/storage';
import { completeTask } from '@/utils/gamification';
import { useAuth } from './AuthContext';
import { toast } from '@/hooks/use-toast';

interface TaskContextType {
  tasks: Task[];
  isLoading: boolean;
  addTask: (taskData: Omit<Task, 'id' | 'completed' | 'createdAt' | 'completedAt' | 'userId' | 'tokenReward'>) => void;
  updateTask: (taskId: string, taskData: Partial<Task>) => void;
  deleteTask: (taskId: string) => void;
  markTaskComplete: (taskId: string) => void;
  getTodayTasksCount: () => number;
  getCompletedTasksCount: () => number;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadTasks();
    }
  }, [user]);

  const loadTasks = () => {
    setIsLoading(true);
    try {
      const loadedTasks = getTasks().filter(task => task.userId === user?.id);
      setTasks(loadedTasks);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load your tasks.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addTask = (taskData: Omit<Task, 'id' | 'completed' | 'createdAt' | 'completedAt' | 'userId' | 'tokenReward'>) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to add tasks.",
        variant: "destructive",
      });
      return;
    }
    
    // Check if user has reached the daily limit (10 tasks)
    if (getTodayTasksCount() >= 10) {
      toast({
        title: "Daily Limit Reached",
        description: "You can only create 10 tasks per day to prevent cheating.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // Calculate token reward based on XP (default to 20% of XP)
      const xpReward = Math.min(taskData.xpReward, 100); // Cap XP reward at 100
      const tokenReward = Math.ceil(xpReward * 0.2);
      
      const newTask: Task = {
        id: uuidv4(),
        title: taskData.title,
        description: taskData.description,
        deadline: taskData.deadline,
        xpReward,
        tokenReward,
        completed: false,
        createdAt: new Date().toISOString(),
        completedAt: null,
        userId: user.id
      };
      
      storageAddTask(newTask);
      setTasks(prevTasks => [...prevTasks, newTask]);
      
      toast({
        title: "Task Added",
        description: `"${newTask.title}" has been added to your tasks.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add the task.",
        variant: "destructive",
      });
    }
  };

  const updateTask = (taskId: string, taskData: Partial<Task>) => {
    try {
      const taskIndex = tasks.findIndex(task => task.id === taskId);
      
      if (taskIndex === -1) {
        toast({
          title: "Error",
          description: "Task not found.",
          variant: "destructive",
        });
        return;
      }
      
      // Prevent updating completed tasks
      if (tasks[taskIndex].completed) {
        toast({
          title: "Cannot Update",
          description: "Completed tasks cannot be updated.",
          variant: "destructive",
        });
        return;
      }
      
      const updatedTask = {
        ...tasks[taskIndex],
        ...taskData,
        // Cap XP reward if it's being updated
        xpReward: taskData.xpReward !== undefined ? Math.min(taskData.xpReward, 100) : tasks[taskIndex].xpReward,
        // Update token reward if XP changed
        tokenReward: taskData.xpReward !== undefined 
          ? Math.ceil(Math.min(taskData.xpReward, 100) * 0.2) 
          : tasks[taskIndex].tokenReward
      };
      
      storageUpdateTask(updatedTask);
      
      const updatedTasks = [...tasks];
      updatedTasks[taskIndex] = updatedTask;
      setTasks(updatedTasks);
      
      toast({
        title: "Task Updated",
        description: `"${updatedTask.title}" has been updated.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update the task.",
        variant: "destructive",
      });
    }
  };

  const deleteTask = (taskId: string) => {
    try {
      const taskToDelete = tasks.find(task => task.id === taskId);
      
      if (!taskToDelete) {
        toast({
          title: "Error",
          description: "Task not found.",
          variant: "destructive",
        });
        return;
      }
      
      // Prevent deleting completed tasks
      if (taskToDelete.completed) {
        toast({
          title: "Cannot Delete",
          description: "Completed tasks cannot be deleted.",
          variant: "destructive",
        });
        return;
      }
      
      storageDeleteTask(taskId);
      setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
      
      toast({
        title: "Task Deleted",
        description: `"${taskToDelete.title}" has been deleted.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete the task.",
        variant: "destructive",
      });
    }
  };

  const markTaskComplete = (taskId: string) => {
    try {
      const { task, xpGained, tokenGained, leveledUp } = completeTask(taskId);
      
      // Update local task state
      setTasks(prevTasks => 
        prevTasks.map(t => 
          t.id === taskId 
            ? { ...t, completed: true, completedAt: new Date().toISOString() } 
            : t
        )
      );
      
      // Show toast with animation
      toast({
        title: "Task Completed!",
        description: `You earned ${xpGained} XP and ${tokenGained} tokens${leveledUp ? " and leveled up!" : "!"}`,
        variant: "default",
      });
      
      // Force reload tasks to ensure sync with storage
      loadTasks();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to complete the task.";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };
  
  // Get the number of tasks created today
  const getTodayTasksCount = () => {
    if (!user) return 0;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return tasks.filter(task => {
      const taskDate = new Date(task.createdAt);
      return taskDate >= today && task.userId === user.id;
    }).length;
  };
  
  // Get the number of completed tasks
  const getCompletedTasksCount = () => {
    if (!user) return 0;
    return tasks.filter(task => task.completed && task.userId === user.id).length;
  };

  return (
    <TaskContext.Provider 
      value={{ 
        tasks, 
        isLoading, 
        addTask, 
        updateTask, 
        deleteTask, 
        markTaskComplete,
        getTodayTasksCount,
        getCompletedTasksCount
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTask = (): TaskContextType => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTask must be used within a TaskProvider');
  }
  return context;
};
