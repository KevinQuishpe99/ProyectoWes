import Swal from 'sweetalert2';

// Notificaciones de éxito
export const showSuccess = (title, message, timer = 2000) => {
  return Swal.fire({
    icon: 'success',
    title: title,
    text: message,
    confirmButtonColor: '#3085d6',
    timer: timer,
    showConfirmButton: timer === 0,
    toast: timer > 0,
    position: timer > 0 ? 'top-end' : 'center'
  });
};

// Notificaciones de error
export const showError = (title, message) => {
  return Swal.fire({
    icon: 'error',
    title: title,
    text: message,
    confirmButtonColor: '#d32f2f'
  });
};

// Notificaciones de confirmación
export const showConfirm = (title, message, confirmText = 'Sí, continuar', cancelText = 'Cancelar') => {
  return Swal.fire({
    title: title,
    text: message,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: confirmText,
    cancelButtonText: cancelText,
    reverseButtons: true
  });
};

// Notificaciones de eliminación
export const showDeleteConfirm = (itemName, itemType = 'elemento') => {
  return Swal.fire({
    title: '¿Estás seguro?',
    text: `¿Deseas eliminar ${itemType} "${itemName}"? Esta acción no se puede deshacer.`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar',
    reverseButtons: true
  });
};

// Notificaciones de error de eliminación por dependencias
export const showDeleteError = (itemType = 'elemento') => {
  return Swal.fire({
    icon: 'error',
    title: `No se puede eliminar el ${itemType}`,
    html: `<b>No se puede eliminar el ${itemType}.</b><br><span style="font-size:1.1em">Puede estar asociado a dependencias.</span>`,
    background: '#d32f2f',
    color: '#fff',
    iconColor: '#fff',
    confirmButtonColor: '#fff',
    confirmButtonText: `<span style="color:#d32f2f;font-weight:bold">Entendido</span>`,
    customClass: {
      popup: 'swal2-border-radius',
      title: 'swal2-title-bold',
    },
  });
};

// Notificaciones de carga
export const showLoading = (title = 'Procesando...') => {
  return Swal.fire({
    title: title,
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading();
    }
  });
};

// Cerrar notificación de carga
export const closeLoading = () => {
  Swal.close();
};

// Notificaciones de información
export const showInfo = (title, message) => {
  return Swal.fire({
    icon: 'info',
    title: title,
    text: message,
    confirmButtonColor: '#3085d6'
  });
};

// Notificaciones de advertencia
export const showWarning = (title, message) => {
  return Swal.fire({
    icon: 'warning',
    title: title,
    text: message,
    confirmButtonColor: '#ff9800'
  });
}; 