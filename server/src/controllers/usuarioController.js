import Usuario from '../models/usuario.js';
import Rol from '../models/rol.js';
import Reserva from '../models/reserva.js';
import Cancha from '../models/cancha.js';
import TipoEspacio from '../models/tipoEspacio.js';
import EstadoCancha from '../models/estadoCancha.js';
import Feedback from '../models/feedback.js';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

dotenv.config();

const generateToken = (id) =>{
  return jwt.sign({id}, '12345678' , {expiresIn: '30d'})
}
export const login = async (req, res) => {
  try {
    const { correo, contrasena } = req.body;
    
    console.log('=== LOGIN ATTEMPT ===');
    console.log('Email recibido:', correo);
    console.log('Password recibido:', contrasena);
    console.log('Body completo:', req.body);
    
    // Buscar usuario por correo
    const usuario = await Usuario.findOne({
      where: { correo },
      include: [{ model: Rol, as: 'rol' }]
    });

    console.log('Usuario encontrado:', usuario ? 'SÍ' : 'NO');

    if (usuario && await bcrypt.compare(contrasena, usuario.contrasena)) {
      console.log('Datos del usuario:', {
        id: usuario.id,
        nombres: usuario.nombres,
        correo: usuario.correo,
        contrasena: usuario.contrasena ? 'EXISTE' : 'NO EXISTE',
        rol: usuario.rol ? usuario.rol.nombre : 'NO TIENE ROL',
        token: generateToken(usuario.codigo)
      });
    }

    if (!usuario) {
      console.log('ERROR: Usuario no encontrado');
      return res.status(401).json({ message: 'Correo o contraseña incorrectos' });
    }

    // Verificar contraseña en texto plano
    console.log('Verificando contraseña...');
    console.log('Contraseña en BD:', usuario.contrasena);
    console.log('Contraseña ingresada:', contrasena);
    
    // Devolver información del usuario (sin contraseña)
    const userData = {
      id: usuario.id,
      nombres: usuario.nombres,
      correo: usuario.correo,
      codigo: usuario.codigo,
      rol: usuario.rol.nombre,
      rol_id: usuario.rol_id,
      token: generateToken(usuario.codigo)
    };

    console.log('LOGIN EXITOSO - Datos devueltos:', userData);
    console.log('=== FIN LOGIN ===');
    
    res.json(userData);
  } catch (err) {
    console.error('ERROR EN LOGIN:', err);
    console.error('Stack trace:', err.stack);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const getUsuarios = async (req, res) => {
  const usuarios = await Usuario.findAll({
    include: [
      { model: Rol, as: 'rol' },
      { model: Reserva, as: 'reservas', include: [
        { model: Cancha, as: 'cancha', include: [
          { model: TipoEspacio, as: 'tipoEspacio' },
          { model: EstadoCancha, as: 'estadoCancha' }
        ] }
      ] },
      { model: Feedback, as: 'feedbacks', include: [
        { model: Cancha, as: 'cancha', include: [
          { model: TipoEspacio, as: 'tipoEspacio' }
        ] }
      ] }
    ]
  });
  res.json(usuarios);
};

export const getUsuario = async (req, res) => {
  const { id } = req.params;
  const usuario = await Usuario.findByPk(id, {
    include: [
      { model: Rol, as: 'rol' },
      { model: Reserva, as: 'reservas', include: [
        { model: Cancha, as: 'cancha', include: [
          { model: TipoEspacio, as: 'tipoEspacio' },
          { model: EstadoCancha, as: 'estadoCancha' }
        ] }
      ] },
      { model: Feedback, as: 'feedbacks', include: [
        { model: Cancha, as: 'cancha', include: [
          { model: TipoEspacio, as: 'tipoEspacio' }
        ] }
      ] }
    ]
  });
  if (!usuario) return res.status(404).json({ message: 'Usuario no encontrado' });
  res.json(usuario);
};

export const createUsuario = async (req, res) => {
  try {
    const { nombres, correo, contrasena, rol_id, codigo } = req.body;
    const existe = await Usuario.findOne({ where: { codigo } });
    if (existe) return res.status(400).json({ message: 'El código ya existe' });
    
    // Encriptar contraseña
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(contrasena, saltRounds);
    
    const usuario = await Usuario.create({ 
      nombres, 
      correo, 
      contrasena: hashedPassword, 
      rol_id, 
      codigo 
    });
    res.status(201).json({usuario , token: generateToken(usuario.codigo)});
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const updateUsuario = async (req, res) => {
  const { id } = req.params;
  try {
    const usuario = await Usuario.findByPk(id);
    if (!usuario) return res.status(404).json({ message: 'Usuario no encontrado' });
    
    // Si se está actualizando la contraseña, encriptarla
    if (req.body.contrasena) {
      const saltRounds = 10;
      req.body.contrasena = await bcrypt.hash(req.body.contrasena, saltRounds);
    }
    
    await usuario.update(req.body);
    res.json(usuario);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteUsuario = async (req, res) => {
  const { id } = req.params;
  try {
    const usuario = await Usuario.findByPk(id);
    if (!usuario) return res.status(404).json({ message: 'Usuario no encontrado' });
    await usuario.destroy();
    res.json({ message: 'Usuario eliminado' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}; 