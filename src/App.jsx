import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import AdminPanel from './pages/AdminPanel';
import LoginForm from './componentes/autenticacion/LoginForm';
import ProtectedRoute from './componentes/autenticacion/ProtectedRoute';
import OrganizadorPanel from './pages/OrganizadorPanel';
import UsuarioPanel from './pages/UsuarioPanel';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginForm />} />
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
          <ProtectedRoute allowedRoles={['estudiante']}>
            <UsuarioPanel />
          </ProtectedRoute>
        } />
      </Routes>
    </>
  );
}

export default App; 
