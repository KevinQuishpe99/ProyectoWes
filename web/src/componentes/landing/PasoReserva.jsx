import React from 'react';

export default function PasoReserva({ paso }) {
  return (
    <div className="col-12 col-md-4">
      <span className="d-inline-block mb-3" style={{ fontSize: 48, color: '#2563eb', filter: 'drop-shadow(0 0 8px #2563eb33)' }}>
        <i className={`bi ${paso.icon}`}></i>
      </span>
      <div className="fw-semibold mb-1" style={{ fontSize: 18 }}>{paso.titulo}</div>
      <div className="text-muted" style={{ fontSize: 15 }}>{paso.desc}</div>
    </div>
  );
} 