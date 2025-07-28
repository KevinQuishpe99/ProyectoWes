import React from 'react';

export default function CanchaCardInfo({ cancha }) {
  return (
    <>
      <div className="fw-bold fs-4 mb-1" style={{ color: 'var(--color-primary-dark)' }}>{cancha.nombre}</div>
      <div className="d-flex flex-wrap gap-3 align-items-center mb-2">
        {cancha.tipo_espacio_nombre && (
          <span className="badge bg-primary bg-opacity-10 text-primary d-flex align-items-center" style={{ fontSize: 15, borderRadius: 12, fontWeight: 500 }}>
            <i className="bi bi-grid-3x3-gap me-1"></i> {cancha.tipo_espacio_nombre}
          </span>
        )}
        {cancha.capacidad && (
          <span className="badge bg-success bg-opacity-10 text-success d-flex align-items-center" style={{ fontSize: 15, borderRadius: 12, fontWeight: 500 }}>
            <i className="bi bi-people me-1"></i> Capacidad: {cancha.capacidad}
          </span>
        )}
        {cancha.ubicacion_referencia && (
          <span className="badge bg-info bg-opacity-10 text-info d-flex align-items-center" style={{ fontSize: 15, borderRadius: 12, fontWeight: 500 }}>
            <i className="bi bi-geo-alt me-1"></i> {cancha.ubicacion_referencia}
          </span>
        )}
      </div>
      <div className="text-muted" style={{ fontSize: 15, color: 'var(--color-text)' }}>{cancha.descripcion}</div>
    </>
  );
} 