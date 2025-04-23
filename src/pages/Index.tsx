
import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { initializeTelegram } from '@/services/telegramService';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const { login } = useAuth();

  useEffect(() => {
    const init = async () => {
      try {
        // Khởi tạo Telegram Mini App
        initializeTelegram();
        
        // Tự động đăng nhập nếu đang chạy trong Telegram
        if (window.Telegram?.WebApp) {
          await login();
        }
      } catch (error) {
        console.error('Failed to initialize Telegram API:', error);
      }
    };

    init();
  }, [login]);

  return <Navigate to="/" replace />;
};

export default Index;
