import React from 'react';
import TiposEspacioList from './TiposEspacioList';

export default function TiposEspacioAdminLista({ loading, tiposFiltrados, onEdit, onDelete, rol }) {
  return (
    <div>
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="text-muted mt-3">Cargando tipos de espacio...</p>
        </div>
      ) : (
        <TiposEspacioList tipos={tiposFiltrados} onEdit={onEdit} onDelete={onDelete} rol={rol} />
      )}
    </div>
  );
} 