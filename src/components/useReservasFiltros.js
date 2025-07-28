import { useState } from 'react';

export default function useReservasFiltros() {
  const [filtroUsuario, setFiltroUsuario] = useState('');
  const [filtroCodigo, setFiltroCodigo] = useState('');
  const [filtroFecha, setFiltroFecha] = useState('');

  const limpiarFiltros = () => {
    setFiltroUsuario('');
    setFiltroCodigo('');
    setFiltroFecha('');
  };

  return {
    filtroUsuario,
    setFiltroUsuario,
    filtroCodigo,
    setFiltroCodigo,
    filtroFecha,
    setFiltroFecha,
    limpiarFiltros
  };
} 