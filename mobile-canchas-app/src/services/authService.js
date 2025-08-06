import api from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const authService = {
  // Login de usuario
  async login(email, password) {
    try {
      const response = await api.post('/usuarios/login-user', {
        email,
        password
      });
      
      console.log('Respuesta completa del servidor:', JSON.stringify(response.data, null, 2));
      
      // Verificar que el usuario tenga rol de usuario (3)
      const userRole = response.data.rol_id;
      console.log('Rol detectado:', userRole, 'Tipo:', typeof userRole);
      
      // Convertir a número si es string
      const roleNumber = parseInt(userRole);
      console.log('Rol convertido a número:', roleNumber);
      
      if (!roleNumber || isNaN(roleNumber) || roleNumber !== 3) {
        console.log('Rol inválido para app móvil:', roleNumber);
        throw { message: 'Solo los usuarios (estudiantes) pueden acceder a la aplicación móvil' };
      }
      
      if (response.data.token) {
        // Guardar token y datos del usuario con formato consistente
        await AsyncStorage.setItem('jwtToken', response.data.token);
        
        // Formatear datos del usuario como en la web
        const userInfo = {
          id: response.data.id,
          nombres: response.data.userName,
          correo: response.data.email,
          codigo: response.data.codigo,
          rol_id: roleNumber,
          token: response.data.token
        };
        
        await AsyncStorage.setItem('userData', JSON.stringify(userInfo));
      }
      
      return response.data;
    } catch (error) {
      console.error('Error en login:', error);
      
      // Manejar diferentes tipos de errores
      if (error.code === 'NETWORK_ERROR' || error.message === 'Network Error') {
        throw { message: 'Error de conexión. Verifica tu conexión a internet y que el servidor esté funcionando.' };
      }
      
      if (error.response?.status === 401) {
        throw { message: 'Email o contraseña incorrectos' };
      }
      
      if (error.response?.status === 403) {
        throw { message: 'No tienes permisos para acceder a la aplicación móvil' };
      }
      
      if (error.response?.status === 404) {
        throw { message: 'Servicio no disponible. Verifica la configuración del servidor.' };
      }
      
      // Manejar errores específicos del servidor
      if (error.response?.data?.message) {
        throw { message: error.response.data.message };
      }
      
      throw error.response?.data || { message: 'Error inesperado. Intenta nuevamente.' };
    }
  },

  // Registro de usuario
  async register(userData) {
    try {
      // Solo permitir registro como usuario (rol_id: 3)
      const userDataWithRole = {
        ...userData,
        rol_id: '3' // Forzar rol de usuario
      };
      
      console.log('Datos de registro:', userDataWithRole);
      
      const response = await api.post('/usuarios/create-user', userDataWithRole);
      
      if (response.data.token) {
        // Guardar token y datos del usuario con formato consistente
        await AsyncStorage.setItem('jwtToken', response.data.token);
        
        // Formatear datos del usuario como en la web
        const userInfo = {
          id: response.data.id,
          nombres: response.data.userName,
          correo: response.data.email,
          codigo: response.data.codigo,
          rol_id: response.data.rol_id,
          token: response.data.token
        };
        
        await AsyncStorage.setItem('userData', JSON.stringify(userInfo));
      }
      
      return response.data;
    } catch (error) {
      console.error('Error en registro:', error);
      
      // Manejar diferentes tipos de errores
      if (error.code === 'NETWORK_ERROR' || error.message === 'Network Error') {
        throw { message: 'Error de conexión. Verifica tu conexión a internet y que el servidor esté funcionando.' };
      }
      
      if (error.response?.status === 400) {
        const errorMessage = error.response.data?.message || 'Datos inválidos';
        throw { message: errorMessage };
      }
      
      if (error.response?.status === 409) {
        throw { message: 'El email ya está registrado' };
      }
      
      if (error.response?.status === 404) {
        throw { message: 'Servicio no disponible. Verifica la configuración del servidor.' };
      }
      
      // Manejar errores específicos del servidor
      if (error.response?.data?.message) {
        throw { message: error.response.data.message };
      }
      
      throw error.response?.data || { message: 'Error inesperado. Intenta nuevamente.' };
    }
  },

  // Verificar token
  async verifyToken() {
    try {
      const response = await api.get('/usuarios/verify');
      return response.data;
    } catch (error) {
      console.error('Error verificando token:', error);
      throw error.response?.data || { message: 'Error de conexión' };
    }
  },

  // Logout
  async logout() {
    try {
      await AsyncStorage.removeItem('jwtToken');
      await AsyncStorage.removeItem('userData');
      return { success: true };
    } catch (error) {
      console.error('Error en logout:', error);
      throw error;
    }
  },

  // Obtener datos del usuario almacenados
  async getUserData() {
    try {
      const userData = await AsyncStorage.getItem('userData');
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error al obtener datos del usuario:', error);
      return null;
    }
  },

  // Verificar si hay una sesión activa
  async isAuthenticated() {
    try {
      const token = await AsyncStorage.getItem('jwtToken');
      return !!token;
    } catch (error) {
      return false;
    }
  },

  // Limpiar datos de sesión (para casos de error)
  async clearSession() {
    try {
      await AsyncStorage.removeItem('jwtToken');
      await AsyncStorage.removeItem('userData');
    } catch (error) {
      console.error('Error limpiando sesión:', error);
    }
  }
}; 