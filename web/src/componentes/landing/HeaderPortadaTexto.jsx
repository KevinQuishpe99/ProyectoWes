import React from 'react';
import { Link } from 'react-router-dom';

export default function HeaderPortadaTexto() {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.7)',
      borderRadius: 24,
      boxShadow: '0 4px 32px 0 rgba(37,99,235,0.08)',
      padding: '2.5rem 2rem',
      backdropFilter: 'blur(6px)',
      border: '1.5px solid var(--color-primary-light)',
      marginBottom: 24,
    }}>
      <h1 className="fw-bolder display-4 mb-2" style={{ lineHeight: 1.1 }}>
        Reserva Espacios <br />
        <span style={{ color: '#2563eb', borderBottom: '5px solid #2563eb', display: 'inline-block', paddingBottom: 4 }}>
          Recreativos en la EPN
        </span>
      </h1>
      <p className="lead text-muted mb-4">
        Usa los espacios de recreación en la universidad sin restricciones, solo reserva el día y la hora en la que vas a utilizarlos, ¡y disfruta junto a tus amigos!
      </p>
      <Link to="/login">
        <button className="btn btn-success btn-lg px-4 fw-bold shadow" style={{ borderRadius: 24, boxShadow: '0 2px 12px 0 rgba(37,99,235,0.10)' }}>
          Reserva Ya!
        </button>
      </Link>
    </div>
  );
} 