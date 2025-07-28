import React from 'react';
import CanchaCardImagen from './CanchaCardImagen';
import CanchaCardInfo from './CanchaCardInfo';
import CanchaCardBoton from './CanchaCardBoton';

export default function CanchaCard({ cancha }) {
  return (
    <div
      className="d-flex align-items-center p-3 flex-wrap flex-md-nowrap"
      style={{
        minHeight: 160,
        maxWidth: 900,
        margin: '0 auto',
        background: 'var(--color-white)',
        border: '1.5px solid var(--color-border)',
        borderRadius: 22,
        boxShadow: '0 4px 24px 0 rgba(37,99,235,0.07)',
        transition: 'box-shadow 0.2s',
      }}
    >
      <div style={{ minWidth: 200, maxWidth: 200 }} className="me-4 mb-3 mb-md-0">
        <CanchaCardImagen imagen={cancha.imagen} nombre={cancha.nombre} />
      </div>
      <div className="flex-grow-1 d-flex flex-column flex-md-row align-items-md-center justify-content-between w-100">
        <div className="mb-3 mb-md-0 pe-md-4 w-100">
          <CanchaCardInfo cancha={cancha} />
        </div>
        <div className="text-md-end w-100 w-md-auto">
          <CanchaCardBoton />
        </div>
      </div>
    </div>
  );
} 