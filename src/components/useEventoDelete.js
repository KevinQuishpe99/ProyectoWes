import Swal from 'sweetalert2';
import EventosService from '../../servicios/eventos/eventosService';

export default function useEventoDelete(fetchAll) {
  const handleDelete = (evento) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Deseas eliminar el evento "${evento.nombre}"?`,
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
          await EventosService.deleteEvento(evento.id);
          fetchAll();
          Swal.fire({
            icon: 'success',
            title: 'Eliminado',
            text: 'Evento eliminado correctamente',
            confirmButtonColor: '#3085d6'
          });
        } catch (err) {
          Swal.fire({
            icon: 'error',
            html: '<b>No se puede eliminar el evento.</b><br><span style="font-size:1.1em">Puede estar asociado a dependencias.</span>',
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