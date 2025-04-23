
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/types';
import { getUser } from '@/utils/storage';
import { toast } from '@/hooks/use-toast';
import { processDailyLogin, refreshDailyTasksIfNeeded } from '@/utils/gamification';
import { initializeTelegram, authenticateTelegram, isRunningInTelegram } from '@/services/telegramService';
import { mockTelegramLogin } from '@/utils/telegramMock'; // Giữ lại để sử dụng trong môi trường phát triển

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
    // Khởi tạo Telegram API
    initializeTelegram();
    
    // Kiểm tra xem người dùng đã đăng nhập chưa
    const storedUser = getUser();
    if (storedUser) {
      // Nếu trường tokens không tồn tại, khởi tạo nó
      if (storedUser.tokens === undefined) {
        storedUser.tokens = 0;
        storedUser.lastDailyLogin = null;
        storedUser.dailyLoginStreak = 0;
      }
      
      setUser(storedUser);
      
      // Xử lý phần thưởng đăng nhập hàng ngày
      try {
        const { isFirstLogin, tokensAwarded, currentStreak } = processDailyLogin();
        
        if (isFirstLogin && tokensAwarded > 0) {
          toast({
            title: "Daily Login Reward!",
            description: `You received ${tokensAwarded} tokens for logging in today! Current streak: ${currentStreak} days.`,
          });
        }
        
        // Làm mới nhiệm vụ hàng ngày nếu cần
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
      
      let loggedInUser: User;
      
      // Kiểm tra xem ứng dụng có đang chạy trong Telegram không
      if (isRunningInTelegram()) {
        // Xác thực với Telegram thực
        loggedInUser = await authenticateTelegram();
      } else {
        // Sử dụng mock cho môi trường phát triển
        console.warn('Using mock Telegram login for development');
        loggedInUser = await mockTelegramLogin();
      }
      
      // Khởi tạo tokens nếu không có
      if (loggedInUser.tokens === undefined) {
        loggedInUser.tokens = 0;
        loggedInUser.lastDailyLogin = null;
        loggedInUser.dailyLoginStreak = 0;
      }
      
      setUser(loggedInUser);
      
      // Xử lý phần thưởng đăng nhập hàng ngày và làm mới nhiệm vụ
      try {
        const { isFirstLogin, tokensAwarded, currentStreak } = processDailyLogin();
        
        if (isFirstLogin && tokensAwarded > 0) {
          toast({
            title: "Daily Login Reward!",
            description: `You received ${tokensAwarded} tokens for logging in today! Current streak: ${currentStreak} days.`,
          });
        }
        
        // Làm mới nhiệm vụ hàng ngày nếu cần
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
    // Lưu ý: Trong Mini App Telegram thực, chúng ta thường không đăng xuất người dùng
    // vì xác thực được xử lý bởi Telegram
    setUser(null);
    
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
