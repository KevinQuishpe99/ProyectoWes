import { useState } from 'react';

export default function useTiposEspacioFiltros() {
  const [filtroNombre, setFiltroNombre] = useState('');
  const limpiarFiltros = () => setFiltroNombre('');
  return { filtroNombre, setFiltroNombre, limpiarFiltros };
} 