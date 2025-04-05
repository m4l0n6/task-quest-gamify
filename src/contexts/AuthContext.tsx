
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/types';
import { mockTelegramLogin, initializeTelegramApi } from '@/utils/telegramMock';
import { getUser } from '@/utils/storage';
import { toast } from '@/hooks/use-toast';
import { processDailyLogin, refreshDailyTasksIfNeeded } from '@/utils/gamification';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: () => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Initialize telegram API mock
    initializeTelegramApi();
    
    // Check if user is already logged in
    const storedUser = getUser();
    if (storedUser) {
      // If tokens field doesn't exist, initialize it
      if (storedUser.tokens === undefined) {
        storedUser.tokens = 0;
        storedUser.lastDailyLogin = null;
        storedUser.dailyLoginStreak = 0;
      }
      
      setUser(storedUser);
      
      // Process daily login rewards
      try {
        const { isFirstLogin, tokensAwarded, currentStreak } = processDailyLogin();
        
        if (isFirstLogin && tokensAwarded > 0) {
          toast({
            title: "Daily Login Reward!",
            description: `You received ${tokensAwarded} tokens for logging in today! Current streak: ${currentStreak} days.`,
          });
        }
        
        // Refresh daily tasks if needed
        refreshDailyTasksIfNeeded();
      } catch (err) {
        console.error("Error processing daily login:", err);
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);
      
      // In a real app, this would verify the Telegram auth data
      // For now, we'll use our mock
      const loggedInUser = await mockTelegramLogin();
      
      // Initialize tokens if not present
      if (loggedInUser.tokens === undefined) {
        loggedInUser.tokens = 0;
        loggedInUser.lastDailyLogin = null;
        loggedInUser.dailyLoginStreak = 0;
      }
      
      setUser(loggedInUser);
      
      // Process daily login rewards and refresh tasks
      try {
        const { isFirstLogin, tokensAwarded, currentStreak } = processDailyLogin();
        
        if (isFirstLogin && tokensAwarded > 0) {
          toast({
            title: "Daily Login Reward!",
            description: `You received ${tokensAwarded} tokens for logging in today! Current streak: ${currentStreak} days.`,
          });
        }
        
        // Refresh daily tasks if needed
        refreshDailyTasksIfNeeded();
      } catch (err) {
        console.error("Error processing daily login:", err);
      }
      
      toast({
        title: "Login Successful",
        description: `Welcome back, ${loggedInUser.username}!`,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to login';
      setError(errorMessage);
      toast({
        title: "Login Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const logout = (): void => {
    setUser(null);
    // Note: In a real Telegram Mini App, we wouldn't actually logout the user
    // since authentication is handled by Telegram, but we'll keep this for demo purposes
    
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully.",
    });
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, error, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
