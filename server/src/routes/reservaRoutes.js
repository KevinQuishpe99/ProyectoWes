import express from 'express';
import { getReservas, getReserva, createReserva, updateReserva, deleteReserva, getReservasPorUsuario } from '../controllers/reservaController.js';

const router = express.Router();

// Endpoint de estados debe ir antes de los endpoints con :id
router.get('/estados-reserva', (req, res) => {
  // Ajusta los valores según la restricción CHECK de tu base de datos
  res.json(['reservada', 'cancelada', 'finalizada']);
});

router.get('/usuario/:usuarioId', getReservasPorUsuario);
router.get('/', getReservas);
router.get('/:id', getReserva);
router.post('/', createReserva);
router.put('/:id', updateReserva);
router.delete('/:id', deleteReserva);

export default router; 