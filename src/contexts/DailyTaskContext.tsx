
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { DailyTask } from '@/types';
import { getDailyTasks, saveDailyTasks } from '@/utils/storage';
import { refreshDailyTasksIfNeeded, updateDailyTaskProgress } from '@/utils/gamification';
import { useAuth } from './AuthContext';

interface DailyTaskContextType {
  dailyTasks: DailyTask[];
  isLoading: boolean;
  refreshTasks: () => void;
  getActiveTasksCount: () => number;
  getCompletedTasksCount: () => number;
}

const DailyTaskContext = createContext<DailyTaskContextType | undefined>(undefined);

export const DailyTaskProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [dailyTasks, setDailyTasks] = useState<DailyTask[]>([]);
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
      // Check if tasks need refreshing
      const wasRefreshed = refreshDailyTasksIfNeeded();
      
      // Get latest tasks
      const tasks = getDailyTasks();
      setDailyTasks(tasks);
      
    } catch (error) {
      console.error("Failed to load daily tasks:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshTasks = () => {
    loadTasks();
  };
  
  const getActiveTasksCount = () => {
    return dailyTasks.filter(task => !task.completed).length;
  };
  
  const getCompletedTasksCount = () => {
    return dailyTasks.filter(task => task.completed).length;
  };

  return (
    <DailyTaskContext.Provider 
      value={{ 
        dailyTasks,
        isLoading,
        refreshTasks,
        getActiveTasksCount,
        getCompletedTasksCount
      }}
    >
      {children}
    </DailyTaskContext.Provider>
  );
};

export const useDailyTask = (): DailyTaskContextType => {
  const context = useContext(DailyTaskContext);
  if (context === undefined) {
    throw new Error('useDailyTask must be used within a DailyTaskProvider');
  }
  return context;
};
