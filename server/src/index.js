// Importación de Express.js para crear el servidor web
import express from 'express';
// Importación de la configuración de la base de datos
import sequelize from './config/db.js';
// Importación de todas las rutas de la API
import rolRoutes from './routes/rolRoutes.js';
import usuarioRoutes from './routes/usuarioRoutes.js';
import canchaRoutes from './routes/canchaRoutes.js';
import reservaRoutes from './routes/reservaRoutes.js';
import eventoRoutes from './routes/eventoRoutes.js';
import feedbackRoutes from './routes/feedbackRoutes.js';
import tipoEspacioRoutes from './routes/tipoEspacioRoutes.js';
// Importación de CORS para permitir peticiones desde diferentes orígenes
import cors from 'cors';
// Importación de dotenv para cargar variables de entorno
import dotenv from 'dotenv';

// Cargar variables de entorno desde el archivo .env
dotenv.config();

// Crear instancia de la aplicación Express
const app = express();

// Configuración CORS - Permitir cualquier origen para desarrollo
app.use(cors({
  origin: '*', // Permitir cualquier origen
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Métodos HTTP permitidos
  allowedHeaders: ['Content-Type', 'Authorization'], // Headers permitidos
  credentials: false // No permitir credenciales en peticiones CORS
}));

// Configuración de middleware para parsear JSON con límite de 10MB
app.use(express.json({ limit: '10mb' }));
// Configuración de middleware para parsear datos de formularios con límite de 10MB
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Ruta raíz de la API - Información general del sistema
app.get('/api', (req, res) => {
  // Responder con información del sistema
  res.json({
    message: 'API de Gestión de Canchas EPN', // Mensaje de bienvenida
    version: '1.0.0', // Versión de la API
    endpoints: {
      roles: '/api/roles', // Endpoint para gestión de roles
      usuarios: '/api/usuarios', // Endpoint para gestión de usuarios
      canchas: '/api/canchas', // Endpoint para gestión de canchas
      reservas: '/api/reservas', // Endpoint para gestión de reservas
      eventos: '/api/eventos', // Endpoint para gestión de eventos
      feedback: '/api/feedback', // Endpoint para gestión de feedback
      tiposEspacio: '/api/tipos-espacio' // Endpoint para gestión de tipos de espacio
    },
    status: 'running' // Estado del servidor
  });
});

// Configuración de todas las rutas de la API
// Cada ruta se monta en su respectivo endpoint
app.use('/api/roles', rolRoutes); // Rutas para gestión de roles
app.use('/api/usuarios', usuarioRoutes); // Rutas para gestión de usuarios
app.use('/api/canchas', canchaRoutes); // Rutas para gestión de canchas
app.use('/api/reservas', reservaRoutes); // Rutas para gestión de reservas
app.use('/api/eventos', eventoRoutes); // Rutas para gestión de eventos
app.use('/api/feedback', feedbackRoutes); // Rutas para gestión de feedback
app.use('/api/tipos-espacio', tipoEspacioRoutes); // Rutas para gestión de tipos de espacio

// Configuración del puerto y IP del servidor desde variables de entorno
const PORT = process.env.PORT || 3001; // Puerto por defecto 3001
const SERVER_IP = process.env.SERVER_IP || '0.0.0.0'; // IP por defecto 0.0.0.0 (todas las interfaces)

// Función asíncrona para inicializar el servidor
(async () => {
  try {
    // Autenticar conexión con la base de datos
    await sequelize.authenticate();
    console.log('✅ Base de datos conectada');
    
    // Sincronizar modelos con la base de datos (crear tablas si no existen)
    await sequelize.sync();
    
    // Iniciar el servidor en el puerto y IP especificados
    app.listen(PORT, SERVER_IP, () => {
      console.log(`🚀 Servidor corriendo en ${SERVER_IP}:${PORT}`);
      console.log(`📱 API: http://${SERVER_IP}:${PORT}/api`);
    });
  } catch (error) {
    // Si hay error en la inicialización, mostrar error y terminar proceso
    console.error('❌ Error:', error);
    process.exit(1); // Terminar proceso con código de error
  }
})(); 