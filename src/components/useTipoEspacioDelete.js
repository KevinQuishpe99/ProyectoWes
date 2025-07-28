import Swal from 'sweetalert2';
import TiposEspacioService from '../../servicios/tiposEspacio/tiposEspacioService';

export default function useTipoEspacioDelete(fetchTipos, tipos) {
  const handleDelete = async id => {
    const tipo = tipos.find(t => t.id === id);
    const nombre = tipo ? tipo.nombre : '';
    Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Deseas eliminar el tipo de espacio "${nombre}"? Esta acción no se puede deshacer.`,
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
          await TiposEspacioService.delete(id);
          fetchTipos();
          Swal.fire({
            icon: 'success',
            title: 'Eliminado',
            text: 'Tipo de espacio eliminado correctamente',
            confirmButtonColor: '#3085d6',
          });
        } catch (err) {
          Swal.fire({
            icon: 'error',
            html: '<b>No se puede eliminar el tipo de espacio.</b><br><span style="font-size:1.1em">Puede estar asociado a canchas.</span>',
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