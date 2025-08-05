import api from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../config/constants';

export const authService = {
  // Login de usuario
  async login(email, password) {
    try {
      const response = await api.post('/usuarios/login-user', {
        email,
        password
      });
      
      // Verificar que el usuario tenga rol de usuario (rol_id: 3)
      const userRole = response.data.user?.rol_id || response.data.rol_id;
      if (userRole !== 3) {
        throw { message: 'Solo los usuarios regulares pueden acceder a la aplicación móvil' };
      }
      
      if (response.data.token) {
        // Guardar token y datos del usuario
        await AsyncStorage.setItem(STORAGE_KEYS.JWT, response.data.token);
        await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(response.data));
      }
      
      return response.data;
    } catch (error) {
      console.error('Error en login:', error);
      throw error.response?.data || { message: 'Error de conexión' };
    }
  },

  // Registro de usuario
  async register(userData) {
    try {
      // Asegurar que solo se registren usuarios con rol_id: 3
      const userDataWithRole = {
        ...userData,
        rol_id: '3' // Solo usuarios regulares
      };
      
      const response = await api.post('/usuarios/create-user', userDataWithRole);
      
      if (response.data.token) {
        // Guardar token y datos del usuario
        await AsyncStorage.setItem(STORAGE_KEYS.JWT, response.data.token);
        await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(response.data.user || response.data));
      }
      
      return response.data;
    } catch (error) {
      console.error('Error en registro:', error);
      throw error.response?.data || { message: 'Error de conexión' };
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
      await AsyncStorage.removeItem(STORAGE_KEYS.JWT);
      await AsyncStorage.removeItem(STORAGE_KEYS.USER_DATA);
      return { success: true };
    } catch (error) {
      console.error('Error en logout:', error);
      throw error;
    }
  },

  // Obtener datos del usuario almacenados
  async getUserData() {
    try {
      const userData = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error al obtener datos del usuario:', error);
      return null;
    }
  },

  // Verificar si hay una sesión activa
  async isAuthenticated() {
    try {
      const token = await AsyncStorage.getItem(STORAGE_KEYS.JWT);
      return !!token;
    } catch (error) {
      return false;
    }
  }
}; 