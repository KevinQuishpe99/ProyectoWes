import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';

export default function ProtectedRoute({ children, allowedRoles }) {
  const user = useSelector((state) => state.auth.user);
  const location = useLocation();

  if (!user) return <Navigate to="/login" replace state={{ from: location }} />;

  if (allowedRoles && !allowedRoles.includes(user.rol)) {
    if (user.rol === 'admin') return <Navigate to="/admin" replace />;
    if (user.rol === 'estudiante') return <Navigate to="/login" replace />;
    return <Navigate to="/login" replace />;
  }

  return children;
} 
