import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

// Configuración JWT desde variables de entorno
const JWT_SECRET = process.env.JWT_SECRET || 'epn_canchas_super_secret_key_2024';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

// Función para generar token
export const generateToken = (user) => {
  const payload = {
    id: user.id,
    email: user.correo,
    nombres: user.nombres,
    rol: user.rol,
    rol_id: user.rol_id,
    codigo: user.codigo
  };

  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

// Función para generar refresh token
export const generateRefreshToken = (user) => {
  const payload = {
    id: user.id,
    type: 'refresh'
  };

  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_REFRESH_EXPIRES_IN });
};

// Función para verificar token
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error('Token inválido');
  }
};

// Función para extraer token del header Authorization
export const extractTokenFromHeader = (authHeader) => {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('Formato de autorización inválido');
  }
  return authHeader.substring(7); // Remover "Bearer "
};

// Función para decodificar token sin verificar (para debugging)
export const decodeToken = (token) => {
  try {
    return jwt.decode(token);
  } catch (error) {
    throw new Error('Token no válido para decodificación');
  }
}; 