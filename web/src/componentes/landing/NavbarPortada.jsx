import React from 'react';
import { Link } from 'react-router-dom';

export default function NavbarPortada({ scrollToSection, refs }) {
  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      zIndex: 200,
      background: 'rgba(255,255,255,0.85)',
      boxShadow: '0 2px 12px 0 rgba(37,99,235,0.07)',
      backdropFilter: 'blur(6px)',
      borderBottom: '1.5px solid var(--color-primary-light)',
    }}>
      <div className="container d-flex align-items-center justify-content-between py-2">
        <img src="/epn_logo.png" alt="Logo EPN" style={{ height: 38, width: 'auto', marginRight: 8, objectFit: 'contain', display: 'block' }} />
        <div className="d-flex gap-2">
          <button
            className="btn btn-link fw-semibold text-primary px-3"
            style={{ fontSize: 16, textDecoration: 'none' }}
            onClick={() => scrollToSection(refs.comoReservarRef)}
          >
            Cómo Reservar
          </button>
          <Link to="/login">
            <button
              className="btn fw-bold px-3 py-1"
              style={{
                borderRadius: 20,
                background: 'var(--color-primary)',
                color: 'var(--color-white)',
                border: 'none',
                boxShadow: '0 2px 8px 0 rgba(37,99,235,0.10)',
                transition: 'background 0.2s',
              }}
              onMouseOver={e => { e.currentTarget.style.background = 'var(--color-primary-hover)'; }}
              onMouseOut={e => { e.currentTarget.style.background = 'var(--color-primary)'; }}
            >
              Iniciar sesión
            </button>
          </Link>
        </div>
      </div>
    </nav>
  );
} 