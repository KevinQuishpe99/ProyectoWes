import React from 'react';
import CanchaCard from '../canchas/CanchaCard';

export default function ListaCanchas({ canchas, onReservar, modoUsuario }) {
  if (!canchas || canchas.length === 0) {
    return <div className="alert alert-info">No hay canchas disponibles.</div>;
  }
  return (
    <div className="row g-3">
      {canchas.map(cancha => (
        <div className="col-12 col-md-6 col-lg-4" key={cancha.id}>
          <CanchaCard
            cancha={cancha}
            modoUsuario={modoUsuario}
            onReservar={onReservar}
          />
        </div>
      ))}
    </div>
  );
} 