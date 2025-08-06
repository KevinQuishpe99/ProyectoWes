import express from 'express';
import sequelize from './config/db.js';
import rolRoutes from './routes/rolRoutes.js';
import usuarioRoutes from './routes/usuarioRoutes.js';
import canchaRoutes from './routes/canchaRoutes.js';
import reservaRoutes from './routes/reservaRoutes.js';
import eventoRoutes from './routes/eventoRoutes.js';
import feedbackRoutes from './routes/feedbackRoutes.js';
import tipoEspacioRoutes from './routes/tipoEspacioRoutes.js';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// Configuración CORS - Permitir cualquier origen
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: false
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Ruta raíz de la API
app.get('/api', (req, res) => {
  res.json({
    message: 'API de Gestión de Canchas EPN',
    version: '1.0.0',
    endpoints: {
      roles: '/api/roles',
      usuarios: '/api/usuarios',
      canchas: '/api/canchas',
      reservas: '/api/reservas',
      eventos: '/api/eventos',
      feedback: '/api/feedback',
      tiposEspacio: '/api/tipos-espacio'
    },
    status: 'running'
  });
});

// Rutas
app.use('/api/roles', rolRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/canchas', canchaRoutes);
app.use('/api/reservas', reservaRoutes);
app.use('/api/eventos', eventoRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/tipos-espacio', tipoEspacioRoutes);

const PORT = process.env.PORT || 3001;
const SERVER_IP = process.env.SERVER_IP || '0.0.0.0';

(async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    console.log('✅ Base de datos conectada');
    
    app.listen(PORT, SERVER_IP, () => {
      console.log(`🚀 Servidor corriendo en ${SERVER_IP}:${PORT}`);
      console.log(`📱 API: http://${SERVER_IP}:${PORT}/api`);
    });
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
})(); 