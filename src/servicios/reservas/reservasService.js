import api from '../../servicios/api';

export const getReservasPorUsuario = async (usuarioId) => {
  const res = await api.get(`/reservas/usuario/${usuarioId}`);
  return res.data;
};

export const createReservaUsuario = async ({ usuario_id, cancha_id, fecha, hora_inicio, hora_fin }) => {
  const res = await api.post('/reservas', {
    usuario_id,
    cancha_id,
    fecha,
    hora_inicio,
    hora_fin,
    estado: 'reservada',
  });
  return res.data;
};

export const cancelarReservaUsuario = async (reservaId) => {
  const res = await api.put(`/reservas/${reservaId}`, { estado: 'cancelada' });
  return res.data;
};

const ReservasService = {
  getAll: async () => {
    const res = await api.get('/reservas');
    return res.data;
  },
  create: async (data) => {
    const res = await api.post('/reservas', data);
    return res.data;
  },
  update: async (id, data) => {
    const res = await api.put(`/reservas/${id}`, data);
    return res.data;
  },
  delete: async (id) => {
    const res = await api.delete(`/reservas/${id}`);
    return res.data;
  },
  getEstados: async () => {
    const res = await api.get('/reservas/estados-reserva');
    return res.data;
  },
  getUsuarios: async () => {
    const res = await api.get('/usuarios');
    return res.data;
  },
  getCanchas: async () => {
    const res = await api.get('/canchas');
    return res.data;
  }
};

export default ReservasService; 
