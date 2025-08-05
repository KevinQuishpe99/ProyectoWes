/**
 * Normaliza texto removiendo tildes y convirtiendo a minúsculas
 * @param {string} text - El texto a normalizar
 * @returns {string} - Texto normalizado
 */
export const normalizarTexto = (text) => {
  if (!text) return '';
  
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, ''); // Remover tildes y diacríticos
};

/**
 * Verifica si un texto contiene otro texto (búsqueda insensible)
 * @param {string} texto - El texto donde buscar
 * @param {string} busqueda - El texto a buscar
 * @returns {boolean} - true si encuentra coincidencia
 */
export const contieneTexto = (texto, busqueda) => {
  if (!texto || !busqueda) return false;
  
  const textoNormalizado = normalizarTexto(texto);
  const busquedaNormalizada = normalizarTexto(busqueda);
  
  return textoNormalizado.includes(busquedaNormalizada);
}; 