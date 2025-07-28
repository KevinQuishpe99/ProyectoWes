import { useState, useCallback } from 'react';
import Swal from 'sweetalert2';
import EventosService from '../../servicios/eventos/eventosService';

export default function useEventosAdminData() {
  const [eventos, setEventos] = useState([]);
  const [canchas, setCanchas] = useState([]);
  const [estadosEvento, setEstadosEvento] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [eventos, canchas, estados] = await Promise.all([
        EventosService.getEventos(),
        EventosService.getCanchas(),
        EventosService.getEstadosEvento(),
      ]);
      setEventos(eventos);
      setCanchas(canchas);
      setEstadosEvento(estados);
    } catch (error) {
      console.error('Error al cargar datos:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error al cargar los datos',
        confirmButtonColor: '#d32f2f'
      });
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    eventos,
    setEventos,
    canchas,
    setCanchas,
    estadosEvento,
    setEstadosEvento,
    loading,
    fetchAll
  };
} 