import { useState, useCallback } from 'react';
import Swal from 'sweetalert2';
import FeedbackService from '../../servicios/feedback/feedbackService';

export default function useFeedbacksAdminData() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [canchas, setCanchas] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [feedbacks, usuarios, canchas] = await Promise.all([
        FeedbackService.getFeedbacks(),
        FeedbackService.getUsuarios(),
        FeedbackService.getCanchas(),
      ]);
      setFeedbacks(feedbacks);
      setUsuarios(usuarios);
      setCanchas(canchas);
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
    feedbacks,
    setFeedbacks,
    usuarios,
    setUsuarios,
    canchas,
    setCanchas,
    loading,
    fetchAll
  };
} 