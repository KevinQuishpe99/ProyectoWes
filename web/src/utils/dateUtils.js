/**
 * Utilidades para manejo de fechas y evitar problemas de zona horaria
 */

/**
 * Normaliza una fecha para evitar problemas de zona horaria
 * @param {string|Date} fecha - La fecha a normalizar
 * @returns {string} - Fecha en formato YYYY-MM-DD
 */
export const normalizarFecha = (fecha) => {
  if (!fecha) return '';
  
  // Si la fecha ya viene en formato YYYY-MM-DD, devolverla tal como está
  if (typeof fecha === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
    return fecha;
  }
  
  // Si viene como objeto Date o string con zona horaria, convertirla
  const date = new Date(fecha);
  
  // Verificar si la fecha es válida
  if (isNaN(date.getTime())) {
    console.error('Fecha inválida:', fecha);
    return '';
  }
  
  // Usar métodos UTC para evitar problemas de zona horaria
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  const fechaNormalizada = `${year}-${month}-${day}`;
  
  console.log('🔍 Normalización de fecha:', {
    fechaOriginal: fecha,
    fechaDate: date,
    fechaNormalizada: fechaNormalizada,
    timezoneOffset: date.getTimezoneOffset()
  });
  
  return fechaNormalizada;
};

/**
 * Normaliza una hora para el formato HH:MM
 * @param {string} hora - La hora a normalizar
 * @returns {string} - Hora en formato HH:MM
 */
export const normalizarHora = (hora) => {
  if (!hora) return '';
  
  console.log('🔍 normalizarHora - Hora recibida:', hora, 'Tipo:', typeof hora);
  
  // Si es un string, extraer solo HH:MM
  if (typeof hora === 'string') {
    const partes = hora.split(':');
    if (partes.length >= 2) {
      const horaNormalizada = `${partes[0]}:${partes[1]}`;
      console.log('🔍 normalizarHora - Hora normalizada:', horaNormalizada);
      return horaNormalizada;
    }
  }
  
  // Si es un objeto Date, convertir a HH:MM
  if (hora instanceof Date) {
    const horas = String(hora.getHours()).padStart(2, '0');
    const minutos = String(hora.getMinutes()).padStart(2, '0');
    const horaNormalizada = `${horas}:${minutos}`;
    console.log('🔍 normalizarHora - Hora de Date normalizada:', horaNormalizada);
    return horaNormalizada;
  }
  
  console.log('🔍 normalizarHora - No se pudo normalizar, devolviendo vacío');
  return '';
};

/**
 * Formatea una fecha para mostrar en la interfaz (formato largo)
 * @param {string|Date} fecha - La fecha a formatear
 * @returns {string} - Fecha formateada (ej: "4 de agosto de 2025")
 */
export const formatearFecha = (fecha) => {
  if (!fecha) return '';
  
  // Si la fecha viene como string YYYY-MM-DD, crear la fecha correctamente
  if (typeof fecha === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
    const [year, month, day] = fecha.split('-');
    // Crear fecha usando UTC para evitar problemas de zona horaria
    const date = new Date(Date.UTC(parseInt(year), parseInt(month) - 1, parseInt(day)));
    
    const opciones = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    
    return date.toLocaleDateString('es-ES', opciones);
  }
  
  // Si viene como objeto Date o string con tiempo
  const date = new Date(fecha);
  if (isNaN(date.getTime())) return '';
  
  const opciones = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  };
  
  return date.toLocaleDateString('es-ES', opciones);
};

/**
 * Formatea una fecha en formato DD/MM/YYYY (formato corto)
 * @param {string|Date} fecha - La fecha a formatear
 * @returns {string} - Fecha formateada (ej: "04/08/2025")
 */
export const formatearFechaCorta = (fecha) => {
  if (!fecha) return '';
  
  console.log('🔍 formatearFechaCorta - Fecha recibida:', fecha, 'Tipo:', typeof fecha);
  
  // Si la fecha viene como string YYYY-MM-DD
  if (typeof fecha === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
    const [year, month, day] = fecha.split('-');
    const resultado = `${day}/${month}/${year}`;
    console.log('🔍 formatearFechaCorta - Fecha YYYY-MM-DD procesada:', resultado);
    return resultado;
  }
  
  // Si viene como objeto Date o string con tiempo
  const date = new Date(fecha);
  if (isNaN(date.getTime())) {
    console.error('🔍 formatearFechaCorta - Fecha inválida:', fecha);
    return '';
  }
  
  // Usar métodos UTC para evitar problemas de zona horaria
  const day = String(date.getUTCDate()).padStart(2, '0');
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const year = date.getUTCFullYear();
  
  const resultado = `${day}/${month}/${year}`;
  console.log('🔍 formatearFechaCorta - Fecha procesada con UTC:', {
    fechaOriginal: fecha,
    fechaDate: date,
    resultado: resultado,
    timezoneOffset: date.getTimezoneOffset()
  });
  
  return resultado;
};

/**
 * Verifica si una fecha es válida
 * @param {string|Date} fecha - La fecha a verificar
 * @returns {boolean} - true si la fecha es válida
 */
export const esFechaValida = (fecha) => {
  if (!fecha) return false;
  const date = new Date(fecha);
  return !isNaN(date.getTime());
}; 