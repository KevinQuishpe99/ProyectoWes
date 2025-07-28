import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../servicios/auth/authSlice';
import canchasReducer from '../servicios/canchas/canchasSlice';
import reservasReducer from '../servicios/reservas/reservasSlice';
import eventosReducer from '../servicios/eventos/eventosSlice';
import feedbackReducer from '../servicios/feedback/feedbackSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    canchas: canchasReducer,
    reservas: reservasReducer,
    eventos: eventosReducer,
    feedback: feedbackReducer,
  },
}); 
