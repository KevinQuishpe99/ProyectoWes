// Importación de React para crear componentes
import React from 'react';
// Importación de useSelector para acceder al estado de Redux
import { useSelector } from 'react-redux';
// Importación de componentes de navegación de React Router
import { Navigate, useLocation } from 'react-router-dom';

// Componente para proteger rutas que requieren autenticación y roles específicos
export default function ProtectedRoute({ children, allowedRoles }) {
  // Obtener el estado de autenticación y datos del usuario desde Redux
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  // Obtener información de la ubicación actual para redirección
  const location = useLocation();

  // Verificar si el usuario está autenticado y tiene datos
  if (!isAuthenticated || !user) {
    // Redirigir al login si no está autenticado, guardando la ubicación actual
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // El admin tiene acceso a todas las rutas del sistema
  if (user.rol === 'admin') {
    return children;
  }

  // Para otros roles, verificar permisos específicos según la ruta
  if (allowedRoles && !allowedRoles.includes(user.rol)) {
    // Redirigir según el rol del usuario si no tiene permisos para esta ruta
    if (user.rol === 'organizador') return <Navigate to="/organizador" replace />;
    if (user.rol === 'usuario') return <Navigate to="/usuario" replace />;
    // Redirigir al login como fallback
    return <Navigate to="/login" replace />;
  }

  // Si pasa todas las validaciones, renderizar el contenido protegido
  return children;
} 
