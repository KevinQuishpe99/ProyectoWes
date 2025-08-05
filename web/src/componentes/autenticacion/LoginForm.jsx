import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login, clearError } from '../../servicios/auth/authSlice';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export default function LoginForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { loading, error, user, isAuthenticated } = useSelector((state) => state.auth);
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);

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

  // Limpiar error cuando el componente se monta
  React.useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login(credentials));
  };

  return (
    <div className="container d-flex align-items-center justify-content-center min-vh-100 bg-light">
      <motion.div
        className="card shadow p-4 position-relative"
        style={{ maxWidth: 400, width: '100%' }}
        initial={{ opacity: 0, scale: 0.9, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, type: 'spring' }}
      >
        {/* Botón X para cerrar */}
        <button
          type="button"
          className="btn-close position-absolute"
          style={{ top: 12, right: 12, zIndex: 10, backgroundColor: 'white', borderRadius: '50%', padding: '8px' }}
          onClick={() => navigate('/')}
          aria-label="Cerrar"
        ></button>
        <div className="text-center mb-4">
          <div className="mb-3">
            <span className="display-4 text-primary"><i className="bi bi-building"></i></span>
          </div>
          <h2 className="h3 mb-2">Iniciar Sesión</h2>
          <p className="text-muted">Accede al sistema de gestión de canchas EPN</p>
        </div>
        <form onSubmit={handleSubmit} autoComplete="off">
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Correo Electrónico</label>
            <div className="input-group">
              <span className="input-group-text"><i className="bi bi-envelope"></i></span>
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
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Contraseña</label>
            <div className="input-group">
              <span className="input-group-text"><i className="bi bi-lock"></i></span>
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
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
              </button>
            </div>
          </div>
          <AnimatePresence>
            {error && (
              <motion.div
                className="alert alert-danger py-2"
                role="alert"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>
          <div className="d-grid">
            <motion.button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              {loading ? (
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              ) : null}
              Ingresar
            </motion.button>
          </div>

          <div className="text-center mt-3">
            <p className="mb-0">
              ¿No tienes cuenta?{' '}
              <button
                type="button"
                className="btn btn-link p-0"
                onClick={() => navigate('/register')}
              >
                Registrarse
              </button>
            </p>
          </div>
        </form>
      </motion.div>
    </div>
  );
} 
