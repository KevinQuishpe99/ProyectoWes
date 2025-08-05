import React from 'react';
import HeaderPortadaTexto from './HeaderPortadaTexto';
import HeaderPortadaImagen from './HeaderPortadaImagen';

export default function HeaderPortada() {
  return (
    <div className="row align-items-center g-5 flex-column-reverse flex-md-row">
      <div className="col-md-6 text-center text-md-start">
        <HeaderPortadaTexto />
      </div>
      <div className="col-md-6 text-center">
        <HeaderPortadaImagen />
      </div>
    </div>
  );
} 