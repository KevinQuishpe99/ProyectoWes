import Cancha from '../models/cancha.js';
import TipoEspacio from '../models/tipoEspacio.js';
import EstadoCancha from '../models/estadoCancha.js';
import Reserva from '../models/reserva.js';
import Evento from '../models/evento.js';
import Feedback from '../models/feedback.js';
import Usuario from '../models/usuario.js';
import multer from 'multer';

const storage = multer.memoryStorage();
const upload = multer({ storage });

export const uploadCanchaImage = upload.single('imagen');

export const getCanchas = async (req, res) => {
  const canchas = await Cancha.findAll({
    include: [
      { model: TipoEspacio, as: 'tipoEspacio' },
      { model: EstadoCancha, as: 'estadoCancha' },
      { model: Reserva, as: 'reservas', include: [{ model: Usuario, as: 'usuario' }] },
      { model: Evento, as: 'eventos' },
      { model: Feedback, as: 'feedbacks', include: [{ model: Usuario, as: 'usuario' }] }
    ]
  });
  const canchasConImagen = canchas.map(c => {
    const obj = c.toJSON();
    return {
      ...obj,
      imagen: obj.imagen ? obj.imagen.toString('base64') : null,
      ubicacion_referencia: obj.ubicacion_referencia || null,
      disponibilidad: typeof obj.disponibilidad !== 'undefined' ? obj.disponibilidad : null,
      tipoEspacioNombre: obj.tipoEspacio?.nombre || null,
      estadoCanchaNombre: obj.estadoCancha?.nombre || null
    };
  });
  res.json(canchasConImagen);
};

export const getCancha = async (req, res) => {
  const { id } = req.params;
  const cancha = await Cancha.findByPk(id, {
    include: [
      { model: TipoEspacio, as: 'tipoEspacio' },
      { model: EstadoCancha, as: 'estadoCancha' },
      { model: Reserva, as: 'reservas', include: [{ model: Usuario, as: 'usuario' }] },
      { model: Evento, as: 'eventos' },
      { model: Feedback, as: 'feedbacks', include: [{ model: Usuario, as: 'usuario' }] }
    ]
  });
  if (!cancha) return res.status(404).json({ message: 'Cancha no encontrada' });
  const obj = cancha.toJSON();
  res.json({
    ...obj,
    imagen: obj.imagen ? obj.imagen.toString('base64') : null,
    ubicacion_referencia: obj.ubicacion_referencia || null,
    disponibilidad: typeof obj.disponibilidad !== 'undefined' ? obj.disponibilidad : null
  });
};

export const createCancha = async (req, res) => {
  try {
    let { nombre, capacidad, tipo_espacio_id, ubicacion_referencia, descripcion, estado_id } = req.body;
    capacidad = Number(capacidad);
    tipo_espacio_id = Number(tipo_espacio_id);
    estado_id = Number(estado_id);
    if (!nombre || !capacidad || !tipo_espacio_id || !estado_id) {
      return res.status(400).json({ message: 'Faltan campos obligatorios: nombre, capacidad, tipo_espacio_id, estado_id.' });
    }
    const imagen = req.file ? req.file.buffer : null;
    const cancha = await Cancha.create({ nombre, capacidad, tipo_espacio_id, ubicacion_referencia, descripcion, imagen, estado_id });
    res.status(201).json(cancha);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const updateCancha = async (req, res) => {
  const { id } = req.params;
  try {
    const cancha = await Cancha.findByPk(id, { include: [
      { model: TipoEspacio, as: 'tipoEspacio' },
      { model: EstadoCancha, as: 'estadoCancha' }
    ] });
    if (!cancha) return res.status(404).json({ message: 'Cancha no encontrada' });
    let { nombre, capacidad, tipo_espacio_id, ubicacion_referencia, descripcion, estado_id } = req.body;
    capacidad = Number(capacidad);
    tipo_espacio_id = Number(tipo_espacio_id);
    estado_id = Number(estado_id);
    if (!nombre || !capacidad || !tipo_espacio_id || !estado_id) {
      return res.status(400).json({ message: 'Faltan campos obligatorios: nombre, capacidad, tipo_espacio_id, estado_id.' });
    }
    let imagen = cancha.imagen;
    if (req.file) imagen = req.file.buffer;
    await cancha.update({ nombre, capacidad, tipo_espacio_id, ubicacion_referencia, descripcion, imagen, estado_id });
    // Refetch con includes para devolver la cancha procesada
    const updated = await Cancha.findByPk(id, { include: [
      { model: TipoEspacio, as: 'tipoEspacio' },
      { model: EstadoCancha, as: 'estadoCancha' }
    ] });
    const obj = updated.toJSON();
    res.json({
      ...obj,
      imagen: obj.imagen ? obj.imagen.toString('base64') : null,
      ubicacion_referencia: obj.ubicacion_referencia || null,
      disponibilidad: typeof obj.disponibilidad !== 'undefined' ? obj.disponibilidad : null,
      tipoEspacioNombre: obj.tipoEspacio?.nombre || null,
      estadoCanchaNombre: obj.estadoCancha?.nombre || null
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteCancha = async (req, res) => {
  const { id } = req.params;
  try {
    const cancha = await Cancha.findByPk(id);
    if (!cancha) return res.status(404).json({ message: 'Cancha no encontrada' });
    await cancha.destroy();
    res.json({ message: 'Cancha eliminada' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}; 