import React from 'react';

export default function HeaderPortadaImagen() {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.6)',
      borderRadius: 24,
      boxShadow: '0 4px 32px 0 rgba(37,99,235,0.08)',
      padding: 16,
      border: '1.5px solid var(--color-primary-light)',
      display: 'inline-block',
    }}>
      <img
        src="https://webhistorico.epn.edu.ec/wp-content/uploads/2017/07/1.8.jpg"
        alt="Campus histórico de la Escuela Politécnica Nacional - EPN"
        className="img-fluid rounded shadow"
        style={{ 
          maxHeight: 320,
          objectFit: 'cover',
          border: '4px solid #e0e7ff'
        }}
      />
    </div>
  );
} 