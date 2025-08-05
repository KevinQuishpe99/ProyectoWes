import React from 'react';
import { formatearFechaCorta } from '../../utils/dateUtils';

export default function ReservasList({ reservas, modoUsuario, onCancelar, onEditar, onDelete, rol }) {
  console.log('🔍 ReservasList - Props recibidas:', {
    modoUsuario,
    rol,
    onDelete: !!onDelete,
    esAdmin: rol === 'admin' || rol === 'administrador'
  });

  if (!reservas || reservas.length === 0) {
    return <div className="alert alert-info">No hay reservas.</div>;
  }

  const esAdmin = rol === 'admin' || rol === 'administrador' || rol === 'organizador';
  const mostrarAcciones = modoUsuario || esAdmin;

  const formatDate = (date) => {
    return formatearFechaCorta(date);
  };

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'reservada':
        return 'bg-success';
      case 'cancelada':
        return 'bg-danger';
      case 'finalizada':
        return 'bg-secondary';
      default:
        return 'bg-secondary';
    }
  };

  return (
    <div className="d-flex flex-column gap-3">
      {/* Fila de títulos */}
      <div className="bg-light border rounded-3 p-3 d-flex align-items-center">
        {esAdmin && (
          <div style={{ width: '15%' }}>
            <h6 className="mb-0 fw-bold text-primary">Usuario</h6>
          </div>
        )}
        <div className="text-center" style={{ width: esAdmin ? '20%' : '25%' }}>
          <h6 className="mb-0 fw-bold text-primary">Cancha</h6>
        </div>
        <div className="text-center" style={{ width: esAdmin ? '15%' : '20%' }}>
          <h6 className="mb-0 fw-bold text-primary">Fecha</h6>
        </div>
        <div className="text-center" style={{ width: '12%' }}>
          <h6 className="mb-0 fw-bold text-primary">Hora Inicio</h6>
        </div>
        <div className="text-center" style={{ width: '12%' }}>
          <h6 className="mb-0 fw-bold text-primary">Hora Fin</h6>
        </div>
        <div className="text-center" style={{ width: '12%' }}>
          <h6 className="mb-0 fw-bold text-primary">Estado</h6>
        </div>
        {mostrarAcciones && (
          <div className="text-center" style={{ width: '14%' }}>
            <h6 className="mb-0 fw-bold text-primary">Acciones</h6>
          </div>
        )}
      </div>

          {reservas.map(reserva => {
        // Para admin y organizador, todas las reservas son editables
            // Para usuarios normales, solo las reservas en estado "reservada"
        const esEditable = (rol === 'admin' || rol === 'administrador' || rol === 'organizador') ? true : reserva.estado === 'reservada';
            const esFinalizada = reserva.estado === 'finalizada';
        
            return (
          <div key={reserva.id} className={`bg-white border rounded-3 shadow-sm ${esFinalizada ? 'opacity-75' : ''}`}>
            <div className="p-3 d-flex align-items-center">
              {/* Usuario - Solo para admin */}
                {esAdmin && (
                <div style={{ width: '15%' }}>
                  <div className="d-flex align-items-center gap-2">
                    <div className="bg-primary bg-opacity-10 rounded-circle p-1">
                      <i className="bi bi-person-circle text-primary"></i>
                    </div>
                    <div>
                      <h6 className="mb-0 fw-bold small">{reserva.usuario?.nombres}</h6>
                      <small className="text-muted">{reserva.usuario?.codigo}</small>
                    </div>
                  </div>
                </div>
              )}

              {/* Cancha */}
              <div className="text-center" style={{ width: esAdmin ? '20%' : '25%' }}>
                <div className="d-flex align-items-center justify-content-center gap-1">
                  <i className="bi bi-geo-alt text-primary small"></i>
                  <span className="fw-semibold small">{reserva.cancha?.nombre}</span>
                </div>
              </div>

              {/* Fecha */}
              <div className="text-center" style={{ width: esAdmin ? '15%' : '20%' }}>
                <div className="d-flex align-items-center justify-content-center gap-1">
                  <i className="bi bi-calendar text-primary small"></i>
                  <span className="fw-semibold small">{formatDate(reserva.fecha)}</span>
                </div>
              </div>

              {/* Hora Inicio */}
              <div className="text-center" style={{ width: '12%' }}>
                <div className="d-flex align-items-center justify-content-center gap-1">
                  <i className="bi bi-clock text-primary small"></i>
                  <span className="fw-semibold small">{reserva.hora_inicio}</span>
                </div>
              </div>

              {/* Hora Fin */}
              <div className="text-center" style={{ width: '12%' }}>
                <div className="d-flex align-items-center justify-content-center gap-1">
                  <i className="bi bi-clock-fill text-primary small"></i>
                  <span className="fw-semibold small">{reserva.hora_fin}</span>
                </div>
              </div>

              {/* Estado */}
              <div className="text-center" style={{ width: '12%' }}>
                <span className={`badge ${getEstadoColor(reserva.estado)} text-white`}>
                    {reserva.estado.charAt(0).toUpperCase() + reserva.estado.slice(1)}
                  </span>
              </div>

              {/* Acciones */}
                {mostrarAcciones && (
                <div className="text-center" style={{ width: '14%' }}>
                    <div className="d-flex justify-content-center gap-2">
                      {/* Botón Editar */}
                      <button
                        className="btn btn-sm btn-outline-primary"
                        title={esEditable ? "Editar reserva" : (rol === 'admin' || rol === 'administrador') ? "Editar reserva" : "Solo se pueden editar reservas activas"}
                        disabled={!esEditable}
                        onClick={() => {
                          if (esEditable && onEditar) {
                            console.log('Click en editar reserva:', reserva);
                            onEditar(reserva);
                          } else if ((rol === 'admin' || rol === 'administrador') && onEditar) {
                            // Admin puede editar cualquier reserva
                            console.log('Admin editando reserva:', reserva);
                            onEditar(reserva);
                          } else {
                            console.log('Reserva no editable:', reserva.estado);
                          }
                        }}
                      >
                        <i className="bi bi-pencil-square"></i>
                      </button>
                      
                      {/* Botón Cancelar/Eliminar */}
                      {modoUsuario && rol === 'usuario' ? (
                        // Para usuarios: NO mostrar botón eliminar, solo editar
                        (() => {
                          console.log('🔍 Usuario - NO se muestra botón eliminar');
                          return null;
                        })()
                      ) : modoUsuario ? (
                        // Para otros roles en modo usuario: cancelar si está reservada
                        <button
                          className="btn btn-sm btn-outline-danger"
                          title="Cancelar reserva"
                          disabled={!esEditable}
                          onClick={() => esEditable && onCancelar && onCancelar(reserva)}
                        >
                          <i className="bi bi-x-circle"></i>
                        </button>
                      ) : (
                        // Solo admin puede eliminar (NO usuarios)
                        (() => {
                          const puedeEliminar = (rol === 'admin' || rol === 'administrador');
                          console.log('🔍 Botón eliminar - Evaluación:', {
                            rol,
                            puedeEliminar,
                            modoUsuario
                          });
                          return puedeEliminar ? (
                            <button
                              className="btn btn-sm btn-outline-danger"
                              title="Eliminar reserva"
                              onClick={() => onDelete && onDelete(reserva)}
                            >
                              <i className="bi bi-trash"></i>
                            </button>
                          ) : null;
                        })()
                      )}
                    </div>
                </div>
                )}
            </div>
          </div>
            );
          })}
    </div>
  );
} 
