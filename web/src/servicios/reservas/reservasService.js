import api from '../../servicios/api';

export const getReservasPorUsuario = async (usuarioId) => {
  const res = await api.get(`/reservas/usuario/${usuarioId}`);
  return res.data;
};

export const getMisReservas = async () => {
  const res = await api.get('/reservas/mis-reservas');
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
  // Obtener todas las reservas
  getAll: async () => {
    try {
      const res = await api.get('/reservas');
      return res.data;
    } catch (error) {
      console.error('Error obteniendo reservas:', error);
      throw error;
    }
  },

  // Crear nueva reserva
  create: async (data) => {
    try {
      console.log('Creando nueva reserva:', data);
      const res = await api.post('/reservas', data);
      console.log('Reserva creada exitosamente:', res.data);
      return res.data;
    } catch (error) {
      console.error('Error creando reserva:', error);
      console.error('Detalles del error:', {
        status: error.response?.status,
        message: error.response?.data,
        url: error.config?.url,
        data: error.config?.data
      });
      throw error;
    }
  },

  // Actualizar reserva
  update: async (id, data) => {
    try {
      console.log(`Actualizando reserva ${id}:`, data);
      const res = await api.put(`/reservas/${id}`, data);
      console.log('Reserva actualizada exitosamente:', res.data);
      return res.data;
    } catch (error) {
      console.error('Error actualizando reserva:', error);
      console.error('Detalles del error:', {
        status: error.response?.status,
        message: error.response?.data,
        url: error.config?.url,
        data: error.config?.data
      });
      throw error;
    }
  },

  // Eliminar reserva
  delete: async (id) => {
    try {
      const res = await api.delete(`/reservas/${id}`);
      return res.data;
    } catch (error) {
      console.error('Error eliminando reserva:', error);
      throw error;
    }
  },

  // Obtener estados de reserva
  getEstados: async () => {
    try {
      const res = await api.get('/reservas/estados-reserva');
      return res.data;
    } catch (error) {
      console.error('Error obteniendo estados:', error);
      // Retornar estados por defecto si falla (solo los definidos en la BD)
      return ['reservada', 'cancelada'];
    }
  },

  // Obtener usuarios
  getUsuarios: async () => {
    try {
      const res = await api.get('/usuarios');
      return res.data;
    } catch (error) {
      console.error('Error obteniendo usuarios:', error);
      throw error;
    }
  },

  // Obtener canchas
  getCanchas: async () => {
    try {
      const res = await api.get('/canchas');
      return res.data;
    } catch (error) {
      console.error('Error obteniendo canchas:', error);
      throw error;
    }
  },

  // Obtener reservas por cancha y fecha (para validar conflictos)
  getReservasPorCancha: async (canchaId, fecha) => {
    try {
      console.log(`Validando disponibilidad: Cancha ${canchaId}, Fecha ${fecha}`);
      const res = await api.get(`/reservas/cancha/${canchaId}?fecha=${fecha}`);
      console.log('Reservas encontradas para validación:', res.data);
      return res.data;
    } catch (error) {
      console.error('Error obteniendo reservas por cancha:', error);
      console.error('Detalles del error:', {
        status: error.response?.status,
        message: error.response?.data,
        url: error.config?.url
      });
      return [];
    }
  },

  // Obtener reservas por usuario
  getReservasPorUsuario: async (usuarioId) => {
    try {
      const res = await api.get(`/reservas/usuario/${usuarioId}`);
      return res.data;
    } catch (error) {
      console.error('Error obteniendo reservas por usuario:', error);
      throw error;
    }
  },

  // Validar disponibilidad de cancha
  validarDisponibilidad: async (canchaId, fecha, horaInicio, horaFin, reservaId = null) => {
    try {
      const reservas = await ReservasService.getReservasPorCancha(canchaId, fecha);
      
      const conflicto = reservas.find(r => {
        if (reservaId && r.id === reservaId) return false;
        
        const inicioExistente = r.hora_inicio;
        const finExistente = r.hora_fin;
        
        return (
          (horaInicio >= inicioExistente && horaInicio < finExistente) ||
          (horaFin > inicioExistente && horaFin <= finExistente) ||
          (horaInicio <= inicioExistente && horaFin >= finExistente)
        );
      });
      
      return !conflicto;
    } catch (error) {
      console.error('Error validando disponibilidad:', error);
      return true; // En caso de error, permitir la reserva
    }
  }
};

export default ReservasService; 
