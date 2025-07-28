import React from 'react';

export default function EventosAdminHeader({ onNuevo }) {
  return (
    <div className="d-flex justify-content-between align-items-center mb-4">
      <h2 className="panel-title mb-0">Eventos</h2>
      <button className="btn btn-success" onClick={onNuevo}>
        <i className="bi bi-plus-lg me-1"></i> Nuevo Evento
      </button>
    </div>
  );
} 