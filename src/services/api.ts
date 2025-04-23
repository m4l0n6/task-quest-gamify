
import axios from 'axios';

const BASE_URL = 'https://your-backend-url.com/api'; // Thay đổi URL này thành backend thực của bạn

// Khởi tạo axios instance với cấu hình cơ bản
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

export default api;
