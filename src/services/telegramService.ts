
import api from './api';
import { User } from '@/types';
import { getUser, saveUser } from '@/utils/storage';
import { toast } from '@/hooks/use-toast';

interface TelegramAuthData {
  id: number;
  auth_date: number;
  hash: string;
  first_name?: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
}

export const initializeTelegram = (): void => {
  console.log('Initializing Telegram Web App...');
  
  if (!window.Telegram) {
    console.log('Telegram not found in window object, loading script...');
    const script = document.createElement('script');
    script.src = 'https://telegram.org/js/telegram-web-app.js';
    script.async = true;
    script.onload = () => {
      console.log('Telegram Web App script loaded successfully');
    };
    script.onerror = (err) => {
      console.error('Failed to load Telegram Web App script:', err);
    };
    document.head.appendChild(script);
  } else {
    console.log('Telegram already available in window object');
  }
};

export const authenticateTelegram = async (): Promise<User> => {
  try {
    if (!window.Telegram || !window.Telegram.WebApp) {
      const msg = 'Telegram WebApp is not initialized';
      console.error(msg);
      throw new Error(msg);
    }

    const initData = window.Telegram.WebApp.initData;
    
    console.log('Authenticating with Telegram, initData available:', !!initData);
    
    if (!initData) {
      const msg = 'No Telegram init data available';
      console.error(msg);
      throw new Error(msg);
    }

    // Gọi API xác thực
    console.log('Calling authentication API endpoint...');
    const response = await api.post('/auth/telegram', { initData });
    
    console.log('Authentication response received:', response.data);
    
    if (!response.data.user) {
      const msg = 'Authentication failed: User data not found in response';
      console.error(msg, response.data);
      throw new Error(msg);
    }

    // Lưu thông tin user
    const userData = response.data.user;
    console.log('Saving user data:', userData);
    saveUser(userData);
    
    toast({
      title: "Đăng nhập thành công",
      description: `Chào mừng ${userData.username || userData.first_name} đến với EpicTasks!`,
    });
    
    return userData;
  } catch (error) {
    console.error('Telegram authentication failed:', error);
    const errorMsg = error instanceof Error ? error.message : 'Authentication failed';
    toast({
      title: "Đăng nhập thất bại",
      description: errorMsg,
      variant: "destructive",
    });
    throw error;
  }
};

export const getTelegramUser = (): TelegramAuthData | null => {
  if (!window.Telegram?.WebApp?.initDataUnsafe) {
    console.warn('getTelegramUser: No initDataUnsafe available');
    return null;
  }
  
  const { user, auth_date, hash } = window.Telegram.WebApp.initDataUnsafe;
  
  if (!user) {
    console.warn('getTelegramUser: No user data in initDataUnsafe');
    return null;
  }
  
  console.log('getTelegramUser: Found user data', user);
  
  return {
    id: user.id,
    first_name: user.first_name,
    last_name: user.last_name,
    username: user.username,
    photo_url: user.photo_url,
    auth_date,
    hash
  };
};

export const isRunningInTelegram = (): boolean => {
  const result = !!window.Telegram && !!window.Telegram.WebApp;
  console.log('isRunningInTelegram:', result);
  return result;
};
