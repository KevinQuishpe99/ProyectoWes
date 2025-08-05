import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AuthService from './AuthService';

export const login = createAsyncThunk('auth/login', async (credentials) => {
  const result = await AuthService.login(credentials);
  return result;
});

export const register = createAsyncThunk('auth/register', async (userData) => {
  const result = await AuthService.register(userData);
  return result;
});

export const verifyToken = createAsyncThunk('auth/verifyToken', async () => {
  const result = await AuthService.verifyToken();
  return result;
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: AuthService.getUser(),
    loading: false,
    error: null,
    isAuthenticated: AuthService.isAuthenticated(),
  },
  reducers: {
    logout: (state) => {
      AuthService.logout();
      state.user = null;
      state.isAuthenticated = false;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        // Crear objeto de usuario con el formato correcto
        state.user = {
          id: action.payload.id,
          nombres: action.payload.userName,
          correo: action.payload.email,
          rol: action.payload.rol || 'usuario',
          token: action.payload.token
        };
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Register
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        // Crear objeto de usuario con el formato correcto
        state.user = {
          id: action.payload.id,
          nombres: action.payload.userName,
          correo: action.payload.email,
                     rol: 'usuario', // Por defecto
          token: action.payload.token
        };
        state.isAuthenticated = true;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Verify Token
      .addCase(verifyToken.pending, (state) => {
        state.loading = true;
      })
      .addCase(verifyToken.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(verifyToken.rejected, (state) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
        AuthService.logout();
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer; 
