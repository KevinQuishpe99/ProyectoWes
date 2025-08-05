import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { verifyToken } from './servicios/auth/authSlice';
import Home from './pages/Home';
import AdminPanel from './pages/AdminPanel';
import LoginForm from './componentes/autenticacion/LoginForm';
import RegisterForm from './componentes/autenticacion/RegisterForm';
import ProtectedRoute from './componentes/autenticacion/ProtectedRoute';
import OrganizadorPanel from './pages/OrganizadorPanel';
import UsuarioPanel from './pages/UsuarioPanel';

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);

  // Verificar token solo si hay un token en localStorage
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && !isAuthenticated) {
      dispatch(verifyToken());
    }
  }, [dispatch, isAuthenticated]);

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/admin" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminPanel />
          </ProtectedRoute>
        } />
        <Route path="/organizador" element={
          <ProtectedRoute allowedRoles={['organizador']}>
            <OrganizadorPanel />
          </ProtectedRoute>
        } />
        <Route path="/usuario" element={
          <ProtectedRoute allowedRoles={['usuario']}>
            <UsuarioPanel />
          </ProtectedRoute>
        } />
      </Routes>
    </>
  );
}

export default App; 
