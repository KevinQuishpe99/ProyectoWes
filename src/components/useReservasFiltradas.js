import { useMemo } from 'react';

export default function useReservasFiltradas(reservas, filtroUsuario, filtroCodigo, filtroFecha) {
  return useMemo(() => reservas.filter(r => {
    const usuarioOk = !filtroUsuario || (r.usuario && r.usuario.nombres && r.usuario.nombres.toLowerCase().includes(filtroUsuario.toLowerCase()));
    const codigoOk = !filtroCodigo || (r.usuario && r.usuario.codigo && r.usuario.codigo.toLowerCase().includes(filtroCodigo.toLowerCase()));
    const fechaOk = !filtroFecha || r.fecha === filtroFecha;
    return usuarioOk && codigoOk && fechaOk;
  }), [reservas, filtroUsuario, filtroCodigo, filtroFecha]);
} 