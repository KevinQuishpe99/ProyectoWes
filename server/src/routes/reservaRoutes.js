import express from 'express';
import { getReservas, getReserva, createReserva, updateReserva, deleteReserva, getReservasPorUsuario, getReservasPorCancha, getAllReservas } from '../controllers/reservaController.js';
import { protect, requireAdmin, requireOrganizador, requireOwnership, requireReservaOwnership, requireReservaDelete } from '../middleware/auth.js';

const router = express.Router();

// Endpoint de estados debe ir antes de los endpoints con :id
router.get('/estados-reserva', (req, res) => {
  // Solo los estados definidos en la base de datos
  res.json(['reservada', 'cancelada']);
});

// Endpoint temporal para debug (sin autenticación)
router.get('/debug/todas', getAllReservas);

// Endpoint temporal para debug de usuario específico (sin middleware)
router.get('/debug/usuario/:usuarioId', getReservasPorUsuario);

// Endpoint temporal para probar autenticación
router.get('/debug/auth-test', protect, (req, res) => {
  res.json({
    message: 'Autenticación exitosa',
    user: {
      id: req.user.id,
      nombres: req.user.nombres,
      rol: req.user.rol?.nombre || req.user.rol
    }
  });
});

// Endpoint específico para usuarios (sin middleware restrictivo)
router.get('/mis-reservas', protect, (req, res) => {
  console.log('🔍 /mis-reservas - Usuario autenticado:', {
    id: req.user.id,
    nombres: req.user.nombres,
    rol: req.user.rol?.nombre || req.user.rol
  });
  
  // Llamar directamente al controlador con el ID del usuario autenticado
  req.params.usuarioId = req.user.id;
  getReservasPorUsuario(req, res);
});

// Rutas específicas deben ir antes que las genéricas
router.get('/usuario/:usuarioId', protect, requireOwnership, getReservasPorUsuario);
router.get('/cancha/:canchaId', protect, getReservasPorCancha);

// Rutas protegidas - Admin y Organizador pueden acceder
router.get('/', protect, (req, res, next) => {
  const userRole = req.user.rol?.nombre || req.user.rol;
  if (userRole === 'admin' || userRole === 'administrador' || userRole === 'organizador') {
    next();
  } else {
    res.status(403).json({ message: 'Acceso denegado. Se requieren permisos de administrador u organizador.' });
  }
}, getReservas);

router.get('/:id', protect, (req, res, next) => {
  const userRole = req.user.rol?.nombre || req.user.rol;
  if (userRole === 'admin' || userRole === 'administrador' || userRole === 'organizador') {
    next();
  } else {
    res.status(403).json({ message: 'Acceso denegado. Se requieren permisos de administrador u organizador.' });
  }
}, getReserva);
router.post('/', protect, createReserva);
router.put('/:id', protect, requireReservaOwnership, updateReserva);
router.delete('/:id', protect, requireReservaDelete, deleteReserva);

export default router; 