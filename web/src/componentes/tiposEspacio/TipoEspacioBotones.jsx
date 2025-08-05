import React from 'react';

export default function TipoEspacioBotones({ tipo, onEdit, onDelete, rol }) {
  return (
    <div className="d-flex gap-2 mt-auto">
      <button
        className="btn btn-outline-primary btn-sm flex-fill position-relative overflow-hidden"
        onClick={() => onEdit(tipo)}
        title="Editar tipo de espacio"
        style={{ transition: 'all 0.3s ease' }}
        onMouseEnter={(e) => {
          e.target.style.transform = 'translateY(-2px)';
          e.target.style.boxShadow = '0 4px 8px rgba(0,123,255,0.3)';
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = 'translateY(0)';
          e.target.style.boxShadow = 'none';
        }}
      >
        <i className="bi bi-pencil-square me-1"></i>
        Editar
      </button>
      {rol !== 'organizador' && (
        <button
          className="btn btn-outline-danger btn-sm flex-fill position-relative overflow-hidden"
          onClick={() => onDelete(tipo.id)}
          title="Eliminar tipo de espacio"
          style={{ transition: 'all 0.3s ease' }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 4px 8px rgba(220,53,69,0.3)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = 'none';
          }}
        >
          <i className="bi bi-trash me-1"></i>
          Eliminar
        </button>
      )}
    </div>
  );
} 