import { useState, useMemo } from 'react';

export default function useFiltroCanchas(canchas, tiposEspacio, estadosCancha) {
  const [filtroNombre, setFiltroNombre] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('');

  const limpiarFiltros = () => {
    setFiltroNombre('');
    setFiltroTipo('');
    setFiltroEstado('');
  };

  const canchasFiltradas = useMemo(() => {
    return canchas.filter((c) => {
      const nombreOk = !filtroNombre || c.nombre.toLowerCase().includes(filtroNombre.toLowerCase());
      const tipoOk = !filtroTipo || c.tipoEspacioNombre === tiposEspacio.find(t => t.id === Number(filtroTipo))?.nombre;
      const estadoOk = !filtroEstado || c.estadoCanchaNombre === estadosCancha.find(e => e.id === Number(filtroEstado))?.nombre;
      return nombreOk && tipoOk && estadoOk;
    });
  }, [canchas, filtroNombre, filtroTipo, filtroEstado, tiposEspacio, estadosCancha]);

  return {
    filtroNombre,
    setFiltroNombre,
    filtroTipo,
    setFiltroTipo,
    filtroEstado,
    setFiltroEstado,
    limpiarFiltros,
    canchasFiltradas
  };
} 