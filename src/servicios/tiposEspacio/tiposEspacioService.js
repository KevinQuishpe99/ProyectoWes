import api from '../api';

const TiposEspacioService = {
  getAll: async () => {
    const res = await api.get('/tipos-espacio');
    return res.data;
  },
  create: async (formData) => {
    const res = await api.post('/tipos-espacio', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data;
  },
  update: async (id, formData) => {
    const res = await api.put(`/tipos-espacio/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data;
  },
  delete: async (id) => {
    const res = await api.delete(`/tipos-espacio/${id}`);
    return res.data;
  }
};

export default TiposEspacioService; 
