import React from 'react';
import TipoEspacioImagen from './TipoEspacioImagen';
import TipoEspacioInfo from './TipoEspacioInfo';
import TipoEspacioBotones from './TipoEspacioBotones';

export default function TipoEspacioCard({ tipo, onEdit, onDelete, rol }) {
  return (
    <div className="card bg-body border border-dark shadow-sm p-4 h-100">
      <div className="card-body p-0 d-flex flex-column h-100">
        <div className="d-flex align-items-center mb-3">
          <div className="flex-shrink-0 me-3">
            <TipoEspacioImagen imagen={tipo.imagen} nombre={tipo.nombre} />
          </div>
          <div className="flex-grow-1">
            <TipoEspacioInfo nombre={tipo.nombre} descripcion={tipo.descripcion} />
          </div>
        </div>
        <TipoEspacioBotones tipo={tipo} onEdit={onEdit} onDelete={onDelete} rol={rol} />
      </div>
    </div>
  );
} 