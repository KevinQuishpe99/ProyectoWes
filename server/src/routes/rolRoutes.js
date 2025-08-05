import express from 'express';
import { getRoles } from '../controllers/rolController.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Rutas protegidas (solo admin)
router.get('/', authenticateToken, requireAdmin, getRoles);

export default router; 