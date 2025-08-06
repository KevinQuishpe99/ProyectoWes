/**
 * Utilidades para normalización y búsqueda de texto
 * Este archivo contiene funciones para manejar texto de manera consistente
 * en toda la aplicación, incluyendo normalización y búsqueda insensible
 */

/**
 * Normaliza texto removiendo tildes y convirtiendo a minúsculas
 * Útil para búsquedas insensibles a acentos y mayúsculas
 * @param {string} text - El texto a normalizar
 * @returns {string} - Texto normalizado
 */
export const normalizarTexto = (text) => {
  // Si no hay texto, retornar string vacío
  if (!text) return '';
  
  // Proceso de normalización:
  // 1. Convertir a minúsculas
  // 2. Normalizar caracteres Unicode (NFD)
  // 3. Remover tildes y diacríticos
  return text
    .toLowerCase() // Convertir a minúsculas
    .normalize('NFD') // Normalizar caracteres Unicode
    .replace(/[\u0300-\u036f]/g, ''); // Remover tildes y diacríticos
};

/**
 * Verifica si un texto contiene otro texto (búsqueda insensible)
 * Realiza una búsqueda que no distingue entre mayúsculas/minúsculas ni acentos
 * @param {string} texto - El texto donde buscar
 * @param {string} busqueda - El texto a buscar
 * @returns {boolean} - true si encuentra coincidencia
 */
export const contieneTexto = (texto, busqueda) => {
  // Si alguno de los textos está vacío, retornar false
  if (!texto || !busqueda) return false;
  
  // Normalizar ambos textos para la comparación
  const textoNormalizado = normalizarTexto(texto);
  const busquedaNormalizada = normalizarTexto(busqueda);
  
  // Verificar si el texto normalizado contiene la búsqueda normalizada
  return textoNormalizado.includes(busquedaNormalizada);
}; 