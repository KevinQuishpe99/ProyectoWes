import api from '../api';

const ReportesService = {
  getReservas: async () => {
    const res = await api.get('/reservas');
    return res.data;
  },
  getEventos: async () => {
    const res = await api.get('/eventos');
    return res.data;
  },
  getCanchas: async () => {
    const res = await api.get('/canchas');
    return res.data;
  },
  getFeedbacks: async () => {
    const res = await api.get('/feedback');
    return res.data;
  },
  getUsuarios: async () => {
    const res = await api.get('/usuarios');
    return res.data;
  }
};

export default ReportesService; 