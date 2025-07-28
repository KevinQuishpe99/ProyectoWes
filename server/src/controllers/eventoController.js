import { Evento, Cancha, TipoEspacio, EstadoCancha } from '../models/index.js';
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
      order: [['fecha_inicio', 'ASC'], ['hora_inicio', 'ASC']]
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

    res.status(201).json(eventoConCancha);
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

    res.json(eventoActualizado);
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