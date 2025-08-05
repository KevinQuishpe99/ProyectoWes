// Archivo de prueba para verificar conexión con el backend
const axios = require('axios');

const API_BASE_URL = 'http://localhost:3001/api';

async function testConnection() {
  console.log('🔍 Probando conexión con el backend...');
  console.log('📍 URL:', API_BASE_URL);
  
  try {
    // Probar endpoint de health
    const healthResponse = await axios.get(`${API_BASE_URL}/health`);
    console.log('✅ Health check exitoso:', healthResponse.data);
    
    // Probar endpoint de usuarios
    const usersResponse = await axios.get(`${API_BASE_URL}/usuarios`);
    console.log('✅ Endpoint usuarios accesible');
    
    console.log('🎉 Conexión exitosa con el backend!');
    
  } catch (error) {
    console.error('❌ Error de conexión:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('💡 El servidor no está corriendo. Ejecuta: npm start en la carpeta server/');
    } else if (error.response) {
      console.log('📊 Status:', error.response.status);
      console.log('📄 Data:', error.response.data);
    }
  }
}

testConnection(); 