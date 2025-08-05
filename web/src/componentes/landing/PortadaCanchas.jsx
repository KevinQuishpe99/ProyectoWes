import React, { useEffect, useState, useRef } from 'react';
import NavbarPortada from './NavbarPortada';
import HeaderPortada from './HeaderPortada';
import PasosReserva from './PasosReserva';

export default function PortadaCanchas() {
  const comoReservarRef = useRef(null);

  const scrollToSection = (ref) => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(120deg, #e0e7ff 0%, #f8fafc 100%)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <NavbarPortada scrollToSection={scrollToSection} refs={{ comoReservarRef }} />
      <div style={{ height: 64 }}></div>
      <div className="container py-5">
        <HeaderPortada />
        <PasosReserva refProp={comoReservarRef} />
      </div>
      <style>{`
        .cancha-card-hover:hover {
          transform: translateY(-6px) scale(1.012);
          box-shadow: 0 8px 32px 0 rgba(37,99,235,0.13);
        }
      `}</style>
    </div>
  );
} 
