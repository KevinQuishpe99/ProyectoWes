import React from 'react';

export default function TipoEspacioInfo({ nombre, descripcion }) {
  return (
    <>
      <h5 className="card-title mb-1 fw-bold text-primary" style={{ fontSize: '1.1rem' }}>
        {nombre}
      </h5>
      <div className="d-flex align-items-center gap-1 mb-2">
        <i className="bi bi-tag-fill text-primary" style={{ fontSize: '0.8rem' }}></i>
        <small className="text-muted fw-semibold">Tipo de Espacio</small>
      </div>
      {descripcion && (
        <div className="bg-light rounded p-2 border-start border-primary border-2">
          <small className="text-muted mb-1 d-block">
            <i className="bi bi-info-circle me-1"></i>
            Descripción:
          </small>
          <p className="card-text text-muted mb-0" style={{ fontSize: '0.85rem', lineHeight: '1.4' }}>
            {descripcion}
          </p>
        </div>
      )}
    </>
  );
} 