
import axios from 'axios';

const BASE_URL = 'http://localhost:3000/api/v1'; // Thay đổi URL này thành backend thực của bạn

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
