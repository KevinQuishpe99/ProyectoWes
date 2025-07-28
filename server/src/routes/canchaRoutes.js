import express from 'express';
import { getCanchas, getCancha, createCancha, updateCancha, deleteCancha, uploadCanchaImage } from '../controllers/canchaController.js';

const router = express.Router();

router.get('/', getCanchas);
router.get('/:id', getCancha);
router.post('/', uploadCanchaImage, createCancha);
router.put('/:id', uploadCanchaImage, updateCancha);
router.delete('/:id', deleteCancha);

export default router; 