import Usuario from '../models/usuario.js';
import Rol from '../models/rol.js';
import bcrypt from 'bcrypt';
import { generateToken } from '../config/jwt.js';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

// Configuración de bcrypt desde variables de entorno
const BCRYPT_SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 10;

// Función createUser con bcrypt (siguiendo el patrón de la imagen)
export const createUser = async (req, res) => {
  const { userName, email, password, codigo, rol_id } = req.body;
  
  if (!userName || !email || !password || !codigo || !rol_id) {
    return res.status(400).json({ message: 'Missing fields, all are mandatory!' });
  }

  try {
    // Verificar si el usuario ya existe
    const userFound = await Usuario.findOne({ where: { correo: email } });
    if (userFound) {
      return res.status(400).json({ message: 'User already exist' });
    }

    // Encriptar contraseña con bcrypt
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Crear usuario
    const nuevoUsuario = await Usuario.create({
      nombres: userName,
      correo: email,
      contrasena: hashedPassword,
      codigo: codigo,
      rol_id: rol_id
    });

    // Generar token JWT
    const token = generateToken({
      id: nuevoUsuario.id,
      nombres: nuevoUsuario.nombres,
      correo: nuevoUsuario.correo,
      codigo: nuevoUsuario.codigo,
      rol_id: nuevoUsuario.rol_id
    });

    res.status(201).json({
      email: nuevoUsuario.correo,
      userName: nuevoUsuario.nombres,
      id: nuevoUsuario.id,
      token: token
    });
  } catch (error) {
    console.error('Error al crear usuario:', error);
    res.status(400).json({ message: 'Error interno del servidor' });
  }
};

// Función loginUser con bcrypt (siguiendo el patrón de la imagen)
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Buscar usuario por correo
    const userFound = await Usuario.findOne({
      where: { correo: email },
      include: [{ model: Rol, as: 'rol' }]
    });

    // Verificar usuario y contraseña con bcrypt
    if (userFound && (await bcrypt.compare(password, userFound.contrasena))) {
      // Generar token JWT
      const token = generateToken({
        id: userFound.id,
        nombres: userFound.nombres,
        correo: userFound.correo,
        codigo: userFound.codigo,
        rol: userFound.rol?.nombre,
        rol_id: userFound.rol_id
      });

      res.json({
        message: 'Login User',
        email: userFound.correo,
        userName: userFound.nombres,
        id: userFound.id,
        rol: userFound.rol?.nombre,
        token: token
      });
    } else {
      res.status(400).json({ message: 'Login Failed' });
    }
  } catch (err) {
    console.error('ERROR EN LOGIN:', err);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// Función protectedAction para probar (siguiendo el patrón de la imagen)
export const protectedAction = async (req, res) => {
  try {
    const loggedUser = await Usuario.findByPk(req.user.id);
    res.status(200).json({
      id: loggedUser.id,
      userName: loggedUser.nombres,
      email: loggedUser.correo
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener usuario' });
  }
};

// Función para verificar autenticación
export const verifyAuth = async (req, res) => {
  try {
    res.json({
      user: req.user,
      message: 'Token válido'
    });
  } catch (error) {
    res.status(401).json({ message: 'Token inválido' });
  }
};

// Otras funciones básicas
export const getUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.findAll({
      include: [{ model: Rol, as: 'rol' }]
    });
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener usuarios' });
  }
};

// Función para obtener usuarios básicos (público, para formularios)
export const getUsuariosBasicos = async (req, res) => {
  try {
    const usuarios = await Usuario.findAll({
      attributes: ['id', 'nombres', 'codigo'],
      order: [['nombres', 'ASC']]
    });
    res.json(usuarios);
  } catch (error) {
    console.error('Error obteniendo usuarios básicos:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const getUsuario = async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.params.id, {
      include: [{ model: Rol, as: 'rol' }]
    });
    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.json(usuario);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener usuario' });
  }
};

export const updateUsuario = async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.params.id);
    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    await usuario.update(req.body);
    res.json(usuario);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar usuario' });
  }
};

export const deleteUsuario = async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.params.id);
    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    await usuario.destroy();
    res.json({ message: 'Usuario eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar usuario' });
  }
}; 