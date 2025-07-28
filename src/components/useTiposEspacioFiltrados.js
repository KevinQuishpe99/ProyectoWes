import { useMemo } from 'react';

export default function useTiposEspacioFiltrados(tipos, filtroNombre) {
  return useMemo(() => {
    if (!filtroNombre.trim()) return tipos;
    return tipos.filter(tipo => tipo.nombre.toLowerCase().includes(filtroNombre.toLowerCase()));
  }, [tipos, filtroNombre]);
} 