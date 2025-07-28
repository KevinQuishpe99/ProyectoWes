import React from 'react';

export default function TipoEspacioInfo({ nombre, descripcion }) {
  return (
    <>
      <h5 className="card-title mb-1 fw-bold text-primary">{nombre}</h5>
      <small className="text-muted">Tipo de Espacio</small>
      {descripcion && (
        <p className="card-text text-muted mb-3" style={{ fontSize: '0.9rem' }}>{descripcion}</p>
      )}
    </>
  );
} 