import React from 'react';
import TipoEspacioCard from './TipoEspacioCard';
import TiposEspacioVacio from './TiposEspacioVacio';

export default function TiposEspacioList({ tipos, onEdit, onDelete, rol }) {
  return (
    <div className="row g-4">
      {tipos.map((tipo) => (
        <div key={tipo.id} className="col-12 col-md-6 col-lg-4">
          <TipoEspacioCard tipo={tipo} onEdit={onEdit} onDelete={onDelete} rol={rol} />
        </div>
      ))}
      {tipos.length === 0 && (
        <div className="col-12">
          <TiposEspacioVacio />
        </div>
      )}
    </div>
  );
} 
