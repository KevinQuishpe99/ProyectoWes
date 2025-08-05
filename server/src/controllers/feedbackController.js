import { Feedback, Usuario, Cancha, Rol, TipoEspacio } from '../models/index.js';
import { Op } from 'sequelize';

export const getFeedbacks = async (req, res) => {
  try {
    const where = {};
    if (req.query.usuario_id) where.usuario_id = parseInt(req.query.usuario_id);
    if (req.query.cancha_id) where.cancha_id = parseInt(req.query.cancha_id);
    if (req.query.calificacion) where.calificacion = parseInt(req.query.calificacion);
    
    // Filtro por fecha específica
    if (req.query.fecha) {
      const fechaFiltro = new Date(req.query.fecha);
      const fechaInicio = new Date(fechaFiltro.setHours(0, 0, 0, 0));
      const fechaFin = new Date(fechaFiltro.setHours(23, 59, 59, 999));
      
      where.fecha = {
        [Op.between]: [fechaInicio, fechaFin]
      };
    }
    
    const feedbacks = await Feedback.findAll({
      where,
      include: [
        { model: Usuario, as: 'usuario', include: [{ model: Rol, as: 'rol' }] },
        { model: Cancha, as: 'cancha', include: [{ model: TipoEspacio, as: 'tipoEspacio' }] }
      ],
      order: [['fecha', 'DESC']] // Siempre ordenar del más reciente al más antiguo
    });
    res.json(feedbacks);
  } catch (error) {
    console.error('Error al obtener feedbacks:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const getFeedbackById = async (req, res) => {
  try {
    const feedback = await Feedback.findByPk(req.params.id, {
      include: [
        { model: Usuario, as: 'usuario', include: [{ model: Rol, as: 'rol' }] },
        { model: Cancha, as: 'cancha', include: [{ model: TipoEspacio, as: 'tipoEspacio' }] }
      ]
    });
    if (!feedback) {
      return res.status(404).json({ message: 'Feedback no encontrado' });
    }
    res.json(feedback);
  } catch (error) {
    console.error('Error al obtener feedback:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const createFeedback = async (req, res) => {
  try {
    const { usuario_id, cancha_id, comentario, calificacion } = req.body;
    
    // Validaciones
    if (!usuario_id || !cancha_id) {
      return res.status(400).json({ message: 'Usuario y cancha son obligatorios' });
    }

    // Validar que el usuario existe
    const usuario = await Usuario.findByPk(usuario_id);
    if (!usuario) {
      return res.status(400).json({ message: 'El usuario especificado no existe' });
    }

    // Validar que la cancha existe
    const cancha = await Cancha.findByPk(cancha_id);
    if (!cancha) {
      return res.status(400).json({ message: 'La cancha especificada no existe' });
    }

    // Validar calificación si se proporciona
    if (calificacion && (calificacion < 1 || calificacion > 5)) {
      return res.status(400).json({ message: 'La calificación debe estar entre 1 y 5' });
    }

    const feedback = await Feedback.create({
      usuario_id: parseInt(usuario_id),
      cancha_id: parseInt(cancha_id),
      comentario: comentario || null,
      calificacion: calificacion ? parseInt(calificacion) : null,
      respuesta: null,
      fecha: new Date()
    });

    const feedbackConRelaciones = await Feedback.findByPk(feedback.id, {
      include: [
        { model: Usuario, as: 'usuario', include: [{ model: Rol, as: 'rol' }] },
        { model: Cancha, as: 'cancha', include: [{ model: TipoEspacio, as: 'tipoEspacio' }] }
      ]
    });

    res.status(201).json(feedbackConRelaciones);
  } catch (error) {
    console.error('Error al crear feedback:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const updateFeedback = async (req, res) => {
  try {
    const { usuario_id, cancha_id, comentario, calificacion, respuesta } = req.body;
    
    const feedback = await Feedback.findByPk(req.params.id);
    if (!feedback) {
      return res.status(404).json({ message: 'Feedback no encontrado' });
    }

    // Verificar si es admin
    const isAdmin = req.user.rol?.nombre === 'admin' || req.user.rol === 'admin';

    if (isAdmin) {
      // Si es admin, solo permitir editar comentario y respuesta
      await feedback.update({
        comentario: comentario || null,
        respuesta: respuesta || null
      });
    } else {
      // Si no es admin, validar todos los campos
      if (!usuario_id || !cancha_id) {
        return res.status(400).json({ message: 'Usuario y cancha son obligatorios' });
      }

      // Validar que el usuario existe
      const usuario = await Usuario.findByPk(usuario_id);
      if (!usuario) {
        return res.status(400).json({ message: 'El usuario especificado no existe' });
      }

      // Validar que la cancha existe
      const cancha = await Cancha.findByPk(cancha_id);
      if (!cancha) {
        return res.status(400).json({ message: 'La cancha especificada no existe' });
      }

      // Validar calificación si se proporciona
      if (calificacion && (calificacion < 1 || calificacion > 5)) {
        return res.status(400).json({ message: 'La calificación debe estar entre 1 y 5' });
      }

      await feedback.update({
        usuario_id: parseInt(usuario_id),
        cancha_id: parseInt(cancha_id),
        comentario: comentario || null,
        calificacion: calificacion ? parseInt(calificacion) : null,
        respuesta: respuesta || null
      });
    }

    const feedbackActualizado = await Feedback.findByPk(req.params.id, {
      include: [
        { model: Usuario, as: 'usuario', include: [{ model: Rol, as: 'rol' }] },
        { model: Cancha, as: 'cancha', include: [{ model: TipoEspacio, as: 'tipoEspacio' }] }
      ]
    });

    res.json(feedbackActualizado);
  } catch (error) {
    console.error('Error al actualizar feedback:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const deleteFeedback = async (req, res) => {
  try {
    console.log('🗑️ Intentando eliminar feedback:', req.params.id);
    console.log('👤 Usuario que solicita eliminación:', req.user);
    
    const feedback = await Feedback.findByPk(req.params.id, {
      include: [
        { model: Usuario, as: 'usuario' },
        { model: Cancha, as: 'cancha' }
      ]
    });
    
    if (!feedback) {
      console.log('❌ Feedback no encontrado:', req.params.id);
      return res.status(404).json({ message: 'Feedback no encontrado' });
    }

    console.log('📋 Feedback encontrado:', {
      id: feedback.id,
      usuario: feedback.usuario?.nombres,
      cancha: feedback.cancha?.nombre,
      fecha: feedback.fecha
    });

    // Intentar eliminar el feedback
    await feedback.destroy();
    console.log('✅ Feedback eliminado exitosamente');
    res.json({ message: 'Feedback eliminado correctamente' });
    
  } catch (error) {
    console.error('❌ Error al eliminar feedback:', error);
    console.error('Detalles del error:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    
    // Detectar errores específicos de restricción de clave foránea
    if (error.name === 'SequelizeForeignKeyConstraintError') {
      return res.status(400).json({ 
        message: 'No se puede eliminar el feedback. Puede estar asociado a dependencias.',
        details: 'El feedback está referenciado por otras entidades del sistema.'
      });
    }
    
    // Detectar errores de restricción de verificación
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ 
        message: 'No se puede eliminar el feedback. Datos inválidos.',
        details: error.message
      });
    }
    
    // Error genérico
    res.status(500).json({ 
      message: 'Error interno del servidor al eliminar el feedback',
      details: process.env.NODE_ENV === 'development' ? error.message : 'Error interno'
    });
  }
};

export const responderFeedback = async (req, res) => {
  try {
    const { respuesta } = req.body;
    
    const feedback = await Feedback.findByPk(req.params.id);
    if (!feedback) {
      return res.status(404).json({ message: 'Feedback no encontrado' });
    }

    if (!respuesta) {
      return res.status(400).json({ message: 'La respuesta es obligatoria' });
    }

    // Actualizar el campo respuesta
    await feedback.update({
      respuesta: respuesta
    });

    const feedbackActualizado = await Feedback.findByPk(req.params.id, {
      include: [
        { model: Usuario, as: 'usuario', include: [{ model: Rol, as: 'rol' }] },
        { model: Cancha, as: 'cancha', include: [{ model: TipoEspacio, as: 'tipoEspacio' }] }
      ]
    });

    res.json(feedbackActualizado);
  } catch (error) {
    console.error('Error al responder feedback:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const getFeedbacksPorUsuario = async (req, res) => {
  try {
    const { usuarioId } = req.params;
    
    const feedbacks = await Feedback.findAll({
      where: { usuario_id: usuarioId },
      include: [
        { model: Usuario, as: 'usuario', include: [{ model: Rol, as: 'rol' }] },
        { model: Cancha, as: 'cancha', include: [{ model: TipoEspacio, as: 'tipoEspacio' }] }
      ],
      order: [['fecha', 'DESC']]
    });
    
    res.json(feedbacks);
  } catch (error) {
    console.error('Error al obtener feedbacks por usuario:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
}; 