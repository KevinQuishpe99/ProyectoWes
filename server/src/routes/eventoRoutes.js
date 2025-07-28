import express from 'express';
import { 
  getEventos, 
  getEventoById, 
  createEvento, 
  updateEvento, 
  deleteEvento,
  getEstadosEvento 
} from '../controllers/eventoController.js';

const router = express.Router();

router.get('/', getEventos);
router.get('/estados-evento', getEstadosEvento);
router.get('/:id', getEventoById);
router.post('/', createEvento);
router.put('/:id', updateEvento);
router.delete('/:id', deleteEvento);

export default router; 