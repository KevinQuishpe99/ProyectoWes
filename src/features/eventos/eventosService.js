import api from '../../services/api';

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
    const response = await api.post('/eventos', eventoData);
    return response.data;
  },

  // Actualizar evento
  updateEvento: async (id, eventoData) => {
    const response = await api.put(`/eventos/${id}`, eventoData);
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
  }
};

export default EventosService; 