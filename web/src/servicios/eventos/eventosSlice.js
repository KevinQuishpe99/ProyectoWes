import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import EventosService from './eventosService';

// Async thunks
export const fetchEventos = createAsyncThunk(
  'eventos/fetchEventos',
  async (params = {}, { rejectWithValue }) => {
    try {
      return await EventosService.getEventos(params);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar eventos');
    }
  }
);

export const createEvento = createAsyncThunk(
  'eventos/createEvento',
  async (eventoData, { rejectWithValue }) => {
    try {
      return await EventosService.createEvento(eventoData);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al crear evento');
    }
  }
);

export const updateEvento = createAsyncThunk(
  'eventos/updateEvento',
  async ({ id, eventoData }, { rejectWithValue }) => {
    try {
      return await EventosService.updateEvento(id, eventoData);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al actualizar evento');
    }
  }
);

export const deleteEvento = createAsyncThunk(
  'eventos/deleteEvento',
  async (id, { rejectWithValue }) => {
    try {
      await EventosService.deleteEvento(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al eliminar evento');
    }
  }
);

const eventosSlice = createSlice({
  name: 'eventos',
  initialState: {
    list: [],
    loading: false,
    error: null,
    estados: []
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setEstados: (state, action) => {
      state.estados = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch eventos
      .addCase(fetchEventos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEventos.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchEventos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create evento
      .addCase(createEvento.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createEvento.fulfilled, (state, action) => {
        state.loading = false;
        state.list.push(action.payload);
      })
      .addCase(createEvento.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update evento
      .addCase(updateEvento.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateEvento.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.list.findIndex(evento => evento.id === action.payload.id);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
      })
      .addCase(updateEvento.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete evento
      .addCase(deleteEvento.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteEvento.fulfilled, (state, action) => {
        state.loading = false;
        state.list = state.list.filter(evento => evento.id !== action.payload);
      })
      .addCase(deleteEvento.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, setEstados } = eventosSlice.actions;
export default eventosSlice.reducer; 
