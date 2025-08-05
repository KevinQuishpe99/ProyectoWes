import express from 'express';
import { 
  getEventos, 
  getEventoById, 
  createEvento, 
  updateEvento, 
  deleteEvento,
  getEstadosEvento,
  confirmarEventoConReservas
} from '../controllers/eventoController.js';
import { protect, requireOrganizador } from '../middleware/auth.js';

const router = express.Router();

// Rutas públicas (para mostrar eventos en landing page)
router.get('/', getEventos);
router.get('/estados-evento', getEstadosEvento);
router.get('/:id', getEventoById);

// Rutas protegidas (admin y organizador)
router.post('/', protect, createEvento);
router.put('/:id', protect, updateEvento);
router.delete('/:id', protect, deleteEvento);

// Ruta para confirmar evento con cancelación de reservas conflictivas
router.post('/confirmar-con-reservas', protect, confirmarEventoConReservas);

export default router; 