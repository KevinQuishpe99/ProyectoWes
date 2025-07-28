import express from 'express';
import { getTiposEspacio, getTipoEspacio, createTipoEspacio, updateTipoEspacio, deleteTipoEspacio, uploadTipoEspacioImage } from '../controllers/tipoEspacioController.js';

const router = express.Router();

router.get('/', getTiposEspacio);
router.get('/:id', getTipoEspacio);
router.post('/', uploadTipoEspacioImage, createTipoEspacio);
router.put('/:id', uploadTipoEspacioImage, updateTipoEspacio);
router.delete('/:id', deleteTipoEspacio);

export default router; 