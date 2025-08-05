import express from 'express';
import { getCanchas, getCancha, createCancha, updateCancha, deleteCancha, uploadCanchaImage, getEstadosCancha } from '../controllers/canchaController.js';
import { protect, requireAdmin, requireOrganizador } from '../middleware/auth.js';

const router = express.Router();

// Endpoint de estados debe ir antes de los endpoints con :id
router.get('/estados-cancha', getEstadosCancha);

// Rutas públicas (para mostrar canchas en landing page)
router.get('/', getCanchas);
router.get('/:id', getCancha);

// Rutas protegidas (solo admin y organizador)
router.post('/', protect, requireOrganizador, uploadCanchaImage, createCancha);
router.put('/:id', protect, requireOrganizador, uploadCanchaImage, updateCancha);
router.delete('/:id', protect, requireOrganizador, deleteCancha);

export default router; 