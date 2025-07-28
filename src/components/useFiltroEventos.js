import { useState, useMemo } from 'react';

export default function useFiltroEventos(eventos, canchas, estadosEvento, tiposEvento) {
  const [filtroNombre, setFiltroNombre] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('');
  const [filtroCancha, setFiltroCancha] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('');
  const [filtroFecha, setFiltroFecha] = useState('');

  const limpiarFiltros = () => {
    setFiltroNombre('');
    setFiltroTipo('');
    setFiltroCancha('');
    setFiltroEstado('');
    setFiltroFecha('');
  };

  const eventosFiltrados = useMemo(() => {
    return eventos.filter(evento => {
      const nombreOk = !filtroNombre || evento.nombre.toLowerCase().includes(filtroNombre.toLowerCase());
      const tipoOk = !filtroTipo || evento.tipo === filtroTipo;
      const canchaOk = !filtroCancha || evento.cancha_id === Number(filtroCancha);
      const estadoOk = !filtroEstado || evento.estado === filtroEstado || evento.estado === Number(filtroEstado);
      const fechaOk = !filtroFecha || (evento.fecha_inicio <= filtroFecha && evento.fecha_fin >= filtroFecha);
      return nombreOk && tipoOk && canchaOk && estadoOk && fechaOk;
    });
  }, [eventos, filtroNombre, filtroTipo, filtroCancha, filtroEstado, filtroFecha]);

  return {
    filtroNombre,
    setFiltroNombre,
    filtroTipo,
    setFiltroTipo,
    filtroCancha,
    setFiltroCancha,
    filtroEstado,
    setFiltroEstado,
    filtroFecha,
    setFiltroFecha,
    limpiarFiltros,
    eventosFiltrados
  };
} 