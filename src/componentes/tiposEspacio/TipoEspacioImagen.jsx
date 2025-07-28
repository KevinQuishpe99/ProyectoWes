import React from 'react';

export default function TipoEspacioImagen({ imagen, nombre }) {
  return imagen ? (
    <img
      src={`data:image/jpeg;base64,${imagen}`}
      alt={nombre}
      className="rounded"
      style={{ width: 60, height: 60, objectFit: 'cover', border: '1px solid var(--bs-border-color, #dee2e6)' }}
    />
  ) : (
    <div
      className="rounded d-flex align-items-center justify-content-center bg-body-tertiary"
      style={{ width: 60, height: 60, border: '1px solid var(--bs-border-color, #dee2e6)' }}
    >
      <i className="bi bi-image text-muted" style={{ fontSize: '1.5rem' }}></i>
    </div>
  );
} 