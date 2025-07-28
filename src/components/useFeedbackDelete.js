import Swal from 'sweetalert2';
import FeedbackService from '../../servicios/feedback/feedbackService';

export default function useFeedbackDelete(fetchAll) {
  const handleDelete = (feedback) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Deseas eliminar el feedback de ${feedback.usuario?.nombres}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await FeedbackService.deleteFeedback(feedback.id);
          fetchAll();
          Swal.fire({
            icon: 'success',
            title: 'Eliminado',
            text: 'Feedback eliminado correctamente',
            confirmButtonColor: '#3085d6'
          });
        } catch (err) {
          Swal.fire({
            icon: 'error',
            html: '<b>No se puede eliminar el feedback.</b><br><span style="font-size:1.1em">Puede estar asociado a dependencias.</span>',
            background: '#d32f2f',
            color: '#fff',
            iconColor: '#fff',
            confirmButtonColor: '#fff',
            confirmButtonText: '<span style="color:#d32f2f;font-weight:bold">Entendido</span>',
            customClass: {
              popup: 'swal2-border-radius',
              title: 'swal2-title-bold',
            },
          });
        }
      }
    });
  };
  return handleDelete;
} 