// Importación del servicio de API para hacer peticiones HTTP
import api from './api';
// Importación de AsyncStorage para almacenar datos localmente
import AsyncStorage from '@react-native-async-storage/async-storage';

// Objeto que contiene todas las funciones de autenticación
export const authService = {
  // Función para iniciar sesión de usuario
  async login(email, password) {
    try {
      // Hacer petición POST al endpoint de login
      const response = await api.post('/usuarios/login-user', {
        email, // Email del usuario
        password // Contraseña del usuario
      });
      
      // Mostrar en consola la respuesta completa del servidor para debugging
      console.log('Respuesta completa del servidor:', JSON.stringify(response.data, null, 2));
      
      // Verificar que el usuario tenga rol de usuario (3) - solo estudiantes
      const userRole = response.data.rol_id;
      console.log('Rol detectado:', userRole, 'Tipo:', typeof userRole);
      
      // Convertir a número si es string
      const roleNumber = parseInt(userRole);
      console.log('Rol convertido a número:', roleNumber);
      
      // Validar que el rol sea 3 (estudiante)
      if (!roleNumber || isNaN(roleNumber) || roleNumber !== 3) {
        console.log('Rol inválido para app móvil:', roleNumber);
        throw { message: 'Solo los usuarios (estudiantes) pueden acceder a la aplicación móvil' };
      }
      
      // Si hay token en la respuesta, guardar datos de sesión
      if (response.data.token) {
        // Guardar token JWT en AsyncStorage
        await AsyncStorage.setItem('jwtToken', response.data.token);
        
        // Formatear datos del usuario para almacenar localmente
        const userInfo = {
          id: response.data.id, // ID del usuario
          nombres: response.data.userName, // Nombre del usuario
          correo: response.data.email, // Email del usuario
          codigo: response.data.codigo, // Código de estudiante
          rol_id: roleNumber, // ID del rol (siempre 3 para estudiantes)
          token: response.data.token // Token JWT
        };
        
        // Guardar datos del usuario en AsyncStorage
        await AsyncStorage.setItem('userData', JSON.stringify(userInfo));
      }
      
      // Retornar los datos de la respuesta
      return response.data;
    } catch (error) {
      // Mostrar error en consola para debugging
      console.error('Error en login:', error);
      
      // Manejar diferentes tipos de errores de red
      if (error.code === 'NETWORK_ERROR' || error.message === 'Network Error') {
        throw { message: 'Error de conexión. Verifica tu conexión a internet y que el servidor esté funcionando.' };
      }
      
      // Manejar error de credenciales incorrectas
      if (error.response?.status === 401) {
        throw { message: 'Email o contraseña incorrectos' };
      }
      
      // Manejar error de permisos insuficientes
      if (error.response?.status === 403) {
        throw { message: 'No tienes permisos para acceder a la aplicación móvil' };
      }
      
      // Manejar error de servicio no disponible
      if (error.response?.status === 404) {
        throw { message: 'Servicio no disponible. Verifica la configuración del servidor.' };
      }
      
      // Manejar errores específicos del servidor
      if (error.response?.data?.message) {
        throw { message: error.response.data.message };
      }
      
      // Manejar errores genéricos
      throw error.response?.data || { message: 'Error inesperado. Intenta nuevamente.' };
    }
  },

  // Función para registrar un nuevo usuario
  async register(userData) {
    try {
      // Solo permitir registro como usuario (rol_id: 3) - estudiantes únicamente
      const userDataWithRole = {
        ...userData, // Datos del usuario (nombre, email, código, contraseña)
        rol_id: '3' // Forzar rol de usuario (estudiante)
      };
      
      // Mostrar en consola los datos que se van a enviar
      console.log('Datos de registro:', userDataWithRole);
      
      // Hacer petición POST al endpoint de registro
      const response = await api.post('/usuarios/create-user', userDataWithRole);
      
      // Si hay token en la respuesta, guardar datos de sesión
      if (response.data.token) {
        // Guardar token JWT en AsyncStorage
        await AsyncStorage.setItem('jwtToken', response.data.token);
        
        // Formatear datos del usuario para almacenar localmente
        const userInfo = {
          id: response.data.id, // ID del usuario
          nombres: response.data.userName, // Nombre del usuario
          correo: response.data.email, // Email del usuario
          codigo: response.data.codigo, // Código de estudiante
          rol_id: response.data.rol_id, // ID del rol
          token: response.data.token // Token JWT
        };
        
        // Guardar datos del usuario en AsyncStorage
        await AsyncStorage.setItem('userData', JSON.stringify(userInfo));
      }
      
      // Retornar los datos de la respuesta
      return response.data;
    } catch (error) {
      // Mostrar error en consola para debugging
      console.error('Error en registro:', error);
      
      // Manejar diferentes tipos de errores de red
      if (error.code === 'NETWORK_ERROR' || error.message === 'Network Error') {
        throw { message: 'Error de conexión. Verifica tu conexión a internet y que el servidor esté funcionando.' };
      }
      
      // Manejar error de datos inválidos
      if (error.response?.status === 400) {
        const errorMessage = error.response.data?.message || 'Datos inválidos';
        throw { message: errorMessage };
      }
      
      // Manejar error de email ya registrado
      if (error.response?.status === 409) {
        throw { message: 'El email ya está registrado' };
      }
      
      // Manejar error de servicio no disponible
      if (error.response?.status === 404) {
        throw { message: 'Servicio no disponible. Verifica la configuración del servidor.' };
      }
      
      // Manejar errores específicos del servidor
      if (error.response?.data?.message) {
        throw { message: error.response.data.message };
      }
      
      // Manejar errores genéricos
      throw error.response?.data || { message: 'Error inesperado. Intenta nuevamente.' };
    }
  },

  // Función para verificar si el token es válido
  async verifyToken() {
    try {
      // Hacer petición GET al endpoint de verificación
      const response = await api.get('/usuarios/verify');
      // Retornar los datos de la respuesta
      return response.data;
    } catch (error) {
      // Mostrar error en consola para debugging
      console.error('Error verificando token:', error);
      // Retornar error de conexión
      throw error.response?.data || { message: 'Error de conexión' };
    }
  },

  // Función para cerrar sesión
  async logout() {
    try {
      // Remover token JWT del almacenamiento local
      await AsyncStorage.removeItem('jwtToken');
      // Remover datos del usuario del almacenamiento local
      await AsyncStorage.removeItem('userData');
      // Retornar objeto de éxito
      return { success: true };
    } catch (error) {
      // Mostrar error en consola para debugging
      console.error('Error en logout:', error);
      // Propagar el error
      throw error;
    }
  },

  // Función para obtener los datos del usuario almacenados localmente
  async getUserData() {
    try {
      // Obtener datos del usuario desde AsyncStorage
      const userData = await AsyncStorage.getItem('userData');
      // Retornar datos parseados o null si no hay datos
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      // Mostrar error en consola para debugging
      console.error('Error al obtener datos del usuario:', error);
      // Retornar null si hay error
      return null;
    }
  },

  // Función para verificar si hay una sesión activa
  async isAuthenticated() {
    try {
      // Obtener token JWT desde AsyncStorage
      const token = await AsyncStorage.getItem('jwtToken');
      // Retornar true si hay token, false si no hay
      return !!token;
    } catch (error) {
      // Retornar false si hay error
      return false;
    }
  },

  // Función para limpiar datos de sesión (para casos de error)
  async clearSession() {
    try {
      // Remover token JWT del almacenamiento local
      await AsyncStorage.removeItem('jwtToken');
      // Remover datos del usuario del almacenamiento local
      await AsyncStorage.removeItem('userData');
    } catch (error) {
      // Mostrar error en consola para debugging
      console.error('Error limpiando sesión:', error);
    }
  }
}; 