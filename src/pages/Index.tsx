
import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { initializeTelegram } from '@/services/telegramService';

const Index = () => {
  useEffect(() => {
    // Khởi tạo Telegram Mini App
    try {
      initializeTelegram();
    } catch (error) {
      console.error('Failed to initialize Telegram API:', error);
    }
  }, []);

  return <Navigate to="/" replace />;
};

export default Index;
