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
    ],
    order: [['fecha', 'DESC'], ['hora_inicio', 'DESC']]
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
    
    // Validar fecha no pasada (permitir la fecha actual)
    const hoy = new Date();
    const fechaReserva = new Date(fecha);
    
    // Convertir ambas fechas a YYYY-MM-DD para comparación correcta
    const hoyStr = hoy.toISOString().split('T')[0];
    const fechaReservaStr = fechaReserva.toISOString().split('T')[0];
    
    console.log('🔍 Validación de fecha:', {
      fechaSolicitada: fecha,
      fechaReservaStr: fechaReservaStr,
      hoyStr: hoyStr,
      esPasada: fechaReservaStr < hoyStr
    });
    
    if (fechaReservaStr < hoyStr) {
      return res.status(400).json({ message: 'No puedes reservar fechas pasadas.' });
    }
    
    // Validar hora no pasada si es para hoy
    if (fechaReservaStr === hoyStr) {
      const ahora = new Date();
      const horaActual = ahora.getHours();
      const minutoActual = ahora.getMinutes();
      const horaReserva = parseInt(hora_inicio.split(':')[0], 10);
      const minutoReserva = parseInt(hora_inicio.split(':')[1], 10);
      
      console.log('🔍 Validación de hora:', {
        horaActual: `${horaActual}:${minutoActual}`,
        horaReserva: `${horaReserva}:${minutoReserva}`,
        esHoraPasada: (horaReserva < horaActual) || (horaReserva === horaActual && minutoReserva < minutoActual)
      });
      
      if ((horaReserva < horaActual) || (horaReserva === horaActual && minutoReserva < minutoActual)) {
        return res.status(400).json({ message: 'No puedes reservar horas pasadas para el día actual.' });
      }
    }
    
    // Validar que la cancha esté disponible
    const cancha = await Cancha.findByPk(cancha_id, {
      include: [{ model: EstadoCancha, as: 'estadoCancha' }]
    });
    if (!cancha) {
      return res.status(400).json({ message: 'Cancha no encontrada.' });
    }
    
    console.log('🔍 Estado de cancha:', {
      canchaId: cancha.id,
      canchaNombre: cancha.nombre,
      estadoCanchaId: cancha.estado_cancha_id,
      estadoCanchaNombre: cancha.estadoCancha?.nombre
    });
    
    // Verificar si la cancha está disponible (estado "disponible")
    if (cancha.estadoCancha?.nombre !== 'disponible') {
      return res.status(400).json({ 
        message: `La cancha no está disponible para reservas. Estado actual: ${cancha.estadoCancha?.nombre || 'Sin estado'}` 
      });
    }
    
    // Validar que el usuario no tenga ya una reserva en estado 'reservada' (solo una en total)
    const yaTieneReservada = await Reserva.findOne({
      where: {
        usuario_id,
        estado: 'reservada'
      }
    });
    
    console.log('🔍 Validación de reserva única por usuario:', {
      usuarioId: usuario_id,
      yaTieneReservada: !!yaTieneReservada,
      reservaExistente: yaTieneReservada ? {
        id: yaTieneReservada.id,
        fecha: yaTieneReservada.fecha,
        hora_inicio: yaTieneReservada.hora_inicio,
        hora_fin: yaTieneReservada.hora_fin
      } : null
    });
    
    if (yaTieneReservada) {
      return res.status(400).json({ message: 'Solo puedes tener una reserva en estado reservada a la vez.' });
    }
    
    // Validar que la cancha no esté ya reservada en esa fecha/hora por otro usuario
    const canchaOcupada = await Reserva.findOne({
      where: {
        cancha_id,
        fecha: fecha,
        estado: 'reservada',
        [Op.or]: [
          {
            hora_inicio: { [Op.lt]: hora_fin },
            hora_fin: { [Op.gt]: hora_inicio }
          }
        ]
      }
    });
    
    console.log('🔍 Validación de disponibilidad de cancha:', {
      canchaId: cancha_id,
      fecha: fecha,
      hora_inicio: hora_inicio,
      hora_fin: hora_fin,
      canchaOcupada: !!canchaOcupada,
      reservaConflictiva: canchaOcupada ? {
        id: canchaOcupada.id,
        usuario_id: canchaOcupada.usuario_id,
        hora_inicio: canchaOcupada.hora_inicio,
        hora_fin: canchaOcupada.hora_fin
      } : null
    });
    
    if (canchaOcupada) {
      return res.status(400).json({ message: 'La cancha ya está reservada en esa fecha y hora por otro usuario.' });
    }
    
    // Validar superposición con eventos
    const eventos = await Evento.findAll({
      where: {
        cancha_id,
        fecha_inicio: { [Op.lte]: fecha },
        fecha_fin: { [Op.gte]: fecha }
      }
    });
    
    console.log('🔍 Eventos encontrados para la fecha:', {
      fecha: fecha,
      canchaId: cancha_id,
      eventosCount: eventos.length,
      eventos: eventos.map(ev => ({
        id: ev.id,
        nombre: ev.nombre,
        fecha_inicio: ev.fecha_inicio,
        fecha_fin: ev.fecha_fin,
        hora_inicio: ev.hora_inicio,
        hora_fin: ev.hora_fin
      }))
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
    
    // Verificar propiedad de la reserva para usuarios normales
    const userRole = req.user.rol?.nombre || req.user.rol;
    console.log('🔍 updateReserva - Usuario:', {
      id: req.user.id,
      rol: userRole,
      reservaId: id
    });
    
    if (userRole === 'usuario') {
      console.log('🔍 Verificando propiedad de reserva:', {
        reservaUsuarioId: reserva.usuario_id,
        reqUserId: req.user.id,
        sonIguales: reserva.usuario_id === req.user.id
      });
      
      if (reserva.usuario_id !== req.user.id) {
        console.log('❌ Usuario no autorizado - la reserva no le pertenece');
        return res.status(403).json({ 
          message: 'Solo puedes editar tus propias reservas',
          error: 'OWNERSHIP_REQUIRED'
        });
      }
      console.log('✅ Usuario autorizado - la reserva le pertenece');
    } else if (userRole === 'admin') {
      console.log('✅ Admin - acceso completo permitido');
    } else if (userRole === 'organizador') {
      console.log('✅ Organizador - acceso permitido');
    }
    
    const { usuario_id, cancha_id, fecha, hora_inicio, hora_fin, estado } = req.body;
    
    console.log('🔍 updateReserva - Datos recibidos:', {
      usuario_id,
      cancha_id,
      fecha,
      hora_inicio,
      hora_fin,
      estado
    });
    
    // Validar fecha no pasada si se está cambiando la fecha (solo para usuarios normales)
    if (fecha && userRole === 'usuario') {
      const hoy = new Date();
      const fechaReserva = new Date(fecha);
      hoy.setHours(0, 0, 0, 0);
      fechaReserva.setHours(0, 0, 0, 0);
      
      if (fechaReserva < hoy) {
        return res.status(400).json({ message: 'No puedes cambiar a una fecha pasada.' });
      }
    }
    
    // Validar que el usuario no tenga ya otra reserva en estado 'reservada' (excluyendo esta)
    // Solo para usuarios normales, admin puede saltarse esta restricción
    if (usuario_id && estado === 'reservada' && userRole === 'usuario') {
      const yaTieneOtra = await Reserva.findOne({
        where: {
          usuario_id,
          estado: 'reservada',
          id: { [Op.ne]: id }
        }
      });
      if (yaTieneOtra) {
        return res.status(400).json({ message: 'Solo puedes tener una reserva en estado reservada a la vez.' });
      }
    }
    
    // Validar que la cancha no esté ya reservada en esa fecha/hora por otro usuario (excluyendo esta reserva)
    if (cancha_id && fecha && hora_inicio && hora_fin) {
      const canchaOcupada = await Reserva.findOne({
        where: {
          cancha_id,
          fecha: fecha,
          estado: 'reservada',
          id: { [Op.ne]: id },
          [Op.or]: [
            {
              hora_inicio: { [Op.lt]: hora_fin },
              hora_fin: { [Op.gt]: hora_inicio }
            }
          ]
        }
      });
      
      if (canchaOcupada) {
        return res.status(400).json({ message: 'La cancha ya está reservada en esa fecha y hora por otro usuario.' });
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
      
      console.log('🔍 Validación de eventos en updateReserva:', {
        fecha: fecha,
        canchaId: cancha_id,
        eventosCount: eventos.length
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
    
    console.log('🔍 updateReserva - Datos a actualizar:', req.body);
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
  console.log('🔍 getReservasPorUsuario - usuarioId:', usuarioId);
  console.log('🔍 getReservasPorUsuario - req.user:', req.user);
  console.log('🔍 getReservasPorUsuario - req.params:', req.params);
  
  try {
    // Verificar si el usuarioId es válido
    if (!usuarioId || isNaN(usuarioId)) {
      console.log('❌ usuarioId inválido:', usuarioId);
      return res.status(400).json({ message: 'ID de usuario inválido' });
    }

    // Buscar reservas con más detalles
    const reservas = await Reserva.findAll({
      where: { usuario_id: parseInt(usuarioId) },
      include: [
        { model: Usuario, as: 'usuario' },
        { model: Cancha, as: 'cancha' }
      ],
      order: [['fecha', 'DESC'], ['hora_inicio', 'DESC']]
    });
    
    console.log('✅ Reservas encontradas:', reservas.length);
    console.log('✅ Detalles de reservas:', reservas.map(r => ({
      id: r.id,
      usuario_id: r.usuario_id,
      cancha_id: r.cancha_id,
      fecha: r.fecha,
      estado: r.estado
    })));
    
    res.json(reservas);
  } catch (err) {
    console.error('❌ Error en getReservasPorUsuario:', err);
    res.status(500).json({ message: 'Error al obtener reservas del usuario' });
  }
};

export const getReservasPorCancha = async (req, res) => {
  const { canchaId } = req.params;
  const { fecha } = req.query;
  
  try {
    const whereClause = { cancha_id: canchaId };
    
    if (fecha) {
      whereClause.fecha = fecha;
    }
    
    const reservas = await Reserva.findAll({
      where: whereClause,
      include: [
        { model: Usuario, as: 'usuario' },
        { model: Cancha, as: 'cancha' }
      ],
      order: [['fecha', 'DESC'], ['hora_inicio', 'DESC']]
    });
    
    res.json(reservas);
  } catch (err) {
    console.error('Error obteniendo reservas por cancha:', err);
    res.status(500).json({ message: 'Error al obtener reservas de la cancha' });
  }
};

// Endpoint temporal para verificar todas las reservas
export const getAllReservas = async (req, res) => {
  try {
    const reservas = await Reserva.findAll({
      include: [
        { model: Usuario, as: 'usuario' },
        { model: Cancha, as: 'cancha' }
      ]
    });
    
    console.log('🔍 Total de reservas en la base de datos:', reservas.length);
    console.log('🔍 Detalles de todas las reservas:', reservas.map(r => ({
      id: r.id,
      usuario_id: r.usuario_id,
      usuario_nombre: r.usuario?.nombres,
      cancha_id: r.cancha_id,
      cancha_nombre: r.cancha?.nombre,
      fecha: r.fecha,
      estado: r.estado
    })));
    
    res.json(reservas);
  } catch (err) {
    console.error('Error obteniendo todas las reservas:', err);
    res.status(500).json({ message: 'Error al obtener reservas' });
  }
}; 