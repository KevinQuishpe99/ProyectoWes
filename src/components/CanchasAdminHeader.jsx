import React from 'react';

export default function CanchasAdminHeader({ onNuevo }) {
  return (
    <div className="d-flex justify-content-between align-items-center mb-4">
      <h2 className="panel-title mb-0">Canchas</h2>
      <button className="btn btn-success" onClick={onNuevo}>
        <i className="bi bi-plus-lg me-1"></i> Nueva Cancha
      </button>
    </div>
  );
} 