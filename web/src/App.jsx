// Importación de React y hooks necesarios
import React, { useEffect } from 'react';
// Importación de componentes de navegación de React Router
import { Routes, Route } from 'react-router-dom';
// Importación de hooks de Redux para acceder al estado y dispatch
import { useDispatch, useSelector } from 'react-redux';
// Importación de la acción para verificar el token de autenticación
import { verifyToken } from './servicios/auth/authSlice';
// Importación de las páginas principales de la aplicación
import Home from './pages/Home';
import AdminPanel from './pages/AdminPanel';
// Importación de componentes de autenticación
import LoginForm from './componentes/autenticacion/LoginForm';
import RegisterForm from './componentes/autenticacion/RegisterForm';
// Importación del componente para rutas protegidas
import ProtectedRoute from './componentes/autenticacion/ProtectedRoute';
// Importación de paneles específicos por rol
import OrganizadorPanel from './pages/OrganizadorPanel';
import UsuarioPanel from './pages/UsuarioPanel';

// Componente principal de la aplicación que maneja el enrutamiento
function App() {
  // Hook para despachar acciones de Redux
  const dispatch = useDispatch();
  // Hook para obtener el estado de autenticación desde Redux
  const { isAuthenticated } = useSelector((state) => state.auth);

  // Efecto que se ejecuta al montar el componente y cuando cambia la autenticación
  useEffect(() => {
    // Verificar token solo si hay un token en localStorage y no está autenticado
    const token = localStorage.getItem('token');
    if (token && !isAuthenticated) {
      // Despachar la acción para verificar el token con el servidor
      dispatch(verifyToken());
    }
  }, [dispatch, isAuthenticated]); // Dependencias del efecto

  // Renderizar la aplicación con las rutas configuradas
  return (
    <>
      {/* Configuración de rutas de la aplicación */}
      <Routes>
        {/* Ruta pública para la página de inicio */}
        <Route path="/" element={<Home />} />
        {/* Ruta pública para el formulario de login */}
        <Route path="/login" element={<LoginForm />} />
        {/* Ruta pública para el formulario de registro */}
        <Route path="/register" element={<RegisterForm />} />
        {/* Ruta protegida para el panel de administrador - solo accesible por admin */}
        <Route path="/admin" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminPanel />
          </ProtectedRoute>
        } />
        {/* Ruta protegida para el panel de organizador - solo accesible por organizador */}
        <Route path="/organizador" element={
          <ProtectedRoute allowedRoles={['organizador']}>
            <OrganizadorPanel />
          </ProtectedRoute>
        } />
        {/* Ruta protegida para el panel de usuario - solo accesible por usuario */}
        <Route path="/usuario" element={
          <ProtectedRoute allowedRoles={['usuario']}>
            <UsuarioPanel />
          </ProtectedRoute>
        } />
      </Routes>
    </>
  );
}

// Exportar el componente App para usarlo en main.jsx
export default App; 
