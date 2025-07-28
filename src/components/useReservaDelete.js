import Swal from 'sweetalert2';
import ReservasService from '../../servicios/reservas/reservasService';

export default function useReservaDelete(fetchAll) {
  const handleDelete = (reserva) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Deseas eliminar la reserva de ${reserva.fecha} (${reserva.hora_inicio} - ${reserva.hora_fin})?`,
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
          await ReservasService.delete(reserva.id);
          fetchAll();
          Swal.fire({ icon: 'success', title: 'Eliminada', text: 'Reserva eliminada correctamente', confirmButtonColor: '#3085d6' });
        } catch (err) {
          Swal.fire({
            icon: 'error',
            html: '<b>No se puede eliminar la reserva.</b><br><span style="font-size:1.1em">Puede estar asociada a dependencias.</span>',
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