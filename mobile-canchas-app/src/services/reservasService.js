import api from './api';

export const reservasService = {
  // Obtener mis reservas
  async getMisReservas() {
    try {
      const response = await api.get('/reservas/mis-reservas');
      return response.data;
    } catch (error) {
      console.error('Error obteniendo reservas:', error);
      throw error.response?.data || { message: 'Error al obtener reservas' };
    }
  }
}; 