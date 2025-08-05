import React from 'react';
import TipoEspacioImagen from './TipoEspacioImagen';
import TipoEspacioInfo from './TipoEspacioInfo';
import TipoEspacioBotones from './TipoEspacioBotones';

export default function TipoEspacioCard({ tipo, onEdit, onDelete, rol }) {
  return (
    <div className="card bg-white border-0 shadow-sm h-100 position-relative overflow-hidden">
      {/* Fondo decorativo */}
      <div className="position-absolute top-0 start-0 w-100 h-100 bg-gradient-primary opacity-10"></div>
      
      {/* Contenido principal */}
      <div className="card-body p-4 d-flex flex-column h-100 position-relative">
        {/* Header con imagen y título */}
        <div className="d-flex align-items-center mb-3">
          <div className="flex-shrink-0 me-3">
            <TipoEspacioImagen imagen={tipo.imagen} nombre={tipo.nombre} />
          </div>
          <div className="flex-grow-1">
            <TipoEspacioInfo nombre={tipo.nombre} descripcion={tipo.descripcion} />
          </div>
        </div>

        {/* Botones de acción */}
        <div className="mt-auto">
          <TipoEspacioBotones tipo={tipo} onEdit={onEdit} onDelete={onDelete} rol={rol} />
        </div>
      </div>

      {/* Indicador de estado en la esquina */}
      <div className="position-absolute top-0 end-0 p-2">
        <div className="bg-success rounded-circle" style={{ width: '12px', height: '12px' }}></div>
      </div>
    </div>
  );
} 