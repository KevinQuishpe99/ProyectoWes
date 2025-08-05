import React from 'react';
import PasoReserva from './PasoReserva';

const pasos = [
  {
    icon: 'bi-geo-alt',
    titulo: 'Escoge tu espacio',
    desc: 'Entre todas las canchas disponibles para reservar.'
  },
  {
    icon: 'bi-clock',
    titulo: 'Elige el horario',
    desc: 'Selecciona el día y la hora en que usarás la cancha.'
  },
  {
    icon: 'bi-check2-circle',
    titulo: 'Realiza tu reserva',
    desc: 'Completa los datos y disfruta tu espacio.'
  }
];

export default function PasosReserva({ refProp }) {
  return (
    <div ref={refProp} className="mt-5 p-4" style={{
      background: 'rgba(255,255,255,0.8)',
      borderRadius: 24,
      boxShadow: '0 4px 32px 0 rgba(37,99,235,0.07)',
      border: '1.5px solid var(--color-primary-light)',
      maxWidth: 900,
      margin: '0 auto',
      backdropFilter: 'blur(4px)',
    }}>
      <h4 className="fw-bold mb-4 text-center">
        ¿Cómo reservar una <span className="text-primary">cancha</span>?
      </h4>
      <div className="row text-center g-4">
        {pasos.map((paso, i) => (
          <PasoReserva key={i} paso={paso} />
        ))}
      </div>
    </div>
  );
} 