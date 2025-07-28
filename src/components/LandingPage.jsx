import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';
import Tilt from 'react-parallax-tilt';

const features = [
  {
    icon: 'calendar-event', color: 'info', title: 'Reservas Inteligentes', desc: 'Sistema de reservas por hora con calendario interactivo'
  },
  {
    icon: 'people', color: 'success', title: 'Gestión de Usuarios', desc: 'Control de acceso para estudiantes y administradores'
  },
  {
    icon: 'bar-chart', color: 'warning', title: 'Reportes Avanzados', desc: 'Análisis y feedback detallado de uso'
  },
  {
    icon: 'gear', color: 'secondary', title: 'Administración Profesional', desc: 'Gestión eficiente de espacios deportivos'
  }
];

const stats = [
  { icon: 'trophy', color: 'primary', number: '15+', label: 'Canchas' },
  { icon: 'calendar-event', color: 'info', number: '247', label: 'Disponibilidad' },
  { icon: 'star', color: 'warning', number: '4.8', label: 'Rating' }
];

export default function LandingPage() {
  // Configuración de partículas
  const particlesInit = async (main) => {
    await loadFull(main);
  };

  return (
    <div className="position-relative min-vh-100 bg-light overflow-hidden">
      {/* Fondo de partículas */}
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={{
          fullScreen: { enable: false },
          background: { color: 'transparent' },
          fpsLimit: 60,
          particles: {
            number: { value: 60, density: { enable: true, value_area: 800 } },
            color: { value: ['#0d6efd', '#6610f2', '#20c997', '#ffc107'] },
            shape: { type: 'circle' },
            opacity: { value: 0.2 },
            size: { value: 3, random: true },
            move: { enable: true, speed: 1, direction: 'none', outModes: 'out' },
            links: { enable: true, color: '#0d6efd', opacity: 0.1, distance: 120 }
          },
          detectRetina: true
        }}
        style={{ position: 'absolute', inset: 0, zIndex: 0 }}
      />
      <div className="container-fluid min-vh-100 d-flex flex-column justify-content-center align-items-center position-relative" style={{ zIndex: 1 }}>
        <motion.div
          className="text-center mb-5"
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, type: 'spring' }}
        >
          <div className="mb-3">
            <motion.span
              className="display-1 text-primary d-inline-block"
              initial={{ scale: 0, rotate: -30 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 120 }}
              style={{ filter: 'drop-shadow(0 0 16px #0d6efd88)' }}
            >
              <i className="bi bi-building"></i>
            </motion.span>
          </div>
          <motion.h1
            className="display-4 fw-bold mb-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            EPN
          </motion.h1>
          <motion.h2
            className="h4 fw-semibold mb-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            Sistema de Gestión de Canchas
          </motion.h2>
          <motion.p
            className="lead text-muted mb-0"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            Reserva, administra y consulta la disponibilidad de los espacios deportivos de la EPN
          </motion.p>
        </motion.div>
        <div className="row justify-content-center mb-5 w-100" style={{ maxWidth: 900 }}>
          {features.map((feature, i) => (
            <motion.div
              className="col-12 col-md-6 col-lg-3 mb-4"
              key={feature.title}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 + i * 0.15, duration: 0.5, type: 'spring' }}
            >
              <Tilt
                glareEnable={true}
                glareMaxOpacity={0.15}
                tiltMaxAngleX={12}
                tiltMaxAngleY={12}
                scale={1.04}
                transitionSpeed={1200}
                className="h-100"
              >
                <motion.div
                  className="card h-100 shadow-sm text-center border-0"
                  whileHover={{ scale: 1.04, boxShadow: '0 8px 32px #0d6efd33' }}
                  transition={{ type: 'spring', stiffness: 200 }}
                  style={{ borderRadius: 18 }}
                >
                  <motion.span
                    className={`display-6 text-${feature.color} d-inline-block`}
                    whileHover={{ scale: 1.2, color: '#0d6efd' }}
                    transition={{ type: 'spring', stiffness: 300 }}
                    style={{ filter: 'drop-shadow(0 0 8px #0d6efd44)' }}
                  >
                    <i className={`bi bi-${feature.icon}`}></i>
                  </motion.span>
                  <h5 className="card-title mt-3">{feature.title}</h5>
                  <p className="card-text">{feature.desc}</p>
                </motion.div>
              </Tilt>
            </motion.div>
          ))}
        </div>
        <div className="row justify-content-center mb-5 w-100" style={{ maxWidth: 900 }}>
          {stats.map((stat, i) => (
            <motion.div
              className="col-6 col-md-3 mb-3"
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.4 + i * 0.12, duration: 0.5, type: 'spring' }}
            >
              <Tilt
                glareEnable={true}
                glareMaxOpacity={0.10}
                tiltMaxAngleX={10}
                tiltMaxAngleY={10}
                scale={1.03}
                transitionSpeed={1000}
                className="h-100"
              >
                <motion.div
                  className="card text-center border-0 bg-transparent"
                  whileHover={{ scale: 1.07, boxShadow: '0 8px 32px #ffc10733' }}
                  transition={{ type: 'spring', stiffness: 200 }}
                  style={{ borderRadius: 16 }}
                >
                  <motion.span
                    className={`h2 text-${stat.color} d-inline-block`}
                    whileHover={{ scale: 1.18, color: '#ffc107' }}
                    transition={{ type: 'spring', stiffness: 300 }}
                    style={{ filter: 'drop-shadow(0 0 8px #ffc10744)' }}
                  >
                    <i className={`bi bi-${stat.icon}`}></i>
                  </motion.span>
                  <div className="fw-bold fs-3">{stat.number}</div>
                  <div className="text-muted">{stat.label}</div>
                </motion.div>
              </Tilt>
            </motion.div>
          ))}
        </div>
        <motion.div
          className="text-center mb-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2, duration: 0.5, type: 'spring' }}
        >
          <Link to="/login">
            <motion.button
              className="btn btn-lg px-5 py-2 border-0 text-white fw-bold shadow-lg"
              style={{
                background: 'linear-gradient(90deg, #0d6efd 0%, #6610f2 100%)',
                boxShadow: '0 0 24px 4px #0d6efd55, 0 2px 8px #6610f244',
                borderRadius: 32,
                letterSpacing: 1
              }}
              whileHover={{ scale: 1.07, boxShadow: '0 0 48px 8px #6610f2aa' }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <i className="bi bi-box-arrow-in-right me-2"></i> Iniciar Sesión
            </motion.button>
          </Link>
        </motion.div>
        <footer className="text-center mt-auto mb-2">
          <motion.div
            className="d-flex justify-content-center align-items-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.3, duration: 0.7 }}
          >
            <motion.span
              className="text-danger"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
            >
              <i className="bi bi-heart-fill"></i>
            </motion.span>
            <span className="small">Desarrollado con pasión para la EPN</span>
            <motion.span
              className="text-warning"
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut', delay: 1 }}
            >
              <i className="bi bi-lightning-fill"></i>
            </motion.span>
          </motion.div>
        </footer>
      </div>
    </div>
  );
} 