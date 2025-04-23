
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

console.log('API Base URL:', BASE_URL);

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false, // Change to false for development testing
});

// Interceptor để xử lý lỗi
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message || error);
    return Promise.reject(error);
  }
);

// Thêm interceptor để tự động thêm initData vào header nếu có
api.interceptors.request.use((config) => {
  const tg = window.Telegram?.WebApp;
  if (tg) {
    const initData = tg.initData;
    console.log('Adding Telegram initData to request headers', { hasInitData: !!initData });
    config.headers['Telegram-Data'] = initData;
  }
  
  // For development/debugging: Log request info
  console.log(`Sending ${config.method?.toUpperCase()} request to: ${config.baseURL}${config.url}`, {
    headers: config.headers,
    data: config.data
  });
  
  return config;
});

export default api;
