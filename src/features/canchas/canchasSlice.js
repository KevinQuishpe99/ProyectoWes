import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getCanchas, createCancha, updateCancha, deleteCancha } from './canchasService';

export const fetchCanchas = createAsyncThunk('canchas/fetchAll', async (_, thunkAPI) => {
  try {
    return await getCanchas();
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
  }
});

export const addCancha = createAsyncThunk('canchas/add', async (data, thunkAPI) => {
  try {
    return await createCancha(data);
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
  }
});

export const editCancha = createAsyncThunk('canchas/edit', async ({ id, data }, thunkAPI) => {
  try {
    return await updateCancha(id, data);
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
  }
});

export const removeCancha = createAsyncThunk('canchas/remove', async (id, thunkAPI) => {
  try {
    await deleteCancha(id);
    return id;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
  }
});

const canchasSlice = createSlice({
  name: 'canchas',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCanchas.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCanchas.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchCanchas.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addCancha.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addCancha.fulfilled, (state, action) => {
        state.loading = false;
        // state.items.push(action.payload);
        // Forzar refetch para datos consistentes
      })
      .addCase(addCancha.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(editCancha.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editCancha.fulfilled, (state, action) => {
        state.loading = false;
        // state.items = state.items.map((c) => c.id === action.payload.id ? action.payload : c);
        // Forzar refetch para datos consistentes
      })
      .addCase(editCancha.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(removeCancha.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeCancha.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter((c) => c.id !== action.payload);
      })
      .addCase(removeCancha.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default canchasSlice.reducer; 