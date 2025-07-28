import React from 'react';

export default function CanchaCardImagen({ imagen, nombre }) {
  return imagen ? (
    <img
      src={`data:image/jpeg;base64,${imagen}`}
      alt={nombre}
      className="img-fluid rounded-3"
      style={{ width: '70%', height: 130, objectFit: 'cover', border: '2px solid var(--color-primary-light)', objectPosition: 'center', background: 'var(--color-primary-light)', margin: '10 auto' }}
    />
  ) : (
    <div className="bg-light d-flex align-items-center justify-content-center rounded-3" style={{ width: 200, height: 130, border: '2px solid var(--color-primary-light)', background: 'var(--color-primary-light)' }}>
      <i className="bi bi-image text-secondary" style={{ fontSize: 48 }}></i>
    </div>
  );
} 