import { Reserva, Usuario, Cancha, Rol, TipoEspacio, EstadoCancha, Evento } from '../models/index.js';
import { Op } from 'sequelize';

export const getReservas = async (req, res) => {
  const reservas = await Reserva.findAll({
    include: [
      { model: Usuario, as: 'usuario', include: [{ model: Rol, as: 'rol' }] },
      { model: Cancha, as: 'cancha', include: [
        { model: TipoEspacio, as: 'tipoEspacio' },
        { model: EstadoCancha, as: 'estadoCancha' }
      ] }
    ]
  });
  res.json(reservas);
};

export const getReserva = async (req, res) => {
  const { id } = req.params;
  const reserva = await Reserva.findByPk(id, {
    include: [
      { model: Usuario, as: 'usuario', include: [{ model: Rol, as: 'rol' }] },
      { model: Cancha, as: 'cancha', include: [
        { model: TipoEspacio, as: 'tipoEspacio' },
        { model: EstadoCancha, as: 'estadoCancha' }
      ] }
    ]
  });
  if (!reserva) return res.status(404).json({ message: 'Reserva no encontrada' });
  res.json(reserva);
};

export const createReserva = async (req, res) => {
  try {
    const { usuario_id, cancha_id, fecha, hora_inicio, hora_fin } = req.body;
    // Validar que el usuario no tenga ya una reserva en estado 'reservada' para hoy o futuro
    const hoyStr = new Date().toISOString().slice(0, 10);
    const yaTieneReservada = await Reserva.findOne({
      where: {
        usuario_id,
        estado: 'reservada',
        fecha: { [Op.gte]: hoyStr }
      }
    });
    if (yaTieneReservada) {
      return res.status(400).json({ message: 'Solo puedes tener una reserva en estado reservada a la vez.' });
    }
    // Validar superposición con eventos (manejar eventos que cruzan medianoche)
    const eventos = await Evento.findAll({
      where: {
        cancha_id,
        fecha_inicio: { [Op.lte]: fecha },
        fecha_fin: { [Op.gte]: fecha }
      }
    });
    const reservaCruza = (hIni, hFin, eIni, eFin) => {
      if (eIni < eFin) {
        // Evento normal
        return hIni < eFin && hFin > eIni;
      } else {
        // Evento cruza medianoche
        return (hIni < eFin || hFin > eIni);
      }
    };
    const solapado = eventos.some(ev => reservaCruza(hora_inicio, hora_fin, ev.hora_inicio, ev.hora_fin));
    if (solapado) {
      return res.status(400).json({ message: 'No se puede reservar: existe un evento en la cancha, fecha y hora seleccionadas.' });
    }
    const reserva = await Reserva.create(req.body);
    res.status(201).json(reserva);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const updateReserva = async (req, res) => {
  const { id } = req.params;
  try {
    const reserva = await Reserva.findByPk(id);
    if (!reserva) return res.status(404).json({ message: 'Reserva no encontrada' });
    const { usuario_id, cancha_id, fecha, hora_inicio, hora_fin, estado } = req.body;
    // Validar que el usuario no tenga ya otra reserva en estado 'reservada' para hoy o futuro (excluyendo esta)
    if (usuario_id && estado === 'reservada' && fecha) {
      const hoyStr = new Date().toISOString().slice(0, 10);
      const yaTieneOtra = await Reserva.findOne({
        where: {
          usuario_id,
          estado: 'reservada',
          fecha: { [Op.gte]: hoyStr },
          id: { [Op.ne]: id }
        }
      });
      if (yaTieneOtra) {
        return res.status(400).json({ message: 'Solo puedes tener una reserva en estado reservada a la vez.' });
      }
    }
    // Validar superposición con eventos solo si se cambian fecha/hora/cancha
    if (cancha_id && fecha && hora_inicio && hora_fin) {
      const eventos = await Evento.findAll({
        where: {
          cancha_id,
          fecha_inicio: { [Op.lte]: fecha },
          fecha_fin: { [Op.gte]: fecha }
        }
      });
      const reservaCruza = (hIni, hFin, eIni, eFin) => {
        if (eIni < eFin) {
          // Evento normal
          return hIni < eFin && hFin > eIni;
        } else {
          // Evento cruza medianoche
          return (hIni < eFin || hFin > eIni);
        }
      };
      const solapado = eventos.some(ev => reservaCruza(hora_inicio, hora_fin, ev.hora_inicio, ev.hora_fin));
      if (solapado) {
        return res.status(400).json({ message: 'No se puede actualizar: existe un evento en la cancha, fecha y hora seleccionadas.' });
      }
    }
    await reserva.update(req.body);
    res.json(reserva);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteReserva = async (req, res) => {
  const { id } = req.params;
  try {
    const reserva = await Reserva.findByPk(id);
    if (!reserva) return res.status(404).json({ message: 'Reserva no encontrada' });
    await reserva.destroy();
    res.json({ message: 'Reserva eliminada' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const getReservasPorUsuario = async (req, res) => {
  const { usuarioId } = req.params;
  try {
    const reservas = await Reserva.findAll({
      where: { usuario_id: usuarioId },
      include: [
        { model: Usuario, as: 'usuario' },
        { model: Cancha, as: 'cancha' }
      ]
    });
    res.json(reservas);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener reservas del usuario' });
  }
}; 