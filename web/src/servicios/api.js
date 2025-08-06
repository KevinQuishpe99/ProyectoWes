// Archivo de configuración del cliente HTTP para las peticiones a la API
import axios from 'axios';

// URL base del servidor backend
const apiUrl = 'http://192.168.100.9:3001/api';

// Crear instancia de Axios con configuración personalizada
const api = axios.create({
  baseURL: apiUrl, // URL base para todas las peticiones
  timeout: 15000, // Tiempo de espera de 15 segundos para las peticiones
});

// Logs para debugging de la configuración de la API
console.log('🔍 API Base URL:', apiUrl);
console.log('🔍 API Config:', api.defaults.baseURL);

// Interceptor para agregar el token JWT automáticamente a todas las peticiones
api.interceptors.request.use(
  (config) => {
    // Obtener el token JWT desde localStorage
    const token = localStorage.getItem('token');
    // Si existe un token, agregarlo al header Authorization
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Retornar la configuración modificada
    return config;
  },
  (error) => Promise.reject(error) // Propagar errores de configuración
);

// Interceptor para manejar errores de autenticación en las respuestas
api.interceptors.response.use(
  (response) => response, // Si la respuesta es exitosa, retornarla tal como está
  (error) => {
    // Si el error es 401 (no autorizado), limpiar la sesión
    if (error.response?.status === 401) {
      // Remover token JWT del localStorage
      localStorage.removeItem('token');
      // Remover datos del usuario del localStorage
      localStorage.removeItem('user');
      // Redirigir al login si no estamos ya en esa página
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    // Propagar el error para que sea manejado por los componentes
    return Promise.reject(error);
  }
);

// Exportar la instancia configurada de Axios
export default api;
