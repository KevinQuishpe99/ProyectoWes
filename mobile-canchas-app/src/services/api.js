import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Configuración de la API - URL base directa
const API_BASE_URL = 'http://192.168.100.9:3001/api';

// Crear instancia de axios
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token JWT automáticamente
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('jwtToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error al obtener token:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de autenticación
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (error.response?.status === 401) {
      // Token expirado o inválido
      try {
        await AsyncStorage.removeItem('jwtToken');
        await AsyncStorage.removeItem('userData');
        console.log('Sesión expirada, redirigiendo a login');
      } catch (storageError) {
        console.error('Error al limpiar almacenamiento:', storageError);
      }
    }
    return Promise.reject(error);
  }
);

export default api; 