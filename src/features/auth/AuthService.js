import api from '../../services/api';

const AuthService = {
  login: async (credentials) => {
    try {
      const response = await api.post('/usuarios/login', credentials);
      return response.data;
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Error de conexión con el servidor');
    }
  },
};

export default AuthService; 