import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_CONFIG, STORAGE_KEYS } from '../config/constants';

// Crear instancia de axios
const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token JWT automáticamente
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem(STORAGE_KEYS.JWT);
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
        await AsyncStorage.removeItem(STORAGE_KEYS.JWT);
        await AsyncStorage.removeItem(STORAGE_KEYS.USER_DATA);
        console.log('Sesión expirada, redirigiendo a login');
      } catch (storageError) {
        console.error('Error al limpiar almacenamiento:', storageError);
      }
    }
    return Promise.reject(error);
  }
);

export default api; 