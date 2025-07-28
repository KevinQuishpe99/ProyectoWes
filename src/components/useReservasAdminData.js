import { useState, useCallback, useEffect } from 'react';
import ReservasService from '../../servicios/reservas/reservasService';
import { getEstadosCancha } from '../../servicios/canchas/canchasService';

export default function useReservasAdminData() {
  const [reservas, setReservas] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [canchas, setCanchas] = useState([]);
  const [estadosCancha, setEstadosCancha] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    const [reservas, usuarios, canchas, estados] = await Promise.all([
      ReservasService.getAll(),
      ReservasService.getUsuarios(),
      ReservasService.getCanchas(),
      ReservasService.getEstados(),
    ]);
    setReservas(reservas);
    setUsuarios(usuarios);
    setCanchas(canchas);
    setEstadosCancha(estados);
    setLoading(false);
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  return {
    reservas,
    setReservas,
    usuarios,
    setUsuarios,
    canchas,
    setCanchas,
    estadosCancha,
    setEstadosCancha,
    loading,
    fetchAll
  };
} 