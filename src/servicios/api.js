import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001/api', // Cambiado para apuntar al backend real
  withCredentials: true,
});

export default api; 
