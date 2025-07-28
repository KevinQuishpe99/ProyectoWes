import { useState, useEffect, useCallback } from 'react';
import ReportesService from '../../servicios/reportes/reportesService';

export default function useReportesDashboardData() {
  const [reservas, setReservas] = useState([]);
  const [eventos, setEventos] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [canchas, setCanchas] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({ from: '', to: '' });

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [reservas, eventos, canchas, feedbacks, usuarios] = await Promise.all([
        ReportesService.getReservas(),
        ReportesService.getEventos(),
        ReportesService.getCanchas(),
        ReportesService.getFeedbacks(),
        ReportesService.getUsuarios()
      ]);
      setReservas(reservas);
      setEventos(eventos);
      setCanchas(canchas);
      setFeedbacks(feedbacks);
      setUsuarios(usuarios);
    } catch (e) {}
    setLoading(false);
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  // Filtro por fecha
  const filterByDate = (arr, field) => {
    if (!dateRange.from && !dateRange.to) return arr;
    return arr.filter(item => {
      const date = new Date(item[field]);
      const from = dateRange.from ? new Date(dateRange.from) : null;
      const to = dateRange.to ? new Date(dateRange.to) : null;
      if (from && date < from) return false;
      if (to && date > to) return false;
      return true;
    });
  };

  return {
    reservas,
    eventos,
    feedbacks,
    canchas,
    usuarios,
    loading,
    dateRange,
    setDateRange,
    filterByDate
  };
} 