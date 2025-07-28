import { useState, useCallback } from 'react';

export default function useFeedbacksFiltros({ setFeedbacks, fetchAll }) {
  const [filtroCancha, setFiltroCancha] = useState('');
  const [filtroCalificacion, setFiltroCalificacion] = useState('');
  const [filtroFecha, setFiltroFecha] = useState('');

  const fetchFeedbacksConFiltros = useCallback(async () => {
    try {
      const params = {};
      if (filtroCancha) params.cancha_id = filtroCancha;
      if (filtroCalificacion) params.calificacion = filtroCalificacion;
      if (filtroFecha) params.fecha = filtroFecha;
      const feedbacks = await import('../../servicios/feedback/feedbackService').then(({ default: FeedbackService }) =>
        FeedbackService.getFeedbacks(params)
      );
      setFeedbacks(feedbacks);
    } catch (error) {
      window.Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error al aplicar filtros',
        confirmButtonColor: '#d32f2f'
      });
    }
  }, [filtroCancha, filtroCalificacion, filtroFecha, setFeedbacks]);

  const limpiarFiltros = () => {
    setFiltroCancha('');
    setFiltroCalificacion('');
    setFiltroFecha('');
  };

  return {
    filtroCancha,
    setFiltroCancha,
    filtroCalificacion,
    setFiltroCalificacion,
    filtroFecha,
    setFiltroFecha,
    limpiarFiltros,
    fetchFeedbacksConFiltros
  };
} 