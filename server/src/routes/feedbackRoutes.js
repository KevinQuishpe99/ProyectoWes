import express from 'express';
import { 
  getFeedbacks, 
  getFeedbackById, 
  createFeedback, 
  updateFeedback, 
  deleteFeedback,
  responderFeedback,
  getFeedbacksPorUsuario 
} from '../controllers/feedbackController.js';
import { protect, requireAdmin, requireOrganizador, requireOwnership } from '../middleware/auth.js';

const router = express.Router();

// Rutas públicas (para mostrar feedback en landing page)
router.get('/', getFeedbacks);

// Rutas protegidas - Las rutas específicas deben ir antes que las genéricas
router.get('/usuario/:usuarioId', protect, requireOwnership, getFeedbacksPorUsuario);
router.get('/:id', getFeedbackById);
router.post('/', protect, createFeedback);
router.put('/:id', protect, requireAdmin, updateFeedback);
// ADMIN PUEDE ELIMINAR CUALQUIER FEEDBACK - SIN RESTRICCIONES DE OWNERSHIP
router.delete('/:id', protect, requireAdmin, deleteFeedback);
router.post('/:id/responder', protect, requireOrganizador, responderFeedback);

export default router; 