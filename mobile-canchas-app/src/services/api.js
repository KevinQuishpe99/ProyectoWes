// Importación de Axios para hacer peticiones HTTP
import axios from 'axios';
// Importación de AsyncStorage para obtener el token JWT
import AsyncStorage from '@react-native-async-storage/async-storage';

// URL base del servidor backend
const API_BASE_URL = 'http://192.168.100.9:3000/api';
// Tiempo de espera para las peticiones HTTP (en milisegundos)
const HTTP_TIMEOUT = 10000; // 10 segundos

// Crear instancia de Axios con configuración personalizada
const api = axios.create({
  // URL base para todas las peticiones
  baseURL: API_BASE_URL,
  // Tiempo de espera para las peticiones
  timeout: HTTP_TIMEOUT,
  // Headers por defecto
  headers: {
    'Content-Type': 'application/json', // Tipo de contenido JSON
  },
});

// Interceptor para agregar el token JWT a todas las peticiones
api.interceptors.request.use(
  async (config) => {
    try {
      // Obtener el token JWT desde AsyncStorage
      const token = await AsyncStorage.getItem('jwtToken');
      // Si hay token, agregarlo al header Authorization
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      // Retornar la configuración modificada
      return config;
    } catch (error) {
      // Si hay error al obtener el token, continuar sin él
      console.error('Error obteniendo token:', error);
      return config;
    }
  },
  (error) => {
    // Si hay error en la configuración de la petición, rechazarla
    return Promise.reject(error);
  }
);

// Interceptor para manejar las respuestas del servidor
api.interceptors.response.use(
  (response) => {
    // Si la respuesta es exitosa, retornarla tal como está
    return response;
  },
  async (error) => {
    // Si hay error en la respuesta
    if (error.response?.status === 401) {
      // Si el error es 401 (no autorizado), limpiar la sesión
      try {
        // Remover token JWT del almacenamiento local
        await AsyncStorage.removeItem('jwtToken');
        // Remover datos del usuario del almacenamiento local
        await AsyncStorage.removeItem('userData');
        // Aquí podrías redirigir al login o mostrar un mensaje
        console.log('Sesión expirada, datos limpiados');
      } catch (storageError) {
        // Si hay error al limpiar el almacenamiento, mostrarlo en consola
        console.error('Error limpiando sesión:', storageError);
      }
    }
    // Propagar el error para que sea manejado por el componente
    return Promise.reject(error);
  }
);

// Exportar la instancia configurada de Axios
export default api; 