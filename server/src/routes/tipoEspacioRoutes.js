import express from 'express';
import { getTiposEspacio, getTipoEspacio, createTipoEspacio, updateTipoEspacio, deleteTipoEspacio, uploadTipoEspacioImage } from '../controllers/tipoEspacioController.js';
import { protect, requireOrganizador } from '../middleware/auth.js';

const router = express.Router();

// Rutas públicas (para mostrar tipos en landing page)
router.get('/', getTiposEspacio);
router.get('/:id', getTipoEspacio);

// Rutas protegidas (solo admin y organizador)
router.post('/', protect, requireOrganizador, uploadTipoEspacioImage, createTipoEspacio);
router.put('/:id', protect, requireOrganizador, uploadTipoEspacioImage, updateTipoEspacio);
router.delete('/:id', protect, requireOrganizador, deleteTipoEspacio);

export default router; 