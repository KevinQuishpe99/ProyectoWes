import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const location = useLocation();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // El admin tiene acceso a todo
  if (user.rol === 'admin') {
    return children;
  }

  // Para otros roles, verificar permisos específicos
  if (allowedRoles && !allowedRoles.includes(user.rol)) {
    if (user.rol === 'organizador') return <Navigate to="/organizador" replace />;
    if (user.rol === 'usuario') return <Navigate to="/usuario" replace />;
    return <Navigate to="/login" replace />;
  }

  return children;
} 
