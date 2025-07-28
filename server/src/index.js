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
import EstadoCancha from './models/estadoCancha.js';

const app = express();
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
// Aumentar el límite del body a 10mb
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Rutas
app.use('/api/roles', rolRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/canchas', canchaRoutes);
app.use('/api/reservas', reservaRoutes);
app.use('/api/eventos', eventoRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/tipos-espacio', tipoEspacioRoutes);

// Endpoint para obtener los estados de cancha
app.get('/api/estados-cancha', async (req, res) => {
  try {
    const estados = await EstadoCancha.findAll({ attributes: ['id', 'nombre'] });
    res.json(estados);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener estados de cancha' });
  }
});

// Conexión y arranque
const PORT = 3001;

(async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync(); // Crea las tablas si no existen
    console.log('Conexión a la base de datos exitosa');
    app.listen(PORT, () => {
      console.log(`Servidor backend escuchando en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Error al conectar a la base de datos:', error);
  }
})(); 