import api from '../api';

const AuthService = {
  // Login con el endpoint correcto del backend
  login: async (credentials) => {
    try {
      const response = await api.post('/usuarios/login-user', credentials);
      
      // Guardar token y datos del usuario
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        // Guardar datos del usuario con el formato correcto
        const userData = {
          id: response.data.id || null,
          nombres: response.data.userName,
          correo: response.data.email,
          rol: response.data.rol || 'usuario',
          token: response.data.token
        };
        localStorage.setItem('user', JSON.stringify(userData));
      }
      
      return response.data;
    } catch (error) {
      console.error('Error en login:', error);
      if (error.response && error.response.data && error.response.data.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Error de conexión con el servidor');
    }
  },

  // Registro de usuario
  register: async (userData) => {
    try {
      const response = await api.post('/usuarios/create-user', userData);
      
      // Guardar token y datos del usuario
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        // Guardar datos del usuario con el formato correcto
        const userInfo = {
          id: response.data.id,
          nombres: response.data.userName,
          correo: response.data.email,
          rol: 'usuario', // Por defecto
          token: response.data.token
        };
        localStorage.setItem('user', JSON.stringify(userInfo));
      }
      
      return response.data;
    } catch (error) {
      console.error('Error en registro:', error);
      if (error.response && error.response.data && error.response.data.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Error de conexión con el servidor');
    }
  },

  // Verificar token
  verifyToken: async () => {
    try {
      const response = await api.get('/usuarios/verify');
      return response.data;
    } catch (error) {
      console.error('Error verificando token:', error);
      throw error;
    }
  },

  // Logout
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Obtener datos del usuario
  getUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // Verificar si está autenticado
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  }
};

export default AuthService; 
