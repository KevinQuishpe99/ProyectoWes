import express from 'express';
import { getUsuarios, getUsuario, createUsuario, updateUsuario, deleteUsuario, login } from '../controllers/usuarioController.js';

const router = express.Router();

router.post('/login', login);
router.get('/', getUsuarios);
router.get('/:id', getUsuario);
router.post('/', createUsuario);
router.put('/:id', updateUsuario);
router.delete('/:id', deleteUsuario);

export default router; 