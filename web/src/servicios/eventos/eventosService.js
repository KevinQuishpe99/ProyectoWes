import api from '../api';

const EventosService = {
  // Obtener todos los eventos
  getEventos: async (params = {}) => {
    const response = await api.get('/eventos', { params });
    return response.data;
  },

  // Obtener evento por ID
  getEventoById: async (id) => {
    const response = await api.get(`/eventos/${id}`);
    return response.data;
  },

  // Crear nuevo evento
  createEvento: async (eventoData) => {
    try {
      const response = await api.post('/eventos', eventoData);
      return response.data;
    } catch (error) {
      // Si hay conflicto con reservas, devolver la información del conflicto
      if (error.response?.status === 409 && error.response?.data?.tipo === 'CONFLICTO_RESERVAS') {
        throw {
          tipo: 'CONFLICTO_RESERVAS',
          data: error.response.data
        };
      }
      throw error;
    }
  },

  // Actualizar evento
  updateEvento: async (id, eventoData) => {
    try {
      const response = await api.put(`/eventos/${id}`, eventoData);
      return response.data;
    } catch (error) {
      // Si hay conflicto con reservas, devolver la información del conflicto
      if (error.response?.status === 409 && error.response?.data?.tipo === 'CONFLICTO_RESERVAS') {
        throw {
          tipo: 'CONFLICTO_RESERVAS',
          data: error.response.data
        };
      }
      throw error;
    }
  },

  // Confirmar evento con cancelación de reservas conflictivas
  confirmarEventoConReservas: async (eventoData, reservasACancelar, esActualizacion = false, eventoId = null) => {
    const response = await api.post('/eventos/confirmar-con-reservas', {
      eventoData,
      reservasACancelar,
      esActualizacion,
      eventoId
    });
    return response.data;
  },

  // Eliminar evento
  deleteEvento: async (id) => {
    const response = await api.delete(`/eventos/${id}`);
    return response.data;
  },

  // Obtener estados de evento
  getEstadosEvento: async () => {
    const response = await api.get('/eventos/estados-evento');
    return response.data;
  },

  // Obtener eventos por cancha
  getEventosPorCancha: async (canchaId) => {
    const response = await api.get('/eventos', { params: { cancha_id: canchaId } });
    return response.data;
  },

  // Obtener eventos por fecha
  getEventosPorFecha: async (fecha) => {
    const response = await api.get('/eventos', { params: { fecha } });
    return response.data;
  },

  getCanchas: async () => {
    const response = await api.get('/canchas');
    return response.data;
  }
};

export default EventosService; 