import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { register, clearError } from '../../servicios/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export default function RegisterForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, user, isAuthenticated } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    userName: '',
    email: '',
    password: '',
    codigo: '',
    rol_id: 3 // Por defecto usuario
  });
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
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(register(formData));
  };

  return (
    <div className="container d-flex align-items-center justify-content-center min-vh-100 bg-light">
      <motion.div
        className="card shadow p-4 position-relative"
        style={{ maxWidth: 500, width: '100%' }}
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
            <img 
              src="/epn_logo.png" 
              alt="Logo EPN" 
              style={{ 
                height: '60px', 
                width: 'auto',
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
              }}
            />
          </div>
          <h2 className="h3 mb-2">Registrarse</h2>
          <p className="text-muted">Crea tu cuenta en el sistema de gestión de canchas EPN</p>
        </div>

        <form onSubmit={handleSubmit} autoComplete="off">
          <div className="mb-3">
            <label htmlFor="userName" className="form-label">Nombre Completo</label>
            <div className="input-group">
              <span className="input-group-text"><i className="bi bi-person"></i></span>
              <input
                id="userName"
                name="userName"
                type="text"
                className="form-control"
                placeholder="Tu nombre completo"
                value={formData.userName}
                onChange={handleChange}
                required
                autoFocus
              />
            </div>
          </div>

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
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="mb-3">
            <label htmlFor="codigo" className="form-label">Código</label>
            <div className="input-group">
              <span className="input-group-text"><i className="bi bi-card-text"></i></span>
              <input
                id="codigo"
                name="codigo"
                type="text"
                className="form-control"
                placeholder="Tu código de usuario"
                value={formData.codigo}
                onChange={handleChange}
                required
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
                value={formData.password}
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

          <div className="mb-3">
            <label htmlFor="rol_id" className="form-label">Rol</label>
            <div className="input-group">
              <span className="input-group-text"><i className="bi bi-shield"></i></span>
              <select
                id="rol_id"
                name="rol_id"
                className="form-select"
                value={formData.rol_id}
                onChange={handleChange}
                required
              >
                <option value={3}>Usuario</option>
                <option value={2}>Organizador</option>
                <option value={1}>Administrador</option>
              </select>
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
              Registrarse
            </motion.button>
          </div>

          <div className="text-center mt-3">
            <p className="mb-0">
              ¿Ya tienes cuenta?{' '}
              <button
                type="button"
                className="btn btn-link p-0"
                onClick={() => navigate('/login')}
              >
                Iniciar Sesión
              </button>
            </p>
          </div>
        </form>
      </motion.div>
    </div>
  );
} 