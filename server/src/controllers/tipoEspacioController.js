import TipoEspacio from '../models/tipoEspacio.js';
import multer from 'multer';

const storage = multer.memoryStorage();
const upload = multer({ storage });

export const uploadTipoEspacioImage = upload.single('imagen');

export const getTiposEspacio = async (req, res) => {
  const tipos = await TipoEspacio.findAll();
  const tiposConImagen = tipos.map(t => ({
    ...t.toJSON(),
    imagen: t.imagen ? t.imagen.toString('base64') : null
  }));
  res.json(tiposConImagen);
};

export const getTipoEspacio = async (req, res) => {
  const { id } = req.params;
  const tipo = await TipoEspacio.findByPk(id);
  if (!tipo) return res.status(404).json({ message: 'Tipo de espacio no encontrado' });
  res.json({
    ...tipo.toJSON(),
    imagen: tipo.imagen ? tipo.imagen.toString('base64') : null
  });
};

export const createTipoEspacio = async (req, res) => {
  try {
    const { nombre, descripcion } = req.body;
    const imagen = req.file ? req.file.buffer : null;
    const tipo = await TipoEspacio.create({ nombre, descripcion, imagen });
    res.status(201).json(tipo);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const updateTipoEspacio = async (req, res) => {
  const { id } = req.params;
  try {
    const tipo = await TipoEspacio.findByPk(id);
    if (!tipo) return res.status(404).json({ message: 'Tipo de espacio no encontrado' });
    const { nombre, descripcion } = req.body;
    let imagen = tipo.imagen;
    if (req.file) imagen = req.file.buffer;
    await tipo.update({ nombre, descripcion, imagen });
    res.json(tipo);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteTipoEspacio = async (req, res) => {
  const { id } = req.params;
  try {
    const tipo = await TipoEspacio.findByPk(id);
    if (!tipo) return res.status(404).json({ message: 'Tipo de espacio no encontrado' });
    await tipo.destroy();
    res.json({ message: 'Tipo de espacio eliminado' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}; 