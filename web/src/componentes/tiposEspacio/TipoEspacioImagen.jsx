import React from 'react';

export default function TipoEspacioImagen({ imagen, nombre }) {
  return imagen ? (
    <div className="position-relative">
      <img
        src={`data:image/jpeg;base64,${imagen}`}
        alt={nombre}
        className="rounded shadow-sm"
        style={{ 
          width: 70, 
          height: 70, 
          objectFit: 'cover',
          border: '2px solid #e9ecef'
        }}
      />
      {/* Overlay sutil */}
      <div className="position-absolute top-0 start-0 w-100 h-100 rounded bg-dark opacity-0" 
           style={{ transition: 'opacity 0.3s ease' }}
           onMouseEnter={(e) => e.target.style.opacity = '0.1'}
           onMouseLeave={(e) => e.target.style.opacity = '0'}></div>
    </div>
  ) : (
    <div
      className="rounded d-flex align-items-center justify-content-center shadow-sm position-relative"
      style={{ 
        width: 70, 
        height: 70, 
        background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
        border: '2px solid #e9ecef'
      }}
    >
      <i className="bi bi-image text-muted" style={{ fontSize: '1.8rem' }}></i>
      {/* Efecto de brillo */}
      <div className="position-absolute top-0 start-0 w-100 h-100 rounded" 
           style={{ 
             background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.3) 50%, transparent 70%)',
             transform: 'translateX(-100%)',
             transition: 'transform 0.6s ease'
           }}
           onMouseEnter={(e) => e.target.style.transform = 'translateX(100%)'}
           onMouseLeave={(e) => e.target.style.transform = 'translateX(-100%)'}></div>
    </div>
  );
} 