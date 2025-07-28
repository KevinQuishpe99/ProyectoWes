import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import FeedbackService from './feedbackService';

// Async thunks
export const fetchFeedbacks = createAsyncThunk(
  'feedback/fetchFeedbacks',
  async (params = {}, { rejectWithValue }) => {
    try {
      return await FeedbackService.getFeedbacks(params);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar feedbacks');
    }
  }
);

export const createFeedback = createAsyncThunk(
  'feedback/createFeedback',
  async (feedbackData, { rejectWithValue }) => {
    try {
      return await FeedbackService.createFeedback(feedbackData);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al crear feedback');
    }
  }
);

export const updateFeedback = createAsyncThunk(
  'feedback/updateFeedback',
  async ({ id, feedbackData }, { rejectWithValue }) => {
    try {
      return await FeedbackService.updateFeedback(id, feedbackData);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al actualizar feedback');
    }
  }
);

export const deleteFeedback = createAsyncThunk(
  'feedback/deleteFeedback',
  async (id, { rejectWithValue }) => {
    try {
      await FeedbackService.deleteFeedback(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al eliminar feedback');
    }
  }
);

export const responderFeedback = createAsyncThunk(
  'feedback/responderFeedback',
  async ({ id, respuesta }, { rejectWithValue }) => {
    try {
      return await FeedbackService.responderFeedback(id, respuesta);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al responder feedback');
    }
  }
);

const feedbackSlice = createSlice({
  name: 'feedback',
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch feedbacks
      .addCase(fetchFeedbacks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFeedbacks.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchFeedbacks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create feedback
      .addCase(createFeedback.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createFeedback.fulfilled, (state, action) => {
        state.loading = false;
        state.list.push(action.payload);
      })
      .addCase(createFeedback.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update feedback
      .addCase(updateFeedback.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateFeedback.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.list.findIndex(feedback => feedback.id === action.payload.id);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
      })
      .addCase(updateFeedback.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete feedback
      .addCase(deleteFeedback.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteFeedback.fulfilled, (state, action) => {
        state.loading = false;
        state.list = state.list.filter(feedback => feedback.id !== action.payload);
      })
      .addCase(deleteFeedback.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Responder feedback
      .addCase(responderFeedback.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(responderFeedback.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.list.findIndex(feedback => feedback.id === action.payload.id);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
      })
      .addCase(responderFeedback.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = feedbackSlice.actions;
export default feedbackSlice.reducer; 