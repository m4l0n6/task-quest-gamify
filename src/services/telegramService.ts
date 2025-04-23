
import api from './api';
import { User } from '@/types';
import { getUser, saveUser } from '@/utils/storage';

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
  // Thêm script Telegram Web App nếu chưa được thêm
  if (!window.Telegram) {
    const script = document.createElement('script');
    script.src = 'https://telegram.org/js/telegram-web-app.js';
    script.async = true;
    document.head.appendChild(script);
  }
};

// Xác thực người dùng Telegram
export const authenticateTelegram = async (): Promise<User> => {
  try {
    // Kiểm tra xem Telegram WebApp đã được khởi tạo chưa
    if (!window.Telegram || !window.Telegram.WebApp) {
      throw new Error('Telegram WebApp is not initialized');
    }
    
    // Lấy initData từ Telegram WebApp
    const initData = window.Telegram.WebApp.initData;
    
    if (!initData) {
      throw new Error('No Telegram init data available');
    }
    
    // Lấy thông tin người dùng từ local storage nếu đã xác thực trước đó
    const existingUser = getUser();
    if (existingUser) {
      // Cập nhật thời gian đăng nhập gần nhất
      existingUser.lastLoginAt = new Date().toISOString();
      saveUser(existingUser);
      return existingUser;
    }
    
    // Gọi API để xác thực người dùng
    const response = await api.post('/auth/telegram', { initData });
    
    if (!response.data.success) {
      throw new Error('Authentication failed');
    }
    
    // Lưu thông tin người dùng vào local storage
    const userData = response.data.user;
    saveUser(userData);
    
    return userData;
  } catch (error) {
    console.error('Telegram authentication failed:', error);
    throw error;
  }
};

// Lấy thông tin người dùng từ Telegram
export const getTelegramUser = (): TelegramAuthData | null => {
  if (!window.Telegram || !window.Telegram.WebApp || !window.Telegram.WebApp.initDataUnsafe) {
    return null;
  }
  
  return window.Telegram.WebApp.initDataUnsafe.user || null;
};

// Kiểm tra xem app có đang chạy trong Telegram hay không
export const isRunningInTelegram = (): boolean => {
  return !!window.Telegram && !!window.Telegram.WebApp;
};
