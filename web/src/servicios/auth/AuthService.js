// Importación del cliente HTTP configurado
import api from '../api';

// Objeto que contiene todas las funciones de autenticación
const AuthService = {
  // Función para realizar el login de usuario
  login: async (credentials) => {
    try {
      // Hacer petición POST al endpoint de login del backend
      const response = await api.post('/usuarios/login-user', credentials);
      
      // Guardar token y datos del usuario si la respuesta es exitosa
      if (response.data.token) {
        // Guardar el token JWT en localStorage
        localStorage.setItem('token', response.data.token);
        // Guardar datos del usuario con el formato correcto
        const userData = {
          id: response.data.id || null,
          nombres: response.data.userName,
          correo: response.data.email,
          rol: response.data.rol || 'usuario',
          token: response.data.token
        };
        // Guardar datos del usuario en localStorage como JSON string
        localStorage.setItem('user', JSON.stringify(userData));
      }
      
      // Retornar los datos de la respuesta
      return response.data;
    } catch (error) {
      // Mostrar error en consola para debugging
      console.error('Error en login:', error);
      // Manejar errores específicos del servidor
      if (error.response && error.response.data && error.response.data.message) {
        throw new Error(error.response.data.message);
      }
      // Lanzar error genérico si no hay respuesta específica
      throw new Error('Error de conexión con el servidor');
    }
  },

  // Función para registrar un nuevo usuario
  register: async (userData) => {
    try {
      // Hacer petición POST al endpoint de registro del backend
      const response = await api.post('/usuarios/create-user', userData);
      
      // Guardar token y datos del usuario si la respuesta es exitosa
      if (response.data.token) {
        // Guardar el token JWT en localStorage
        localStorage.setItem('token', response.data.token);
        // Guardar datos del usuario con el formato correcto
        const userInfo = {
          id: response.data.id,
          nombres: response.data.userName,
          correo: response.data.email,
          rol: 'usuario', // Por defecto
          token: response.data.token
        };
        // Guardar datos del usuario en localStorage como JSON string
        localStorage.setItem('user', JSON.stringify(userInfo));
      }
      
      // Retornar los datos de la respuesta
      return response.data;
    } catch (error) {
      // Mostrar error en consola para debugging
      console.error('Error en registro:', error);
      // Manejar errores específicos del servidor
      if (error.response && error.response.data && error.response.data.message) {
        throw new Error(error.response.data.message);
      }
      // Lanzar error genérico si no hay respuesta específica
      throw new Error('Error de conexión con el servidor');
    }
  },

  // Función para verificar si el token es válido
  verifyToken: async () => {
    try {
      // Hacer petición GET al endpoint de verificación del backend
      const response = await api.get('/usuarios/verify');
      // Retornar los datos de la respuesta
      return response.data;
    } catch (error) {
      // Mostrar error en consola para debugging
      console.error('Error verificando token:', error);
      // Propagar el error para que sea manejado por el slice
      throw error;
    }
  },

  // Función para cerrar sesión
  logout: () => {
    // Remover el token JWT del localStorage
    localStorage.removeItem('token');
    // Remover los datos del usuario del localStorage
    localStorage.removeItem('user');
  },

  // Función para obtener los datos del usuario almacenados
  getUser: () => {
    // Obtener datos del usuario desde localStorage
    const user = localStorage.getItem('user');
    // Retornar datos parseados o null si no hay datos
    return user ? JSON.parse(user) : null;
  },

  // Función para verificar si hay una sesión activa
  isAuthenticated: () => {
    // Verificar si existe un token en localStorage
    return !!localStorage.getItem('token');
  }
};

// Exportar el objeto AuthService como default
export default AuthService; 
