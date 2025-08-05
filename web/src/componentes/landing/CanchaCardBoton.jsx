import React from 'react';
import { Link } from 'react-router-dom';

export default function CanchaCardBoton() {
  return (
    <Link to="/login">
      <button
        className="fw-semibold px-4 py-2"
        style={{
          borderRadius: 20,
          background: 'var(--color-primary)',
          color: 'var(--color-white)',
          border: 'none',
          boxShadow: '0 2px 8px 0 rgba(37,99,235,0.10)',
          transition: 'background 0.2s, box-shadow 0.2s',
        }}
        onMouseOver={e => { e.currentTarget.style.background = 'var(--color-primary-hover)'; }}
        onMouseOut={e => { e.currentTarget.style.background = 'var(--color-primary)'; }}
      >
        <i className="bi bi-calendar-check me-2"></i> Reservar
      </button>
    </Link>
  );
} 