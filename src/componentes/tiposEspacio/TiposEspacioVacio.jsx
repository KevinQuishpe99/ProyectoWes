import React from 'react';

export default function TiposEspacioVacio() {
  return (
    <div className="text-center py-5">
      <i className="bi bi-inbox text-muted" style={{ fontSize: '3rem' }}></i>
      <h5 className="text-muted mt-3">No hay tipos de espacio</h5>
      <p className="text-muted">Crea el primer tipo de espacio para comenzar</p>
    </div>
  );
} 