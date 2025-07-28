import React from 'react';

export default function TipoEspacioBotones({ tipo, onEdit, onDelete, rol }) {
  return (
    <div className="d-flex gap-2 mt-auto">
      <button
        className="btn btn-editar btn-sm flex-fill"
        onClick={() => onEdit(tipo)}
        title="Editar"
      >
        <i className="bi bi-pencil-square me-1"></i>
        Editar
      </button>
      {rol !== 'organizador' && (
        <button
          className="btn btn-danger btn-sm flex-fill"
          onClick={() => onDelete(tipo.id)}
          title="Eliminar"
        >
          <i className="bi bi-trash me-1"></i>
          Eliminar
        </button>
      )}
    </div>
  );
} 