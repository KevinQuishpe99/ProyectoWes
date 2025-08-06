// Importación de React para crear componentes
import React from 'react';
// Importación del componente de portada principal
import PortadaCanchas from '../componentes/landing/PortadaCanchas';

// Componente de la página de inicio (Home)
// Esta es la página principal que se muestra cuando se accede a la raíz del sitio
export default function Home() {
  // Renderizar la página de inicio con el componente de portada
  return (
    <>
      {/* Componente de portada que contiene la información principal del sistema */}
      <PortadaCanchas />
    </>
  );
} 
