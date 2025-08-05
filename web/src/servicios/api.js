// api.js
import axios from 'axios';

const apiUrl = 'http://192.168.100.9:3001/api';

const api = axios.create({
  baseURL: apiUrl,
  timeout: 15000,
});

console.log('🔍 API Base URL:', apiUrl);
console.log('🔍 API Config:', api.defaults.baseURL);

// Interceptor para agregar el token automáticamente
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para manejar errores de autenticación
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
