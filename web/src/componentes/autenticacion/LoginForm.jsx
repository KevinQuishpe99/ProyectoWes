// Importación de React y hooks necesarios
import React, { useState } from 'react';
// Importación de hooks de Redux para gestión de estado
import { useDispatch, useSelector } from 'react-redux';
// Importación de acciones de autenticación desde el slice
import { login, clearError } from '../../servicios/auth/authSlice';
// Importación de hooks de navegación de React Router
import { useNavigate, useLocation } from 'react-router-dom';
// Importación de componentes de animación de Framer Motion
import { motion, AnimatePresence } from 'framer-motion';

// Componente de formulario de inicio de sesión
export default function LoginForm() {
  // Hook para despachar acciones de Redux
  const dispatch = useDispatch();
  // Hook para navegación programática
  const navigate = useNavigate();
  // Hook para obtener información de la ubicación actual
  const location = useLocation();
  // Hook para obtener el estado de autenticación desde Redux
  const { loading, error, user, isAuthenticated } = useSelector((state) => state.auth);
  // Estado local para las credenciales del formulario
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  // Estado local para mostrar/ocultar la contraseña
  const [showPassword, setShowPassword] = useState(false);

  // Efecto para redirigir automáticamente si ya está autenticado
  React.useEffect(() => {
    if (isAuthenticated && user) {
      // Redirigir según el rol del usuario
      if (user.rol === 'admin') {
        navigate('/admin', { replace: true });
      } else if (user.rol === 'organizador') {
        navigate('/organizador', { replace: true });
      } else {
        navigate('/usuario', { replace: true });
      }
    }
  }, [isAuthenticated, user, navigate]);

  // Efecto para limpiar errores cuando el componente se monta
  React.useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  // Función para manejar cambios en los campos del formulario
  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  // Función para manejar el envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    // Despachar la acción de login con las credenciales
    dispatch(login(credentials));
  };

  // Renderizar el formulario de login
  return (
    // Contenedor principal con Bootstrap para centrar el formulario
    <div className="container d-flex align-items-center justify-content-center min-vh-100 bg-light">
      {/* Tarjeta del formulario con animación de entrada */}
      <motion.div
        className="card shadow p-4 position-relative"
        style={{ maxWidth: 400, width: '100%' }}
        initial={{ opacity: 0, scale: 0.9, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, type: 'spring' }}
      >
        {/* Botón X para cerrar y volver a la página principal */}
        <button
          type="button"
          className="btn-close position-absolute"
          style={{ top: 12, right: 12, zIndex: 10, backgroundColor: 'white', borderRadius: '50%', padding: '8px' }}
          onClick={() => navigate('/')}
          aria-label="Cerrar"
        ></button>
        
        {/* Encabezado del formulario */}
        <div className="text-center mb-4">
          {/* Ícono del sistema */}
          <div className="mb-3">
            <span className="display-4 text-primary"><i className="bi bi-building"></i></span>
          </div>
          {/* Título del formulario */}
          <h2 className="h3 mb-2">Iniciar Sesión</h2>
          {/* Descripción del formulario */}
          <p className="text-muted">Accede al sistema de gestión de canchas EPN</p>
        </div>
        
        {/* Formulario de login */}
        <form onSubmit={handleSubmit} autoComplete="off">
          {/* Campo de correo electrónico */}
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Correo Electrónico</label>
            <div className="input-group">
              {/* Ícono del campo de email */}
              <span className="input-group-text"><i className="bi bi-envelope"></i></span>
              {/* Input del email */}
              <input
                id="email"
                name="email"
                type="email"
                className="form-control"
                placeholder="correo@epn.edu.ec"
                value={credentials.email}
                onChange={handleChange}
                required
                autoFocus
              />
            </div>
          </div>
          
          {/* Campo de contraseña */}
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Contraseña</label>
            <div className="input-group">
              {/* Ícono del campo de contraseña */}
              <span className="input-group-text"><i className="bi bi-lock"></i></span>
              {/* Input de la contraseña */}
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                className="form-control"
                placeholder="Contraseña"
                value={credentials.password}
                onChange={handleChange}
                required
              />
              {/* Botón para mostrar/ocultar contraseña */}
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
              </button>
            </div>
          </div>
          
          {/* Mostrar mensaje de error si existe */}
          {error && (
            <div className="alert alert-danger" role="alert">
              <i className="bi bi-exclamation-triangle me-2"></i>
              {error}
            </div>
          )}
          
          {/* Botón de envío del formulario */}
          <button
            type="submit"
            className="btn btn-primary w-100 mb-3"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Iniciando sesión...
              </>
            ) : (
              <>
                <i className="bi bi-box-arrow-in-right me-2"></i>
                Iniciar Sesión
              </>
            )}
          </button>
          
          {/* Enlace para ir al formulario de registro */}
          <div className="text-center">
            <p className="mb-0">
              ¿No tienes cuenta?{' '}
              <button
                type="button"
                className="btn btn-link p-0"
                onClick={() => navigate('/register')}
              >
                Regístrate aquí
              </button>
            </p>
          </div>
        </form>
      </motion.div>
    </div>
  );
} 
