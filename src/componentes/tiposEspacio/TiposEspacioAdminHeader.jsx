import React from 'react';

export default function TiposEspacioAdminHeader({ onNuevo }) {
  return (
    <div className="d-flex justify-content-between align-items-center mb-4">
      <h2 className="panel-title mb-0">Tipos de Espacio</h2>
      <button 
        className="btn btn-success d-flex align-items-center gap-2" 
        onClick={onNuevo}
      >
        <i className="bi bi-plus-lg me-1"></i>
        Nuevo Tipo
      </button>
    </div>
  );
} 