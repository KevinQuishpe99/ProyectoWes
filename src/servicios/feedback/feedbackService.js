import api from '../api';

export const getFeedbacksPorUsuario = async (usuarioId) => {
  const res = await api.get(`/feedback/usuario/${usuarioId}`);
  return res.data;
};

const FeedbackService = {
  // Obtener todos los feedbacks
  getFeedbacks: async (params = {}) => {
    const response = await api.get('/feedback', { params });
    return response.data;
  },

  // Obtener feedback por ID
  getFeedbackById: async (id) => {
    const response = await api.get(`/feedback/${id}`);
    return response.data;
  },

  // Crear nuevo feedback
  createFeedback: async (feedbackData) => {
    const response = await api.post('/feedback', feedbackData);
    return response.data;
  },

  // Actualizar feedback
  updateFeedback: async (id, feedbackData) => {
    const response = await api.put(`/feedback/${id}`, feedbackData);
    return response.data;
  },

  // Eliminar feedback
  deleteFeedback: async (id) => {
    const response = await api.delete(`/feedback/${id}`);
    return response.data;
  },

  // Responder feedback
  responderFeedback: async (id, respuesta) => {
    const response = await api.post(`/feedback/${id}/responder`, { respuesta });
    return response.data;
  },

  // Obtener feedbacks por usuario
  getFeedbacksPorUsuario: async (usuarioId) => {
    const response = await api.get('/feedback', { params: { usuario_id: usuarioId } });
    return response.data;
  },

  // Obtener feedbacks por cancha
  getFeedbacksPorCancha: async (canchaId) => {
    const response = await api.get('/feedback', { params: { cancha_id: canchaId } });
    return response.data;
  },

  // Obtener feedbacks por calificación
  getFeedbacksPorCalificacion: async (calificacion) => {
    const response = await api.get('/feedback', { params: { calificacion } });
    return response.data;
  },

  // Obtener feedbacks por fecha específica
  getFeedbacksPorFecha: async (fecha) => {
    const response = await api.get('/feedback', { params: { fecha } });
    return response.data;
  },

  // Obtener feedbacks con filtros combinados
  getFeedbacksConFiltros: async (filtros = {}) => {
    const response = await api.get('/feedback', { params: filtros });
    return response.data;
  },

  getUsuarios: async () => {
    const response = await api.get('/usuarios');
    return response.data;
  },
  getCanchas: async () => {
    const response = await api.get('/canchas');
    return response.data;
  }
};

export default FeedbackService; 
