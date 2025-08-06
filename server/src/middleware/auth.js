// Importación de funciones JWT para verificación y extracción de tokens
import { verifyToken, extractTokenFromHeader } from '../config/jwt.js';
// Importación del modelo Usuario para consultas a la base de datos
import Usuario from '../models/usuario.js';
// Importación del modelo Rol para incluir información del rol
import Rol from '../models/rol.js';

// Middleware principal de protección de rutas (siguiendo el patrón estándar)
export const protect = async (req, res, next) => {
  // Variable para almacenar el token extraído
  let token;

  // Logs para debugging del middleware
  console.log('🔍 protect middleware - URL:', req.url);
  console.log('🔍 protect middleware - Headers:', req.headers.authorization ? 'Bearer token presente' : 'No hay token');

  // Verificar si existe el header de autorización con formato Bearer
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Obtener el token del header de autorización
      token = req.headers.authorization;
      token = token.split(' ')[1]; // Remover "Bearer " del token

      // Verificar y decodificar el token JWT
      const decoded = verifyToken(token);
      console.log('🔍 Token decodificado:', decoded);

      // Buscar el usuario en la base de datos sin incluir la contraseña
      const user = await Usuario.findByPk(decoded.id, {
        attributes: { exclude: ['contrasena'] }, // Excluir contraseña por seguridad
        include: [{ model: Rol, as: 'rol' }] // Incluir información del rol
      });

      // Verificar si el usuario existe en la base de datos
      if (!user) {
        console.log('❌ Usuario no encontrado en la base de datos');
        return res.status(401).json({ message: 'Not authorized!' });
      }

      // Log de usuario encontrado para debugging
      console.log('✅ Usuario encontrado:', {
        id: user.id,
        nombres: user.nombres,
        rol: user.rol?.nombre || user.rol
      });

      // Agregar información del usuario al objeto request para uso posterior
      req.user = user;
      // Continuar con el siguiente middleware o controlador
      next();
    } catch (error) {
      // Manejar errores de autenticación (token inválido, expirado, etc.)
      console.error('❌ Error de autenticación:', error);
      return res.status(401).json({ message: 'Not authorized!' });
    }
  } else {
    // Si no hay header de autorización o formato incorrecto
    console.log('❌ No hay token de autorización');
    return res.status(401).json({ message: 'Not authorized, missed token!' });
  }
};

// Middleware para verificar autenticación (versión simplificada sin consulta a BD)
export const authenticateToken = (req, res, next) => {
  try {
    // Obtener el header de autorización
    const authHeader = req.headers.authorization;
    
    // Verificar si existe el header de autorización
    if (!authHeader) {
      return res.status(401).json({ 
        message: 'Token de acceso requerido',
        error: 'MISSING_TOKEN'
      });
    }

    // Extraer el token del header
    const token = extractTokenFromHeader(authHeader);
    // Verificar y decodificar el token
    const decoded = verifyToken(token);
    
    // Agregar información del usuario decodificada al request
    req.user = decoded;
    // Continuar con el siguiente middleware o controlador
    next();
  } catch (error) {
    // Log del error para debugging
    console.error('Error de autenticación:', error.message);
    
    // Manejar diferentes tipos de errores de autenticación
    if (error.message === 'Token inválido') {
      return res.status(401).json({ 
        message: 'Token inválido o expirado',
        error: 'INVALID_TOKEN'
      });
    }
    
    if (error.message === 'Formato de autorización inválido') {
      return res.status(401).json({ 
        message: 'Formato de autorización inválido. Use: Bearer <token>',
        error: 'INVALID_AUTH_FORMAT'
      });
    }
    
    // Error interno del servidor para otros casos
    return res.status(500).json({ 
      message: 'Error interno del servidor',
      error: 'INTERNAL_ERROR'
    });
  }
};

// Middleware para verificar roles específicos (función factory)
export const authorizeRoles = (...allowedRoles) => {
  // Retornar una función middleware que verifica los roles permitidos
  return (req, res, next) => {
    // Verificar si el usuario está autenticado
    if (!req.user) {
      return res.status(401).json({ 
        message: 'Usuario no autenticado',
        error: 'UNAUTHORIZED'
      });
    }

    // Obtener el rol del usuario (puede venir de diferentes fuentes)
    const userRole = req.user.rol?.nombre || req.user.rol || req.user.rol_id;
    console.log('🔍 Verificando rol:', { userRole, allowedRoles });

    // Verificar si el rol del usuario está en la lista de roles permitidos
    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({ 
        message: 'Acceso denegado. Rol insuficiente.',
        error: 'INSUFFICIENT_PERMISSIONS',
        requiredRoles: allowedRoles,
        userRole: userRole
      });
    }

    // Si el rol es válido, continuar
    next();
  };
};

// Middleware específico para requerir rol de administrador
export const requireAdmin = (req, res, next) => {
  // Verificar si el usuario está autenticado
  if (!req.user) {
    return res.status(401).json({ 
      message: 'Usuario no autenticado',
      error: 'UNAUTHORIZED'
    });
  }

  // Obtener el rol del usuario
  const userRole = req.user.rol?.nombre || req.user.rol || req.user.rol_id;
  console.log('🔍 Verificando rol de admin:', userRole);

  // Verificar si el usuario es administrador
  if (userRole !== 'admin' && userRole !== 1) {
    return res.status(403).json({ 
      message: 'Acceso denegado. Se requiere rol de administrador.',
      error: 'ADMIN_REQUIRED'
    });
  }

  // Si es administrador, continuar
  next();
};

// Middleware específico para requerir rol de organizador
export const requireOrganizador = (req, res, next) => {
  // Verificar si el usuario está autenticado
  if (!req.user) {
    return res.status(401).json({ 
      message: 'Usuario no autenticado',
      error: 'UNAUTHORIZED'
    });
  }

  // Obtener el rol del usuario
  const userRole = req.user.rol?.nombre || req.user.rol || req.user.rol_id;
  console.log('🔍 Verificando rol de organizador:', userRole);

  // Verificar si el usuario es organizador o administrador
  if (userRole !== 'organizador' && userRole !== 'admin' && userRole !== 2 && userRole !== 1) {
    return res.status(403).json({ 
      message: 'Acceso denegado. Se requiere rol de organizador o administrador.',
      error: 'ORGANIZER_REQUIRED'
    });
  }

  // Si tiene permisos, continuar
  next();
};

// Middleware para verificar propiedad de recursos (usuario solo puede acceder a sus propios datos)
export const requireOwnership = (req, res, next) => {
  // Verificar si el usuario está autenticado
  if (!req.user) {
    return res.status(401).json({ 
      message: 'Usuario no autenticado',
      error: 'UNAUTHORIZED'
    });
  }

  // Obtener el ID del usuario autenticado
  const userId = req.user.id;
  // Obtener el ID del recurso desde los parámetros de la URL
  const resourceId = req.params.id || req.params.userId;

  console.log('🔍 Verificando propiedad:', { userId, resourceId });

  // Si no hay ID de recurso, continuar (puede ser una operación de listado)
  if (!resourceId) {
    return next();
  }

  // Verificar si el usuario es administrador (puede acceder a todo)
  const userRole = req.user.rol?.nombre || req.user.rol || req.user.rol_id;
  if (userRole === 'admin' || userRole === 1) {
    console.log('✅ Admin puede acceder a cualquier recurso');
    return next();
  }

  // Verificar si el usuario es organizador (puede acceder a recursos de usuarios)
  if (userRole === 'organizador' || userRole === 2) {
    console.log('✅ Organizador puede acceder a recursos de usuarios');
    return next();
  }

  // Para usuarios normales, verificar que el recurso les pertenece
  if (parseInt(userId) !== parseInt(resourceId)) {
    return res.status(403).json({ 
      message: 'Acceso denegado. Solo puedes acceder a tus propios datos.',
      error: 'OWNERSHIP_REQUIRED'
    });
  }

  // Si el recurso pertenece al usuario, continuar
  next();
};

// Middleware específico para verificar propiedad de reservas
export const requireReservaOwnership = (req, res, next) => {
  // Verificar si el usuario está autenticado
  if (!req.user) {
    return res.status(401).json({ 
      message: 'Usuario no autenticado',
      error: 'UNAUTHORIZED'
    });
  }

  // Obtener el ID del usuario autenticado
  const userId = req.user.id;
  // Obtener el ID de la reserva desde los parámetros de la URL
  const reservaId = req.params.id || req.params.reservaId;

  console.log('🔍 Verificando propiedad de reserva:', { userId, reservaId });

  // Si no hay ID de reserva, continuar
  if (!reservaId) {
    return next();
  }

  // Verificar si el usuario es administrador o organizador (pueden acceder a todas las reservas)
  const userRole = req.user.rol?.nombre || req.user.rol || req.user.rol_id;
  if (userRole === 'admin' || userRole === 'organizador' || userRole === 1 || userRole === 2) {
    console.log('✅ Admin/Organizador puede acceder a cualquier reserva');
    return next();
  }

  // Para usuarios normales, verificar que la reserva les pertenece
  // Esto se debe verificar en el controlador consultando la base de datos
  // Por ahora, solo verificamos que el usuario esté autenticado
  console.log('✅ Usuario autenticado, verificación de propiedad en controlador');
  next();
};

// Middleware específico para verificar permisos de eliminación de reservas
export const requireReservaDelete = (req, res, next) => {
  // Verificar si el usuario está autenticado
  if (!req.user) {
    return res.status(401).json({ 
      message: 'Usuario no autenticado',
      error: 'UNAUTHORIZED'
    });
  }

  // Obtener el rol del usuario
  const userRole = req.user.rol?.nombre || req.user.rol || req.user.rol_id;
  console.log('🔍 Verificando permisos de eliminación de reserva:', userRole);

  // Solo administradores pueden eliminar reservas
  if (userRole !== 'admin' && userRole !== 1) {
    return res.status(403).json({ 
      message: 'Acceso denegado. Solo los administradores pueden eliminar reservas.',
      error: 'DELETE_PERMISSION_DENIED'
    });
  }

  // Si es administrador, continuar
  next();
};