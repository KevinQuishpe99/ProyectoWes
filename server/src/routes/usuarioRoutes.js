// Importación de Express para crear el router
import express from 'express';
// Importación de todas las funciones del controlador de usuarios
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
// Importación de middlewares de autenticación y autorización
import { 
  protect, 
  requireAdmin, 
  requireOwnership 
} from '../middleware/auth.js';

// Crear instancia del router de Express
const router = express.Router();

// RUTAS PÚBLICAS (sin autenticación requerida)
// Ruta para autenticar usuario (login)
router.post('/login-user', loginUser);
// Ruta para crear nuevo usuario (registro)
router.post('/create-user', createUser);
// Ruta para obtener usuarios básicos (pública, para formularios)
router.get('/basicos', getUsuariosBasicos);

// RUTAS PROTEGIDAS (requieren autenticación)
// Ruta para probar autenticación (acción protegida)
router.get('/protected-action', protect, protectedAction);
// Ruta para verificar token de autenticación
router.get('/verify', protect, verifyAuth);

// Ruta para obtener todos los usuarios (solo admin/organizador)
router.get('/', protect, (req, res, next) => {
  // Obtener el rol del usuario autenticado
  const userRole = req.user.rol?.nombre || req.user.rol;
  // Verificar si el usuario tiene permisos de administrador u organizador
  if (userRole === 'admin' || userRole === 'administrador' || userRole === 'organizador') {
    // Si tiene permisos, continuar al siguiente middleware
    next();
  } else {
    // Si no tiene permisos, denegar acceso
    res.status(403).json({ message: 'Acceso denegado. Se requieren permisos de administrador u organizador.' });
  }
}, getUsuarios);

// Ruta para obtener un usuario específico por ID
router.get('/:id', protect, requireOwnership, getUsuario);
// Ruta para actualizar un usuario específico por ID
router.put('/:id', protect, requireOwnership, updateUsuario);
// Ruta para eliminar un usuario específico por ID (solo admin)
router.delete('/:id', protect, requireAdmin, deleteUsuario);

// Exportar el router configurado
export default router; 