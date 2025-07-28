import express from 'express';
import { getUsuarios, getUsuario, createUsuario, updateUsuario, deleteUsuario, login } from '../controllers/usuarioController.js';
import { protect } from '../middlewares/autorizacion.middleware.js'
const router = express.Router();

router.post('/login', login);
router.get('/', protect, getUsuarios);
router.get('/:id', getUsuario);
router.post('/', createUsuario);
router.put('/:id', updateUsuario);
router.delete('/:id', deleteUsuario);

export default router; 