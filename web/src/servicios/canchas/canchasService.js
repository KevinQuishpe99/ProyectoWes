import api from '../api';

export const getCanchas = async () => {
  const res = await api.get('/canchas');
  return res.data;
};

export const createCancha = async (cancha) => {
  let formData;
  if (cancha instanceof FormData) {
    formData = cancha;
  } else {
    formData = new FormData();
    for (const key in cancha) {
      if (cancha[key] !== undefined && cancha[key] !== null) {
        formData.append(key, cancha[key]);
      }
    }
  }
  const res = await api.post('/canchas', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
};

export const updateCancha = async (id, cancha) => {
  let formData;
  if (cancha instanceof FormData) {
    formData = cancha;
  } else {
    formData = new FormData();
    for (const key in cancha) {
      if (cancha[key] !== undefined && cancha[key] !== null) {
        formData.append(key, cancha[key]);
      }
    }
  }
  const res = await api.put(`/canchas/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
};

export const deleteCancha = async (id) => {
  const res = await api.delete(`/canchas/${id}`);
  return res.data;
};

export const getTiposEspacio = async () => {
  const res = await api.get('/tipos-espacio');
  return res.data;
};

export const getEstadosCancha = async () => {
  const res = await api.get('/canchas/estados-cancha');
  return res.data;
}; 
