import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function AnimatedNavbar() {
  const location = useLocation();
  const isLanding = location.pathname === '/';
  return (
    <motion.nav
      className="navbar navbar-expand-lg navbar-dark bg-primary shadow mb-4"
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 80 }}
    >
      <div className="container-fluid">
        <Link className="navbar-brand fw-bold" to="/">
          Canchas EPN
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className={`nav-link${location.pathname === '/' ? ' active' : ''}`} to="/">
                Inicio
              </Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link${location.pathname === '/login' ? ' active' : ''}`} to="/login">
                Iniciar Sesión
              </Link>
            </li>
            {!isLanding && (
              <>
                <li className="nav-item">
                  <Link className={`nav-link${location.pathname === '/admin' ? ' active' : ''}`} to="/admin">
                    Panel Admin
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </motion.nav>
  );
} 