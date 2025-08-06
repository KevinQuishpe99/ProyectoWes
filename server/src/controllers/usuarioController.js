// Importación del modelo Usuario para operaciones de base de datos
import Usuario from '../models/usuario.js';
// Importación del modelo Rol para incluir información del rol
import Rol from '../models/rol.js';
// Importación de bcrypt para encriptación de contraseñas
import bcrypt from 'bcrypt';
// Importación de la función para generar tokens JWT
import { generateToken } from '../config/jwt.js';
// Importación de dotenv para cargar variables de entorno
import dotenv from 'dotenv';

// Cargar variables de entorno desde el archivo .env
dotenv.config();

// Configuración de bcrypt desde variables de entorno con valor por defecto
const BCRYPT_SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 10;

// Función para crear un nuevo usuario (registro)
export const createUser = async (req, res) => {
  // Extraer datos del cuerpo de la petición
  const { userName, email, password, codigo, rol_id } = req.body;
  
  // Validar que todos los campos obligatorios estén presentes
  if (!userName || !email || !password || !codigo || !rol_id) {
    return res.status(400).json({ message: 'Missing fields, all are mandatory!' });
  }

  // Validar que el correo tenga el dominio @epn.edu.ec
  const emailRegex = /^[^\s@]+@epn\.edu\.ec$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ 
      message: 'El correo electrónico debe tener el dominio @epn.edu.ec' 
    });
  }

  try {
    // Verificar si el usuario ya existe en la base de datos
    const userFound = await Usuario.findOne({ where: { correo: email } });
    if (userFound) {
      return res.status(400).json({ message: 'User already exist' });
    }

    // Encriptar contraseña con bcrypt usando 10 rondas de salt
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Crear el nuevo usuario en la base de datos
    const nuevoUsuario = await Usuario.create({
      nombres: userName,
      correo: email,
      contrasena: hashedPassword,
      codigo: codigo,
      rol_id: rol_id
    });

    // Generar token JWT para el usuario recién creado
    const token = generateToken({
      id: nuevoUsuario.id,
      nombres: nuevoUsuario.nombres,
      correo: nuevoUsuario.correo,
      codigo: nuevoUsuario.codigo,
      rol_id: nuevoUsuario.rol_id
    });

    // Responder con los datos del usuario creado y el token
    res.status(201).json({
      email: nuevoUsuario.correo,
      userName: nuevoUsuario.nombres,
      id: nuevoUsuario.id,
      rol_id: nuevoUsuario.rol_id,
      token: token
    });
  } catch (error) {
    // Manejar errores durante la creación del usuario
    console.error('Error al crear usuario:', error);
    res.status(400).json({ message: 'Error interno del servidor' });
  }
};

// Función para autenticar usuario (login)
export const loginUser = async (req, res) => {
  try {
    // Extraer credenciales del cuerpo de la petición
    const { email, password } = req.body;
    
    // Validar que el correo tenga el dominio @epn.edu.ec
    const emailRegex = /^[^\s@]+@epn\.edu\.ec$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        message: 'El correo electrónico debe tener el dominio @epn.edu.ec' 
      });
    }
    
    // Buscar usuario por correo incluyendo información del rol
    const userFound = await Usuario.findOne({
      where: { correo: email },
      include: [{ model: Rol, as: 'rol' }]
    });

    // Verificar usuario y contraseña con bcrypt
    if (userFound && (await bcrypt.compare(password, userFound.contrasena))) {
      // Generar token JWT para el usuario autenticado
      const token = generateToken({
        id: userFound.id,
        nombres: userFound.nombres,
        correo: userFound.correo,
        codigo: userFound.codigo,
        rol: userFound.rol?.nombre,
        rol_id: userFound.rol_id
      });

      // Responder con los datos del usuario y el token
      res.json({
        message: 'Login User',
        email: userFound.correo,
        userName: userFound.nombres,
        id: userFound.id,
        rol: userFound.rol?.nombre,
        rol_id: userFound.rol_id,
        token: token
      });
    } else {
      // Si las credenciales son incorrectas
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    // Manejar errores durante el login
    console.error('Error en login:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// Función para verificar autenticación (usada por el middleware)
export const protectedAction = async (req, res) => {
  try {
    // Responder con información del usuario autenticado
    res.json({
      message: 'Protected action',
      user: req.user
    });
  } catch (error) {
    // Manejar errores
    console.error('Error en protected action:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// Función para verificar token de autenticación
export const verifyAuth = async (req, res) => {
  try {
    // Responder con información del usuario autenticado
    res.json({
      message: 'Token válido',
      user: req.user
    });
  } catch (error) {
    // Manejar errores
    console.error('Error verificando autenticación:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// Función para obtener todos los usuarios (solo admin/organizador)
export const getUsuarios = async (req, res) => {
  try {
    // Buscar todos los usuarios incluyendo información del rol
    const usuarios = await Usuario.findAll({
      include: [{ model: Rol, as: 'rol' }],
      attributes: { exclude: ['contrasena'] } // Excluir contraseñas por seguridad
    });

    // Responder con la lista de usuarios
    res.json(usuarios);
  } catch (error) {
    // Manejar errores
    console.error('Error obteniendo usuarios:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// Función para obtener usuarios básicos (sin información sensible)
export const getUsuariosBasicos = async (req, res) => {
  try {
    // Buscar usuarios con información básica
    const usuarios = await Usuario.findAll({
      include: [{ model: Rol, as: 'rol' }],
      attributes: ['id', 'nombres', 'correo', 'codigo', 'rol_id'] // Solo campos básicos
    });

    // Responder con la lista de usuarios básicos
    res.json(usuarios);
  } catch (error) {
    // Manejar errores
    console.error('Error obteniendo usuarios básicos:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// Función para obtener un usuario específico por ID
export const getUsuario = async (req, res) => {
  try {
    // Obtener ID del usuario desde los parámetros de la URL
    const { id } = req.params;

    // Buscar usuario por ID incluyendo información del rol
    const usuario = await Usuario.findByPk(id, {
      include: [{ model: Rol, as: 'rol' }],
      attributes: { exclude: ['contrasena'] } // Excluir contraseña por seguridad
    });

    // Verificar si el usuario existe
    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Responder con los datos del usuario
    res.json(usuario);
  } catch (error) {
    // Manejar errores
    console.error('Error obteniendo usuario:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// Función para actualizar un usuario
export const updateUsuario = async (req, res) => {
  try {
    // Obtener ID del usuario desde los parámetros de la URL
    const { id } = req.params;
    // Obtener datos de actualización del cuerpo de la petición
    const updateData = req.body;

    // Si se está actualizando el correo, validar el dominio
    if (req.body.correo) {
      const emailRegex = /^[^\s@]+@epn\.edu\.ec$/;
      if (!emailRegex.test(req.body.correo)) {
        return res.status(400).json({
          message: 'El correo electrónico debe tener el dominio @epn.edu.ec'
        });
      }
    }

    // Buscar usuario por ID
    const usuario = await Usuario.findByPk(id);
    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Actualizar usuario en la base de datos
    await usuario.update(updateData);

    // Responder con confirmación
    res.json({ message: 'Usuario actualizado correctamente' });
  } catch (error) {
    // Manejar errores
    console.error('Error actualizando usuario:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// Función para eliminar un usuario
export const deleteUsuario = async (req, res) => {
  try {
    // Obtener ID del usuario desde los parámetros de la URL
    const { id } = req.params;

    // Buscar usuario por ID
    const usuario = await Usuario.findByPk(id);
    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Eliminar usuario de la base de datos
    await usuario.destroy();

    // Responder con confirmación
    res.json({ message: 'Usuario eliminado correctamente' });
  } catch (error) {
    // Manejar errores
    console.error('Error eliminando usuario:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
}; 