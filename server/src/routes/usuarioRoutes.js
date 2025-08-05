import express from 'express';
import { 
  getUsuarios, 
  getUsuario, 
  updateUsuario, 
  deleteUsuario, 
  loginUser,
  createUser,
  verifyAuth,
  protectedAction,
  getUsuariosBasicos
} from '../controllers/usuarioController.js';
import { 
  protect, 
  requireAdmin, 
  requireOwnership 
} from '../middleware/auth.js';

const router = express.Router();

// Rutas públicas (sin autenticación)
router.post('/login-user', loginUser);
router.post('/create-user', createUser);
router.get('/basicos', getUsuariosBasicos);

// Rutas protegidas (requieren autenticación)
router.get('/protected-action', protect, protectedAction);
router.get('/verify', protect, verifyAuth);
router.get('/', protect, (req, res, next) => {
  const userRole = req.user.rol?.nombre || req.user.rol;
  if (userRole === 'admin' || userRole === 'administrador' || userRole === 'organizador') {
    next();
  } else {
    res.status(403).json({ message: 'Acceso denegado. Se requieren permisos de administrador u organizador.' });
  }
}, getUsuarios);
router.get('/:id', protect, requireOwnership, getUsuario);
router.put('/:id', protect, requireOwnership, updateUsuario);
router.delete('/:id', protect, requireAdmin, deleteUsuario);

export default router; 