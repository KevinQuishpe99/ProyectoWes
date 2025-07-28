import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import canchasReducer from '../features/canchas/canchasSlice';
import reservasReducer from '../features/reservas/reservasSlice';
import eventosReducer from '../features/eventos/eventosSlice';
import feedbackReducer from '../features/feedback/feedbackSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    canchas: canchasReducer,
    reservas: reservasReducer,
    eventos: eventosReducer,
    feedback: feedbackReducer,
  },
}); 