// Importación de jsonwebtoken para manejo de tokens JWT
import jwt from 'jsonwebtoken';
// Importación de dotenv para cargar variables de entorno
import dotenv from 'dotenv';

// Cargar variables de entorno desde el archivo .env
dotenv.config();

// Configuración JWT desde variables de entorno con valores por defecto
const JWT_SECRET = process.env.JWT_SECRET || 'epn_canchas_super_secret_key_2024'; // Clave secreta para firmar tokens
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h'; // Tiempo de expiración del token principal
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '7d'; // Tiempo de expiración del refresh token

// Función para generar token JWT principal
export const generateToken = (user) => {
  // Payload del token con información del usuario
  const payload = {
    id: user.id, // ID único del usuario
    email: user.correo, // Email del usuario
    nombres: user.nombres, // Nombre completo del usuario
    rol: user.rol, // Rol del usuario (admin, organizador, usuario)
    rol_id: user.rol_id, // ID del rol del usuario
    codigo: user.codigo // Código de estudiante del usuario
  };

  // Firmar y generar el token JWT con la clave secreta y tiempo de expiración
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

// Función para generar refresh token (token de renovación)
export const generateRefreshToken = (user) => {
  // Payload del refresh token (mínimo de información)
  const payload = {
    id: user.id, // ID único del usuario
    type: 'refresh' // Tipo de token para identificar que es un refresh token
  };

  // Firmar y generar el refresh token con tiempo de expiración más largo
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_REFRESH_EXPIRES_IN });
};

// Función para verificar y decodificar un token JWT
export const verifyToken = (token) => {
  try {
    // Verificar y decodificar el token usando la clave secreta
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    // Si hay error en la verificación, lanzar error personalizado
    throw new Error('Token inválido');
  }
};

// Función para extraer el token del header Authorization
export const extractTokenFromHeader = (authHeader) => {
  // Verificar que el header existe y tiene el formato correcto "Bearer <token>"
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('Formato de autorización inválido');
  }
  // Extraer solo la parte del token (remover "Bearer ")
  return authHeader.substring(7);
};

// Función para decodificar token sin verificar (útil para debugging)
export const decodeToken = (token) => {
  try {
    // Decodificar el token sin verificar la firma
    return jwt.decode(token);
  } catch (error) {
    // Si hay error en la decodificación, lanzar error personalizado
    throw new Error('Token no válido para decodificación');
  }
}; 