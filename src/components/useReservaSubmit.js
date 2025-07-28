import Swal from 'sweetalert2';

export default function useReservaSubmit({ editReserva, form, fetchAll, closeForm }) {
  const handleSubmit = async e => {
    e.preventDefault();
    try {
      if (editReserva) {
        await import('../../servicios/reservas/reservasService').then(({ default: ReservasService }) =>
          ReservasService.update(editReserva.id, form)
        );
        window.Swal.fire({ icon: 'success', title: 'Actualizada', text: 'Reserva actualizada correctamente', confirmButtonColor: '#3085d6' });
      } else {
        await import('../../servicios/reservas/reservasService').then(({ default: ReservasService }) =>
          ReservasService.create(form)
        );
        window.Swal.fire({ icon: 'success', title: 'Creada', text: 'Reserva creada correctamente', confirmButtonColor: '#3085d6' });
      }
      fetchAll();
      closeForm();
    } catch (err) {
      window.Swal.fire({ icon: 'error', title: 'Error', text: err.response?.data?.message || 'Error al guardar la reserva', confirmButtonColor: '#d32f2f' });
    }
  };
  return handleSubmit;
} 