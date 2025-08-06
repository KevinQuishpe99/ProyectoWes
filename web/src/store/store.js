// Importación de configureStore de Redux Toolkit para crear el store
import { configureStore } from '@reduxjs/toolkit';
// Importación de los reducers específicos de cada módulo
import authReducer from '../servicios/auth/authSlice';
import canchasReducer from '../servicios/canchas/canchasSlice';
import reservasReducer from '../servicios/reservas/reservasSlice';
import eventosReducer from '../servicios/eventos/eventosSlice';
import feedbackReducer from '../servicios/feedback/feedbackSlice';

// Configuración del store principal de Redux
export const store = configureStore({
  // Configuración de los reducers que manejan el estado de cada módulo
  reducer: {
    auth: authReducer,        // Estado de autenticación (login, logout, usuario)
    canchas: canchasReducer,  // Estado de las canchas deportivas
    reservas: reservasReducer, // Estado de las reservas de canchas
    eventos: eventosReducer,   // Estado de los eventos deportivos
    feedback: feedbackReducer, // Estado de los feedbacks de usuarios
  },
}); 
