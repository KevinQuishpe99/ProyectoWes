import { Evento, Cancha, TipoEspacio, EstadoCancha, Reserva, Usuario } from '../models/index.js';
import { Op } from 'sequelize';

export const getEventos = async (req, res) => {
  try {
    const where = {};
    if (req.query.cancha_id) where.cancha_id = parseInt(req.query.cancha_id);
    if (req.query.fecha) {
      where.fecha_inicio = { [Op.lte]: req.query.fecha };
      where.fecha_fin = { [Op.gte]: req.query.fecha };
    }
    // NUEVO: filtrar por rango de fechas
    if (req.query.desde && req.query.hasta) {
      where.fecha_inicio = { [Op.gte]: req.query.desde };
      where.fecha_fin = { [Op.lte]: req.query.hasta };
    }
    const eventos = await Evento.findAll({
      where,
      include: [{
        model: Cancha,
        as: 'cancha',
        include: [
          { model: TipoEspacio, as: 'tipoEspacio' },
          { model: EstadoCancha, as: 'estadoCancha' }
        ]
      }],
      order: [['fecha_inicio', 'DESC'], ['hora_inicio', 'DESC']]
    });
    res.json(eventos);
  } catch (error) {
    console.error('Error al obtener eventos:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const getEventoById = async (req, res) => {
  try {
    const evento = await Evento.findByPk(req.params.id, {
      include: [{
        model: Cancha,
        as: 'cancha',
        include: [
          { model: TipoEspacio, as: 'tipoEspacio' },
          { model: EstadoCancha, as: 'estadoCancha' }
        ]
      }]
    });
    if (!evento) {
      return res.status(404).json({ message: 'Evento no encontrado' });
    }
    res.json(evento);
  } catch (error) {
    console.error('Error al obtener evento:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const createEvento = async (req, res) => {
  try {
    console.log('Datos recibidos:', req.body);
    const { nombre, tipo, descripcion, cancha_id, fecha_inicio, fecha_fin, hora_inicio, hora_fin, estado } = req.body;
    
    // Validaciones
    if (!nombre || !tipo || !cancha_id || !fecha_inicio || !fecha_fin || !hora_inicio || !hora_fin || !estado) {
      console.log('Campos faltantes:', { nombre, tipo, cancha_id, fecha_inicio, fecha_fin, hora_inicio, hora_fin, estado });
      return res.status(400).json({ message: 'Todos los campos obligatorios deben estar presentes' });
    }

    // Convertir cancha_id a número
    const canchaId = parseInt(cancha_id);
    if (isNaN(canchaId)) {
      return res.status(400).json({ message: 'ID de cancha inválido' });
    }

    // Validar que la cancha existe
    const cancha = await Cancha.findByPk(canchaId);
    if (!cancha) {
      return res.status(400).json({ message: 'La cancha especificada no existe' });
    }

    // Validar fechas
    if (new Date(fecha_inicio) > new Date(fecha_fin)) {
      return res.status(400).json({ message: 'La fecha de inicio no puede ser posterior a la fecha de fin' });
    }

    // Validar horas solo si son el mismo día
    if (fecha_inicio === fecha_fin) {
      const horaInicioMinutos = parseInt(hora_inicio.split(':')[0]) * 60 + parseInt(hora_inicio.split(':')[1]);
      const horaFinMinutos = parseInt(hora_fin.split(':')[0]) * 60 + parseInt(hora_fin.split(':')[1]);
      
      if (horaInicioMinutos >= horaFinMinutos) {
        return res.status(400).json({ message: 'La hora de inicio debe ser anterior a la hora de fin cuando es el mismo día' });
      }
    }
    
    // Verificar el rol del usuario
    const userRole = req.user.rol?.nombre || req.user.rol;
    console.log('🔍 createEvento - Usuario:', {
      id: req.user.id,
      rol: userRole
    });
    
    // Validar conflictos con eventos existentes (para todos los roles)
    
    // Verificar si ya existe un evento en el mismo espacio que se superponga en fechas
    // Lógica simplificada: dos eventos se superponen si NO se cumplen estas condiciones:
    // 1. El evento existente termina antes de que empiece el nuevo evento
    // 2. El evento existente empieza después de que termine el nuevo evento
    const eventosConflictivos = await Evento.findAll({
      where: {
        cancha_id: canchaId,
        [Op.and]: [
          // NO termina antes del inicio del nuevo evento
          {
            fecha_fin: { [Op.gte]: fecha_inicio }
          },
          // NO empieza después del fin del nuevo evento
          {
            fecha_inicio: { [Op.lte]: fecha_fin }
          }
        ]
      },
      logging: console.log // Agregar logging SQL para debug
    });

    // Agregar logs detallados para debug
    console.log('🔍 Debug - Validación de conflictos:', {
      nuevoEvento: {
        fecha_inicio,
        fecha_fin,
        canchaId
      },
      eventosEncontrados: eventosConflictivos.map(e => ({
        id: e.id,
        nombre: e.nombre,
        fecha_inicio: e.fecha_inicio,
        fecha_fin: e.fecha_fin,
        // Verificar la nueva lógica
        noTerminaAntes: e.fecha_fin >= fecha_inicio,
        noEmpiezaDespues: e.fecha_inicio <= fecha_fin,
        hayConflicto: e.fecha_fin >= fecha_inicio && e.fecha_inicio <= fecha_fin
      }))
    });
    
    console.log('🔍 Eventos conflictivos encontrados:', {
      canchaId,
      fecha_inicio,
      fecha_fin,
      eventosCount: eventosConflictivos.length,
      eventos: eventosConflictivos.map(e => ({
        id: e.id,
        nombre: e.nombre,
        fecha_inicio: e.fecha_inicio,
        fecha_fin: e.fecha_fin,
        hora_inicio: e.hora_inicio,
        hora_fin: e.hora_fin
      }))
    });
    
    if (eventosConflictivos.length > 0) {
      return res.status(400).json({ 
        message: `Ya existe un evento programado en este espacio para las fechas seleccionadas.`,
        conflictos: eventosConflictivos.length
      });
    }
    
    // Verificar si hay reservas que se superpongan con el evento
    console.log('🔍 Buscando reservas conflictivas con criterios:', {
      cancha_id: canchaId,
      estado: 'reservada',
      fecha_range: [fecha_inicio, fecha_fin],
      hora_inicio,
      hora_fin
    });

    // Consulta adicional para debug: ver todas las reservas de la cancha
    const todasLasReservasCancha = await Reserva.findAll({
      where: {
        cancha_id: canchaId
      },
      include: [{
        model: Usuario,
        as: 'usuario',
        attributes: ['id', 'nombres', 'codigo']
      }]
    });

    console.log('🔍 Todas las reservas de la cancha (para debug):', {
      total: todasLasReservasCancha.length,
      reservas: todasLasReservasCancha.map(r => ({
        id: r.id,
        estado: r.estado,
        fecha: r.fecha,
        hora_inicio: r.hora_inicio,
        hora_fin: r.hora_fin,
        usuario: r.usuario ? `${r.usuario.nombres} (${r.usuario.codigo})` : 'Sin usuario'
      }))
    });

    const reservasConflictivas = await Reserva.findAll({
      where: {
        cancha_id: canchaId,
        estado: 'reservada',
        fecha: {
          [Op.between]: [fecha_inicio, fecha_fin]
        }
      },
      include: [{
        model: Usuario,
        as: 'usuario',
        attributes: ['id', 'nombres', 'codigo']
      }]
    });

    console.log('🔍 Todas las reservas encontradas en el rango de fechas:', {
      total: reservasConflictivas.length,
      reservas: reservasConflictivas.map(r => ({
        id: r.id,
        estado: r.estado,
        fecha: r.fecha,
        hora_inicio: r.hora_inicio,
        hora_fin: r.hora_fin,
        usuario: r.usuario ? `${r.usuario.nombres} (${r.usuario.codigo})` : 'Sin usuario'
      }))
    });

    // Filtrar reservas que realmente tienen conflicto de horas
    const reservasConConflictoReal = reservasConflictivas.filter(reserva => {
      console.log('🔍 Analizando reserva para conflicto:', {
        reserva_id: reserva.id,
        reserva_fecha: reserva.fecha,
        reserva_hora_inicio: reserva.hora_inicio,
        reserva_hora_fin: reserva.hora_fin,
        evento_fecha_inicio: fecha_inicio,
        evento_fecha_fin: fecha_fin,
        evento_hora_inicio: hora_inicio,
        evento_hora_fin: hora_fin
      });

      // Si el evento es de múltiples días, cualquier reserva en ese rango tiene conflicto
      if (fecha_inicio !== fecha_fin) {
        console.log('🔍 Evento de múltiples días - conflicto automático');
        return true;
      }
      
      // Si es el mismo día, verificar conflicto de horas
      const reservaHoraInicio = reserva.hora_inicio;
      const reservaHoraFin = reserva.hora_fin;
      
      // Convertir a minutos para comparación
      const eventoInicioMin = parseInt(hora_inicio.split(':')[0]) * 60 + parseInt(hora_inicio.split(':')[1]);
      const eventoFinMin = parseInt(hora_fin.split(':')[0]) * 60 + parseInt(hora_fin.split(':')[1]);
      const reservaInicioMin = parseInt(reservaHoraInicio.split(':')[0]) * 60 + parseInt(reservaHoraInicio.split(':')[1]);
      const reservaFinMin = parseInt(reservaHoraFin.split(':')[0]) * 60 + parseInt(reservaHoraFin.split(':')[1]);
      
      console.log('🔍 Comparación de minutos:', {
        evento: `${eventoInicioMin} - ${eventoFinMin}`,
        reserva: `${reservaInicioMin} - ${reservaFinMin}`,
        hayConflicto: !(eventoFinMin <= reservaInicioMin || eventoInicioMin >= reservaFinMin)
      });
      
      // Hay conflicto si las horas se superponen
      return !(eventoFinMin <= reservaInicioMin || eventoInicioMin >= reservaFinMin);
    });
    
    console.log('🔍 Reservas con conflicto real encontradas:', {
      canchaId,
      fecha_inicio,
      fecha_fin,
      hora_inicio,
      hora_fin,
      reservasCount: reservasConConflictoReal.length,
      reservas: reservasConConflictoReal.map(r => ({
        id: r.id,
        usuario: r.usuario ? `${r.usuario.nombres} (${r.usuario.codigo})` : 'Usuario no encontrado',
        fecha: r.fecha,
        hora_inicio: r.hora_inicio,
        hora_fin: r.hora_fin
      }))
    });
    
    // Si hay reservas conflictivas, devolver información para que el frontend muestre advertencia
    if (reservasConConflictoReal.length > 0) {
      return res.status(409).json({
        message: 'Conflicto con reservas existentes',
        tipo: 'CONFLICTO_RESERVAS',
        reservasConflictivas: {
          cantidad: reservasConConflictoReal.length,
          reservas: reservasConConflictoReal.map(r => ({
            id: r.id,
            usuario: r.usuario ? `${r.usuario.nombres} (${r.usuario.codigo})` : 'Usuario no encontrado',
            fecha: r.fecha,
            hora_inicio: r.hora_inicio,
            hora_fin: r.hora_fin
          }))
        },
        mensajeAdvertencia: `Se van a cancelar ${reservasConConflictoReal.length} reserva(s) de usuario(s) que están programadas en el horario del evento. ¿Desea continuar?`
      });
    }

    console.log('Datos a crear:', {
      nombre,
      tipo,
      descripcion: descripcion || null,
      cancha_id: canchaId,
      fecha_inicio,
      fecha_fin,
      hora_inicio,
      hora_fin,
      estado
    });

    const evento = await Evento.create({
      nombre,
      tipo,
      descripcion: descripcion || null,
      cancha_id: canchaId,
      fecha_inicio,
      fecha_fin,
      hora_inicio,
      hora_fin,
      estado
    });

    console.log('Evento creado:', evento.id);

    const eventoConCancha = await Evento.findByPk(evento.id, {
      include: [{
        model: Cancha,
        as: 'cancha',
        include: [
          { model: TipoEspacio, as: 'tipoEspacio' },
          { model: EstadoCancha, as: 'estadoCancha' }
        ]
      }]
    });

    // Preparar respuesta con información sobre reservas canceladas
    const respuesta = {
      evento: eventoConCancha,
      mensaje: 'Evento creado exitosamente'
    };

    if (reservasConflictivas && reservasConflictivas.length > 0) {
      respuesta.reservasCanceladas = {
        cantidad: reservasConflictivas.length,
        mensaje: `Se cancelaron ${reservasConflictivas.length} reserva(s) automáticamente debido al nuevo evento`,
        reservas: reservasConflictivas.map(r => ({
          id: r.id,
          fecha: r.fecha,
          hora_inicio: r.hora_inicio,
          hora_fin: r.hora_fin
        }))
      };
    }

    res.status(201).json(respuesta);
  } catch (error) {
    console.error('Error detallado al crear evento:', error);
    console.error('Stack trace:', error.stack);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const updateEvento = async (req, res) => {
  try {
    console.log('Datos recibidos para actualizar:', req.body);
    console.log('ID del evento:', req.params.id);
    
    const { nombre, tipo, descripcion, cancha_id, fecha_inicio, fecha_fin, hora_inicio, hora_fin, estado } = req.body;
    
    const evento = await Evento.findByPk(req.params.id);
    if (!evento) {
      return res.status(404).json({ message: 'Evento no encontrado' });
    }

    // Validaciones
    if (!nombre || !tipo || !cancha_id || !fecha_inicio || !fecha_fin || !hora_inicio || !hora_fin || !estado) {
      console.log('Campos faltantes en actualización:', { nombre, tipo, cancha_id, fecha_inicio, fecha_fin, hora_inicio, hora_fin, estado });
      return res.status(400).json({ message: 'Todos los campos obligatorios deben estar presentes' });
    }

    // Convertir cancha_id a número
    const canchaId = parseInt(cancha_id);
    if (isNaN(canchaId)) {
      return res.status(400).json({ message: 'ID de cancha inválido' });
    }

    // Validar que la cancha existe
    const cancha = await Cancha.findByPk(canchaId);
    if (!cancha) {
      return res.status(400).json({ message: 'La cancha especificada no existe' });
    }

    // Validar fechas
    if (new Date(fecha_inicio) > new Date(fecha_fin)) {
      return res.status(400).json({ message: 'La fecha de inicio no puede ser posterior a la fecha de fin' });
    }

    // Validar horas solo si son el mismo día
    if (fecha_inicio === fecha_fin) {
      const horaInicioMinutos = parseInt(hora_inicio.split(':')[0]) * 60 + parseInt(hora_inicio.split(':')[1]);
      const horaFinMinutos = parseInt(hora_fin.split(':')[0]) * 60 + parseInt(hora_fin.split(':')[1]);
      
      if (horaInicioMinutos >= horaFinMinutos) {
        return res.status(400).json({ message: 'La hora de inicio debe ser anterior a la hora de fin cuando es el mismo día' });
      }
    }
    
    // Validar conflictos con eventos existentes (excluyendo el evento actual)
    
    // Verificar si ya existe otro evento en el mismo espacio que se superponga en fechas (excluyendo este)
    // Lógica simplificada: dos eventos se superponen si NO se cumplen estas condiciones:
    // 1. El evento existente termina antes de que empiece el nuevo evento
    // 2. El evento existente empieza después de que termine el nuevo evento
    const eventosConflictivos = await Evento.findAll({
      where: {
        cancha_id: canchaId,
        id: { [Op.ne]: req.params.id }, // Excluir el evento actual
        [Op.and]: [
          // NO termina antes del inicio del nuevo evento
          {
            fecha_fin: { [Op.gte]: fecha_inicio }
          },
          // NO empieza después del fin del nuevo evento
          {
            fecha_inicio: { [Op.lte]: fecha_fin }
          }
        ]
      }
    });
    
    console.log('🔍 Eventos conflictivos encontrados (update):', {
      canchaId,
      fecha_inicio,
      fecha_fin,
      eventosCount: eventosConflictivos.length,
      eventos: eventosConflictivos.map(e => ({
        id: e.id,
        nombre: e.nombre,
        fecha_inicio: e.fecha_inicio,
        fecha_fin: e.fecha_fin,
        hora_inicio: e.hora_inicio,
        hora_fin: e.hora_fin
      }))
    });
    
    if (eventosConflictivos.length > 0) {
      return res.status(400).json({ 
        message: `Ya existe otro evento programado en este espacio para las fechas seleccionadas.`,
        conflictos: eventosConflictivos.length
      });
    }
    
    // Verificar si hay reservas que se superpongan con el evento
    console.log('🔍 Buscando reservas conflictivas con criterios:', {
      cancha_id: canchaId,
      estado: 'reservada',
      fecha_range: [fecha_inicio, fecha_fin],
      hora_inicio,
      hora_fin
    });

    const reservasConflictivas = await Reserva.findAll({
      where: {
        cancha_id: canchaId,
        estado: 'reservada',
        fecha: {
          [Op.between]: [fecha_inicio, fecha_fin]
        }
      },
      include: [{
        model: Usuario,
        as: 'usuario',
        attributes: ['id', 'nombres', 'codigo']
      }]
    });

    console.log('🔍 Todas las reservas encontradas en el rango de fechas:', {
      total: reservasConflictivas.length,
      reservas: reservasConflictivas.map(r => ({
        id: r.id,
        estado: r.estado,
        fecha: r.fecha,
        hora_inicio: r.hora_inicio,
        hora_fin: r.hora_fin,
        usuario: r.usuario ? `${r.usuario.nombres} (${r.usuario.codigo})` : 'Sin usuario'
      }))
    });

    // Filtrar reservas que realmente tienen conflicto de horas
    const reservasConConflictoReal = reservasConflictivas.filter(reserva => {
      console.log('🔍 Analizando reserva para conflicto:', {
        reserva_id: reserva.id,
        reserva_fecha: reserva.fecha,
        reserva_hora_inicio: reserva.hora_inicio,
        reserva_hora_fin: reserva.hora_fin,
        evento_fecha_inicio: fecha_inicio,
        evento_fecha_fin: fecha_fin,
        evento_hora_inicio: hora_inicio,
        evento_hora_fin: hora_fin
      });

      // Si el evento es de múltiples días, cualquier reserva en ese rango tiene conflicto
      if (fecha_inicio !== fecha_fin) {
        console.log('🔍 Evento de múltiples días - conflicto automático');
        return true;
      }
      
      // Si es el mismo día, verificar conflicto de horas
      const reservaHoraInicio = reserva.hora_inicio;
      const reservaHoraFin = reserva.hora_fin;
      
      // Convertir a minutos para comparación
      const eventoInicioMin = parseInt(hora_inicio.split(':')[0]) * 60 + parseInt(hora_inicio.split(':')[1]);
      const eventoFinMin = parseInt(hora_fin.split(':')[0]) * 60 + parseInt(hora_fin.split(':')[1]);
      const reservaInicioMin = parseInt(reservaHoraInicio.split(':')[0]) * 60 + parseInt(reservaHoraInicio.split(':')[1]);
      const reservaFinMin = parseInt(reservaHoraFin.split(':')[0]) * 60 + parseInt(reservaHoraFin.split(':')[1]);
      
      console.log('🔍 Comparación de minutos:', {
        evento: `${eventoInicioMin} - ${eventoFinMin}`,
        reserva: `${reservaInicioMin} - ${reservaFinMin}`,
        hayConflicto: !(eventoFinMin <= reservaInicioMin || eventoInicioMin >= reservaFinMin)
      });
      
      // Hay conflicto si las horas se superponen
      return !(eventoFinMin <= reservaInicioMin || eventoInicioMin >= reservaFinMin);
    });
    
    console.log('🔍 Reservas con conflicto real encontradas (update):', {
      canchaId,
      fecha_inicio,
      fecha_fin,
      hora_inicio,
      hora_fin,
      reservasCount: reservasConConflictoReal.length,
      reservas: reservasConConflictoReal.map(r => ({
        id: r.id,
        usuario: r.usuario ? `${r.usuario.nombres} (${r.usuario.codigo})` : 'Usuario no encontrado',
        fecha: r.fecha,
        hora_inicio: r.hora_inicio,
        hora_fin: r.hora_fin
      }))
    });
    
    // Si hay reservas conflictivas, devolver información para que el frontend muestre advertencia
    if (reservasConConflictoReal.length > 0) {
      return res.status(409).json({
        message: 'Conflicto con reservas existentes',
        tipo: 'CONFLICTO_RESERVAS',
        reservasConflictivas: {
          cantidad: reservasConConflictoReal.length,
          reservas: reservasConConflictoReal.map(r => ({
            id: r.id,
            usuario: r.usuario ? `${r.usuario.nombres} (${r.usuario.codigo})` : 'Usuario no encontrado',
            fecha: r.fecha,
            hora_inicio: r.hora_inicio,
            hora_fin: r.hora_fin
          }))
        },
        mensajeAdvertencia: `Se van a cancelar ${reservasConConflictoReal.length} reserva(s) de usuario(s) que están programadas en el horario del evento. ¿Desea continuar?`
      });
    }

    console.log('Datos a actualizar:', {
      nombre,
      tipo,
      descripcion: descripcion || null,
      cancha_id: canchaId,
      fecha_inicio,
      fecha_fin,
      hora_inicio,
      hora_fin,
      estado
    });

    await evento.update({
      nombre,
      tipo,
      descripcion: descripcion || null,
      cancha_id: canchaId,
      fecha_inicio,
      fecha_fin,
      hora_inicio,
      hora_fin,
      estado
    });

    console.log('Evento actualizado:', req.params.id);

    const eventoActualizado = await Evento.findByPk(req.params.id, {
      include: [{
        model: Cancha,
        as: 'cancha',
        include: [
          { model: TipoEspacio, as: 'tipoEspacio' },
          { model: EstadoCancha, as: 'estadoCancha' }
        ]
      }]
    });

    // Preparar respuesta con información sobre reservas canceladas
    const respuesta = {
      evento: eventoActualizado,
      mensaje: 'Evento actualizado exitosamente'
    };

    if (reservasConflictivas && reservasConflictivas.length > 0) {
      respuesta.reservasCanceladas = {
        cantidad: reservasConflictivas.length,
        mensaje: `Se cancelaron ${reservasConflictivas.length} reserva(s) automáticamente debido a la actualización del evento`,
        reservas: reservasConflictivas.map(r => ({
          id: r.id,
          fecha: r.fecha,
          hora_inicio: r.hora_inicio,
          hora_fin: r.hora_fin
        }))
      };
    }

    res.json(respuesta);
  } catch (error) {
    console.error('Error detallado al actualizar evento:', error);
    console.error('Stack trace:', error.stack);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const deleteEvento = async (req, res) => {
  try {
    const evento = await Evento.findByPk(req.params.id);
    if (!evento) {
      return res.status(404).json({ message: 'Evento no encontrado' });
    }

    await evento.destroy();
    res.json({ message: 'Evento eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar evento:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const getEstadosEvento = async (req, res) => {
  try {
    const estados = [
      { id: 'agendado', nombre: 'Agendado' },
      { id: 'en proceso', nombre: 'En Proceso' },
      { id: 'finalizado', nombre: 'Finalizado' }
    ];
    res.json(estados);
  } catch (error) {
    console.error('Error al obtener estados de evento:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
}; 

export const confirmarEventoConReservas = async (req, res) => {
  try {
    const { eventoData, reservasACancelar, esActualizacion, eventoId } = req.body;
    
    console.log('🔍 Confirmando evento con cancelación de reservas:', {
      esActualizacion,
      eventoId,
      reservasACancelar: reservasACancelar?.length || 0,
      eventoData: {
        nombre: eventoData.nombre,
        tipo: eventoData.tipo,
        cancha_id: eventoData.cancha_id,
        fecha_inicio: eventoData.fecha_inicio,
        fecha_fin: eventoData.fecha_fin
      }
    });

    // Cancelar las reservas conflictivas
    if (reservasACancelar && reservasACancelar.length > 0) {
      console.log('🔍 Cancelando reservas conflictivas...');
      
      for (const reservaId of reservasACancelar) {
        try {
          const reserva = await Reserva.findByPk(reservaId);
          if (reserva && reserva.estado === 'reservada') {
            await reserva.update({ estado: 'cancelada' });
            console.log(`✅ Reserva ${reservaId} cancelada`);
          } else {
            console.log(`⚠️ Reserva ${reservaId} no encontrada o ya no está reservada`);
          }
        } catch (error) {
          console.error(`❌ Error cancelando reserva ${reservaId}:`, error);
        }
      }
      
      console.log(`✅ ${reservasACancelar.length} reserva(s) procesada(s)`);
    }

    let evento;
    
    try {
      if (esActualizacion) {
        // Actualizar evento existente
        console.log('🔍 Actualizando evento existente...');
        evento = await Evento.findByPk(eventoId);
        if (!evento) {
          console.error('❌ Evento no encontrado para actualizar:', eventoId);
          return res.status(404).json({ message: 'Evento no encontrado' });
        }
        
        await evento.update(eventoData);
        console.log('✅ Evento actualizado:', eventoId);
      } else {
        // Crear nuevo evento
        console.log('🔍 Creando nuevo evento...');
        evento = await Evento.create(eventoData);
        console.log('✅ Evento creado:', evento.id);
      }
    } catch (error) {
      console.error('❌ Error al crear/actualizar evento:', error);
      throw error;
    }

    // Obtener el evento con información completa
    try {
      const eventoCompleto = await Evento.findByPk(evento.id, {
        include: [{
          model: Cancha,
          as: 'cancha',
          include: [
            { model: TipoEspacio, as: 'tipoEspacio' },
            { model: EstadoCancha, as: 'estadoCancha' }
          ]
        }]
      });

      // Preparar respuesta
      const respuesta = {
        evento: eventoCompleto,
        mensaje: esActualizacion ? 'Evento actualizado exitosamente' : 'Evento creado exitosamente'
      };

      if (reservasACancelar && reservasACancelar.length > 0) {
        respuesta.reservasCanceladas = {
          cantidad: reservasACancelar.length,
          mensaje: `Se cancelaron ${reservasACancelar.length} reserva(s) debido al evento`
        };
      }

      console.log('✅ Respuesta preparada:', {
        eventoId: evento.id,
        reservasCanceladas: reservasACancelar?.length || 0
      });

      res.status(esActualizacion ? 200 : 201).json(respuesta);
    } catch (error) {
      console.error('❌ Error al obtener evento completo:', error);
      throw error;
    }
  } catch (error) {
    console.error('❌ Error al confirmar evento con reservas:', error);
    console.error('Stack trace:', error.stack);
    res.status(500).json({ 
      message: 'Error interno del servidor',
      error: error.message 
    });
  }
}; 