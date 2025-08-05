import { verifyToken, extractTokenFromHeader } from '../config/jwt.js';
import Usuario from '../models/usuario.js';
import Rol from '../models/rol.js';

// Middleware protect (siguiendo el patrón de la imagen)
export const protect = async (req, res, next) => {
  let token;

  console.log('🔍 protect middleware - URL:', req.url);
  console.log('🔍 protect middleware - Headers:', req.headers.authorization ? 'Bearer token presente' : 'No hay token');

  // Verificar si existe el header de autorización
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Obtener el token del header
      token = req.headers.authorization;
      token = token.split(' ')[1]; // Remover "Bearer "

      // Verificar el token
      const decoded = verifyToken(token);
      console.log('🔍 Token decodificado:', decoded);

      // Obtener el usuario sin la contraseña
      const user = await Usuario.findByPk(decoded.id, {
        attributes: { exclude: ['contrasena'] },
        include: [{ model: Rol, as: 'rol' }]
      });

      if (!user) {
        console.log('❌ Usuario no encontrado en la base de datos');
        return res.status(401).json({ message: 'Not authorized!' });
      }

      console.log('✅ Usuario encontrado:', {
        id: user.id,
        nombres: user.nombres,
        rol: user.rol?.nombre || user.rol
      });

      // Agregar información del usuario al request
      req.user = user;
      next();
    } catch (error) {
      console.error('❌ Error de autenticación:', error);
      return res.status(401).json({ message: 'Not authorized!' });
    }
  } else {
    console.log('❌ No hay token de autorización');
    return res.status(401).json({ message: 'Not authorized, missed token!' });
  }
};

// Middleware para verificar autenticación (versión simplificada)
export const authenticateToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({ 
        message: 'Token de acceso requerido',
        error: 'MISSING_TOKEN'
      });
    }

    const token = extractTokenFromHeader(authHeader);
    const decoded = verifyToken(token);
    
    // Agregar información del usuario al request
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Error de autenticación:', error.message);
    
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
    
    return res.status(500).json({ 
      message: 'Error interno del servidor',
      error: 'INTERNAL_ERROR'
    });
  }
};

// Middleware para verificar roles específicos
export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        message: 'Usuario no autenticado',
        error: 'NOT_AUTHENTICATED'
      });
    }

    if (!allowedRoles.includes(req.user.rol)) {
      return res.status(403).json({ 
        message: 'No tienes permisos para acceder a este recurso',
        error: 'INSUFFICIENT_PERMISSIONS',
        requiredRoles: allowedRoles,
        userRole: req.user.rol
      });
    }

    next();
  };
};

// Middleware específico para admin
export const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ 
      message: 'Usuario no autenticado',
      error: 'NOT_AUTHENTICATED'
    });
  }

  // Verificar si el usuario es admin (usando la estructura de la base de datos)
  const userRole = req.user.rol?.nombre || req.user.rol;
  
  if (userRole !== 'admin') {
    return res.status(403).json({ 
      message: 'No tienes permisos para acceder a este recurso',
      error: 'INSUFFICIENT_PERMISSIONS',
      requiredRoles: ['admin'],
      userRole: userRole
    });
  }

  next();
};

// Middleware específico para organizador
export const requireOrganizador = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ 
      message: 'Usuario no autenticado',
      error: 'NOT_AUTHENTICATED'
    });
  }

  // Verificar si el usuario es admin u organizador
  const userRole = req.user.rol?.nombre || req.user.rol;
  
  if (userRole !== 'admin' && userRole !== 'organizador') {
    return res.status(403).json({ 
      message: 'No tienes permisos para acceder a este recurso',
      error: 'INSUFFICIENT_PERMISSIONS',
      requiredRoles: ['admin', 'organizador'],
      userRole: userRole
    });
  }

  next();
};

// Middleware específico para estudiante
export const requireEstudiante = authorizeRoles('estudiante');

// Middleware para verificar que el usuario accede a sus propios recursos
export const requireOwnership = (req, res, next) => {
  const userId = parseInt(req.params.userId || req.params.id);
  const userRole = req.user.rol?.nombre || req.user.rol;
  
  console.log('🔍 requireOwnership Debug:', {
    reqUserId: req.user.id,
    reqUserIdType: typeof req.user.id,
    reqUserRole: userRole,
    paramUserId: userId,
    paramUserIdType: typeof userId,
    params: req.params
  });
  
  // Si el usuario es admin u organizador, puede acceder a cualquier recurso
  if (userRole === 'admin' || userRole === 'organizador') {
    console.log('✅ Admin/Organizador - acceso permitido');
    return next();
  }
  
  // Si el usuario es "usuario" (rol normal), solo puede acceder a sus propios recursos
  if (userRole === 'usuario') {
    // Convertir ambos IDs a números para comparación correcta
    const reqUserIdNum = parseInt(req.user.id);
    const userIdNum = parseInt(userId);
    
    console.log('🔍 Comparando IDs para usuario:', {
      reqUserIdNum: reqUserIdNum,
      userIdNum: userIdNum,
      sonIguales: reqUserIdNum === userIdNum
    });
    
    if (reqUserIdNum !== userIdNum) {
      console.log('❌ Usuario no autorizado - IDs no coinciden');
      return res.status(403).json({ 
        message: 'Solo puedes acceder a tus propios recursos',
        error: 'OWNERSHIP_REQUIRED'
      });
    }
    console.log('✅ Usuario autorizado - acceso permitido');
    return next();
  }
  
  // Para cualquier otro rol, denegar acceso
  console.log('❌ Rol no reconocido:', userRole);
  return res.status(403).json({ 
    message: 'Rol no reconocido',
    error: 'UNKNOWN_ROLE'
  });
};

// Middleware para reservas - Admin puede editar cualquier reserva, Organizador puede editar pero no eliminar
export const requireReservaOwnership = (req, res, next) => {
  const userRole = req.user.rol?.nombre || req.user.rol;
  
  console.log('🔍 requireReservaOwnership Debug:', {
    reqUserId: req.user.id,
    reqUserRole: userRole,
    reservaId: req.params.id,
    params: req.params
  });
  
  if (userRole === 'admin') {
    // Admin puede editar cualquier reserva
    console.log('✅ Admin - acceso permitido');
    return next();
  }
  
  if (userRole === 'organizador') {
    // Organizador puede editar cualquier reserva (pero no eliminar)
    console.log('✅ Organizador - acceso permitido');
    return next();
  }
  
  // Para usuarios normales (rol "usuario"), necesitamos verificar que la reserva pertenece al usuario
  // Esto se hará en el controlador, aquí solo permitimos el acceso
  if (userRole === 'usuario') {
    console.log('✅ Usuario - acceso permitido (verificación en controlador)');
    return next();
  }
  
  // Para cualquier otro rol, denegar acceso
  console.log('❌ Rol no reconocido:', userRole);
  return res.status(403).json({ 
    message: 'Rol no reconocido',
    error: 'UNKNOWN_ROLE'
  });
};

// Middleware para eliminar reservas - Solo admin puede eliminar
export const requireReservaDelete = (req, res, next) => {
  const userRole = req.user.rol?.nombre || req.user.rol;
  
  if (userRole === 'admin') {
    // Solo admin puede eliminar reservas
    return next();
  }
  
  return res.status(403).json({ 
    message: 'Solo los administradores pueden eliminar reservas',
    error: 'DELETE_NOT_ALLOWED'
  });
};