
import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';

const Index = () => {
  useEffect(() => {
    // Initialize the Telegram Mini App mock if needed
    if (typeof window !== 'undefined' && !window.Telegram) {
      try {
        const { initializeTelegramApi } = require('@/utils/telegramMock');
        initializeTelegramApi();
      } catch (error) {
        console.error('Failed to initialize Telegram API:', error);
      }
    }
  }, []);

  return <Navigate to="/" replace />;
};

export default Index;
