import React from 'react';

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

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (time) => {
    return time ? time.split(':').slice(0, 2).join(':') : '';
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
    <div className="row g-4">
      {eventos.map(evento => (
        <div key={evento.id} className="col-12 col-md-6 col-lg-4">
          <div className="card bg-body border border-dark shadow-sm p-4 h-100">
            <div className="card-header bg-transparent border-0 pb-0">
              <div className="d-flex justify-content-between align-items-start">
                <div className="d-flex align-items-center gap-2">
                  <i className={`bi ${getTipoIcon(evento.tipo)} text-primary fs-4`}></i>
                  <div>
                    <h6 className="mb-0 fw-bold">{evento.tipo}</h6>
                    {getEstadoBadge(evento.estado)}
                  </div>
                </div>
              </div>
            </div>
            <div className="card-body">
              <h5 className="card-title mb-2">{evento.nombre}</h5>
              {evento.descripcion && (
                <p className="card-text text-muted small mb-3">{evento.descripcion}</p>
              )}
              <div className="mb-3">
                <div className="d-flex align-items-center gap-2 mb-2">
                  <i className="bi bi-geo-alt text-primary"></i>
                  <span className="fw-semibold">{evento.cancha?.nombre}</span>
                </div>
                <small className="text-muted">{evento.cancha?.tipoEspacio?.nombre}</small>
              </div>
              <div className="row g-2 mb-3">
                <div className="col-6">
                  <div className="d-flex align-items-center gap-1">
                    <i className="bi bi-calendar-plus text-success"></i>
                    <small className="fw-semibold">Inicio:</small>
                  </div>
                  <small className="text-muted d-block">
                    {formatDate(evento.fecha_inicio)}
                  </small>
                  <small className="text-muted">
                    {formatTime(evento.hora_inicio)}
                  </small>
                </div>
                <div className="col-6">
                  <div className="d-flex align-items-center gap-1">
                    <i className="bi bi-calendar-check text-danger"></i>
                    <small className="fw-semibold">Fin:</small>
                  </div>
                  <small className="text-muted d-block">
                    {formatDate(evento.fecha_fin)}
                  </small>
                  <small className="text-muted">
                    {formatTime(evento.hora_fin)}
                  </small>
                </div>
              </div>
            </div>
            <div className="card-footer bg-transparent border-0 pt-0">
              <div className="d-flex gap-2">
                <button 
                  className="btn btn-editar btn-sm flex-fill"
                  onClick={() => onEdit(evento)}
                >
                  <i className="bi bi-pencil-square me-1"></i>Editar
                </button>
                {rol !== 'organizador' && (
                  <button 
                    className="btn btn-danger btn-sm flex-fill"
                    onClick={() => onDelete(evento)}
                  >
                    <i className="bi bi-trash me-1"></i>Eliminar
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