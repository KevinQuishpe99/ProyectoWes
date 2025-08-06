// Importación de createSlice y createAsyncThunk de Redux Toolkit
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// Importación del servicio de autenticación
import AuthService from './AuthService';

// Thunk asíncrono para el proceso de login
export const login = createAsyncThunk('auth/login', async (credentials) => {
  // Llamar al servicio de autenticación para hacer login
  const result = await AuthService.login(credentials);
  return result;
});

// Thunk asíncrono para el proceso de registro
export const register = createAsyncThunk('auth/register', async (userData) => {
  // Llamar al servicio de autenticación para registrar usuario
  const result = await AuthService.register(userData);
  return result;
});

// Thunk asíncrono para verificar el token de autenticación
export const verifyToken = createAsyncThunk('auth/verifyToken', async () => {
  // Llamar al servicio de autenticación para verificar token
  const result = await AuthService.verifyToken();
  return result;
});

// Creación del slice de autenticación con Redux Toolkit
const authSlice = createSlice({
  name: 'auth', // Nombre del slice
  // Estado inicial del slice de autenticación
  initialState: {
    user: AuthService.getUser(), // Obtener usuario desde localStorage
    loading: false, // Estado de carga
    error: null, // Estado de error
    isAuthenticated: AuthService.isAuthenticated(), // Verificar si está autenticado
  },
  // Reducers síncronos para acciones simples
  reducers: {
    // Reducer para hacer logout
    logout: (state) => {
      // Llamar al servicio para limpiar localStorage
      AuthService.logout();
      // Limpiar el estado del usuario
      state.user = null;
      // Marcar como no autenticado
      state.isAuthenticated = false;
    },
    // Reducer para limpiar errores
    clearError: (state) => {
      state.error = null;
    },
  },
  // Extra reducers para manejar acciones asíncronas
  extraReducers: (builder) => {
    builder
      // Casos para el proceso de login
      .addCase(login.pending, (state) => {
        // Estado de carga durante el login
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        // Login exitoso
        state.loading = false;
        // Crear objeto de usuario con el formato correcto
        state.user = {
          id: action.payload.id,
          nombres: action.payload.userName,
          correo: action.payload.email,
          rol: action.payload.rol || 'usuario',
          token: action.payload.token
        };
        // Marcar como autenticado
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state, action) => {
        // Login fallido
        state.loading = false;
        state.error = action.error.message;
      })
      // Casos para el proceso de registro
      .addCase(register.pending, (state) => {
        // Estado de carga durante el registro
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        // Registro exitoso
        state.loading = false;
        // Crear objeto de usuario con el formato correcto
        state.user = {
          id: action.payload.id,
          nombres: action.payload.userName,
          correo: action.payload.email,
          rol: 'usuario', // Por defecto
          token: action.payload.token
        };
        // Marcar como autenticado
        state.isAuthenticated = true;
      })
      .addCase(register.rejected, (state, action) => {
        // Registro fallido
        state.loading = false;
        state.error = action.error.message;
      })
      // Casos para la verificación de token
      .addCase(verifyToken.pending, (state) => {
        // Estado de carga durante la verificación
        state.loading = true;
      })
      .addCase(verifyToken.fulfilled, (state, action) => {
        // Verificación exitosa
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(verifyToken.rejected, (state) => {
        // Verificación fallida
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
        // Limpiar datos de sesión si el token es inválido
        AuthService.logout();
      });
  },
});

// Exportar las acciones del slice
export const { logout, clearError } = authSlice.actions;
// Exportar el reducer del slice
export default authSlice.reducer; 
