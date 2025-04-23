
import axios from 'axios';

const BASE_URL = 'https://epictask-telegram-mini-app-api.vercel.app/api'; // URL của backend thực

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor để xử lý lỗi
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response || error);
    return Promise.reject(error);
  }
);

// Thêm interceptor để tự động thêm initData vào header nếu có
api.interceptors.request.use((config) => {
  const tg = window.Telegram?.WebApp;
  if (tg) {
    config.headers['Telegram-Data'] = tg.initData;
  }
  return config;
});

export default api;
