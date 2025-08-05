import React from 'react';
import { formatearFechaCorta, normalizarHora } from '../../utils/dateUtils';

export default function EventosList({ eventos, onEdit, onDelete, rol }) {
  const getEstadoBadge = (estado) => {
    const estados = {
      'agendado': { class: 'bg-primary', text: 'Agendado' },
      'en proceso': { class: 'bg-success', text: 'En Proceso' },
      'finalizado': { class: 'bg-secondary', text: 'Finalizado' }
    };
    const estadoInfo = estados[estado] || { class: 'bg-secondary', text: estado };
    return <span className={`badge ${estadoInfo.class}`}>{estadoInfo.text}</span>;
  };

  const getTipoIcon = (tipo) => {
    const iconos = {
      'Torneo': 'bi-trophy',
      'Entrenamiento': 'bi-person-workspace',
      'Exhibición': 'bi-star',
      'Clase': 'bi-book',
      'Competencia': 'bi-award',
      'Otro': 'bi-calendar-event'
    };
    return iconos[tipo] || 'bi-calendar-event';
  };

  const formatTime = (time) => {
    return normalizarHora(time);
  };

  if (eventos.length === 0) {
    return (
      <div className="text-center py-5">
        <i className="bi bi-calendar-x display-1 text-muted"></i>
        <h5 className="mt-3 text-muted">No hay eventos registrados</h5>
        <p className="text-muted">Crea el primer evento para comenzar</p>
      </div>
    );
  }

  return (
    <div className="d-flex flex-column gap-3">
      {/* Fila de títulos */}
      <div className="bg-light border rounded-3 p-3 d-flex align-items-center">
        <div style={{ width: '15%' }}>
          <h6 className="mb-0 fw-bold text-primary">Tipo</h6>
        </div>
        <div style={{ width: '25%' }}>
          <h6 className="mb-0 fw-bold text-primary">Evento</h6>
        </div>
        <div className="text-center" style={{ width: '15%' }}>
          <h6 className="mb-0 fw-bold text-primary">Cancha</h6>
        </div>
        <div className="text-center" style={{ width: '12%' }}>
          <h6 className="mb-0 fw-bold text-primary">Fecha Inicio</h6>
        </div>
        <div className="text-center" style={{ width: '12%' }}>
          <h6 className="mb-0 fw-bold text-primary">Fecha Fin</h6>
        </div>
        <div className="text-center" style={{ width: '8%' }}>
          <h6 className="mb-0 fw-bold text-primary">Estado</h6>
        </div>
        <div className="text-center" style={{ width: '13%' }}>
          <h6 className="mb-0 fw-bold text-primary">Acciones</h6>
        </div>
      </div>

      {eventos.map(evento => (
        <div key={evento.id} className="bg-white border rounded-3 shadow-sm">
          <div className="p-3 d-flex align-items-center">
            {/* Tipo de evento */}
            <div style={{ width: '15%' }}>
              <div className="d-flex align-items-center gap-2">
                <i className={`bi ${getTipoIcon(evento.tipo)} text-primary`}></i>
                <span className="fw-semibold small">{evento.tipo}</span>
              </div>
            </div>

            {/* Nombre del evento */}
            <div style={{ width: '25%' }}>
              <div>
                <h6 className="mb-0 fw-bold small">{evento.nombre}</h6>
                {evento.descripcion && (
                  <small className="text-muted text-truncate d-block" style={{ maxWidth: '200px' }}>
                    {evento.descripcion}
                  </small>
                )}
              </div>
            </div>

            {/* Cancha */}
            <div className="text-center" style={{ width: '15%' }}>
              <div className="d-flex align-items-center justify-content-center gap-1">
                <i className="bi bi-geo-alt text-primary small"></i>
                <div>
                  <span className="fw-semibold small d-block">{evento.cancha?.nombre}</span>
                  <small className="text-muted">{evento.cancha?.tipoEspacio?.nombre}</small>
                </div>
              </div>
            </div>

            {/* Fecha Inicio */}
            <div className="text-center" style={{ width: '12%' }}>
              <div className="d-flex align-items-center justify-content-center gap-1">
                <i className="bi bi-calendar-plus text-success small"></i>
                <div>
                  <span className="fw-semibold small d-block">{formatearFechaCorta(evento.fecha_inicio)}</span>
                  <small className="text-muted">{formatTime(evento.hora_inicio)}</small>
                </div>
              </div>
            </div>

            {/* Fecha Fin */}
            <div className="text-center" style={{ width: '12%' }}>
              <div className="d-flex align-items-center justify-content-center gap-1">
                <i className="bi bi-calendar-check text-danger small"></i>
                <div>
                  <span className="fw-semibold small d-block">{formatearFechaCorta(evento.fecha_fin)}</span>
                  <small className="text-muted">{formatTime(evento.hora_fin)}</small>
                </div>
              </div>
            </div>

            {/* Estado */}
            <div className="text-center" style={{ width: '8%' }}>
              {getEstadoBadge(evento.estado)}
            </div>

            {/* Acciones */}
            <div className="text-center" style={{ width: '13%' }}>
              <div className="d-flex justify-content-center gap-2">
                <button 
                  className="btn btn-sm btn-outline-primary"
                  onClick={() => onEdit(evento)}
                  title="Editar evento"
                >
                  <i className="bi bi-pencil-square"></i>
                </button>
                {rol !== 'organizador' && (
                  <button 
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => onDelete(evento)}
                    title="Eliminar evento"
                  >
                    <i className="bi bi-trash"></i>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
} 
