import React, { useState } from 'react';

export default function FeedbacksList({ feedbacks, onEdit, onDelete, onResponder, rol }) {
  const [expandedFeedback, setExpandedFeedback] = useState(null);
  const getCalificacionStars = (calificacion) => {
    if (!calificacion) return <span className="text-muted">Sin calificación</span>;
    
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= calificacion) {
        stars.push(
          <i key={i} className="bi bi-star-fill text-warning" style={{ fontSize: '1.2rem' }}></i>
        );
      } else {
        stars.push(
          <i key={i} className="bi bi-star text-muted" style={{ fontSize: '1.2rem' }}></i>
        );
      }
    }
    return <span className="d-flex gap-1">{stars}</span>;
  };

  const getCalificacionNumero = (calificacion) => {
    if (!calificacion) return <span className="text-muted">-</span>;
    return <span className={`fw-bold ${getCalificacionColor(calificacion)}`}>{calificacion}/5</span>;
  };

  const getCalificacionColor = (calificacion) => {
    if (!calificacion) return 'text-muted';
    if (calificacion >= 4) return 'text-success';
    if (calificacion >= 3) return 'text-warning';
    return 'text-danger';
  };

  const formatDate = (date) => {
    const fecha = new Date(date);
    const dia = String(fecha.getDate()).padStart(2, '0');
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const año = fecha.getFullYear();
    return `${dia}/${mes}/${año}`;
  };

  const getTimeAgo = (date) => {
    const now = new Date();
    const feedbackDate = new Date(date);
    const diffInMs = now - feedbackDate;
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInDays > 0) {
      return `hace ${diffInDays} día${diffInDays > 1 ? 's' : ''}`;
    } else if (diffInHours > 0) {
      return `hace ${diffInHours} hora${diffInHours > 1 ? 's' : ''}`;
    } else {
      const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
      return `hace ${diffInMinutes} minuto${diffInMinutes > 1 ? 's' : ''}`;
    }
  };

  const hasAdminResponse = (respuesta) => {
    return respuesta && respuesta.trim() !== '';
  };

  if (feedbacks.length === 0) {
    return (
      <div className="text-center py-5">
        <i className="bi bi-chat-dots display-1 text-muted"></i>
        <h5 className="mt-3 text-muted">No hay feedback registrado</h5>
        <p className="text-muted">Los usuarios aún no han dejado comentarios</p>
      </div>
    );
  }

  const toggleExpanded = (feedbackId) => {
    setExpandedFeedback(expandedFeedback === feedbackId ? null : feedbackId);
  };

  return (
    <div className="d-flex flex-column gap-3">
      {/* Fila de títulos */}
      <div className="bg-light border rounded-3 p-3 d-flex align-items-center">
        <div style={{ width: '20%' }}>
          <h6 className="mb-0 fw-bold text-primary">Usuario</h6>
        </div>
        <div className="text-center" style={{ width: '20%' }}>
          <h6 className="mb-0 fw-bold text-primary">Cancha</h6>
        </div>
        <div className="text-center" style={{ width: '10%' }}>
          <h6 className="mb-0 fw-bold text-primary">Calificación</h6>
        </div>
        <div style={{ width: '25%' }}>
          <h6 className="mb-0 fw-bold text-primary">Comentario</h6>
        </div>
        <div className="text-center" style={{ width: '10%' }}>
          <h6 className="mb-0 fw-bold text-primary">Estado</h6>
        </div>
        <div className="text-end" style={{ width: '10%' }}>
          <h6 className="mb-0 fw-bold text-primary">Fecha</h6>
        </div>
        <div style={{ width: '5%' }}>
          <h6 className="mb-0 fw-bold text-primary">Acciones</h6>
        </div>
      </div>

      {feedbacks.map((feedback) => {
        const isExpanded = expandedFeedback === feedback.id;
        const isPendiente = !hasAdminResponse(feedback.respuesta);
        
        return (
          <div key={feedback.id} className="bg-white border rounded-3 shadow-sm position-relative">
            {/* Punto rojo para feedbacks sin respuesta */}
            {isPendiente && (
              <div className="position-absolute top-2 end-2">
                <div className="bg-danger rounded-circle" style={{ width: '12px', height: '12px' }}></div>
              </div>
            )}
            {/* Fila principal compacta */}
            <div 
              className="p-3 d-flex align-items-center cursor-pointer"
              onClick={() => toggleExpanded(feedback.id)}
              style={{ cursor: 'pointer' }}
            >
              {/* Usuario - 20% */}
              <div className="d-flex align-items-center gap-2" style={{ width: '20%' }}>
                <div className="bg-primary bg-opacity-10 rounded-circle p-1">
                  <i className="bi bi-person-circle text-primary"></i>
                </div>
                <div>
                  <h6 className="mb-0 fw-bold small">{feedback.usuario?.nombres}</h6>
                  <small className="text-muted">{feedback.usuario?.codigo}</small>
                </div>
              </div>

              {/* Cancha - 20% */}
              <div className="text-center" style={{ width: '20%' }}>
                <div className="d-flex align-items-center justify-content-center gap-1">
                  <i className="bi bi-geo-alt text-primary small"></i>
                  <span className="fw-semibold small">{feedback.cancha?.nombre}</span>
                </div>
              </div>

              {/* Calificación - 10% */}
              <div className="text-center" style={{ width: '10%' }}>
                {getCalificacionNumero(feedback.calificacion)}
              </div>

              {/* Comentario resumido - 25% */}
              <div style={{ width: '25%' }}>
                {feedback.comentario ? (
                  <p className="text-muted mb-0 small text-truncate">
                    {feedback.comentario}
                  </p>
                ) : (
                  <span className="text-muted small">Sin comentario</span>
                )}
              </div>

              {/* Estado de respuesta - 10% */}
              <div className="text-center" style={{ width: '10%' }}>
                {hasAdminResponse(feedback.respuesta) ? (
                  <span className="badge bg-success text-white">Respondido</span>
                ) : (
                  <span className="badge bg-warning text-dark">Pendiente</span>
                )}
              </div>

              {/* Fecha - 10% */}
              <div className="text-end" style={{ width: '10%' }}>
                <small className="text-muted">{getTimeAgo(feedback.fecha)}</small>
              </div>

              {/* Botón expandir - 5% */}
              <div className="d-flex justify-content-end" style={{ width: '5%' }}>
                <button 
                  className="btn btn-outline-secondary btn-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleExpanded(feedback.id);
                  }}
                >
                  <i className={`bi ${isExpanded ? 'bi-chevron-up' : 'bi-chevron-down'}`}></i>
                </button>
              </div>
            </div>

            {/* Contenido expandido */}
            {isExpanded && (
              <div className="border-top p-4 bg-light">
                <div className="row g-3">
                  {/* Comentario completo */}
                  {feedback.comentario && (
                    <div className="col-12">
                      <h6 className="fw-semibold mb-2">Comentario:</h6>
                      <div className="bg-white p-3 rounded border">
                        <p className="text-muted mb-0">{feedback.comentario}</p>
                      </div>
                    </div>
                  )}

                  {/* Respuesta completa */}
                  {hasAdminResponse(feedback.respuesta) && (
                    <div className="col-12">
                      <h6 className="fw-semibold text-info mb-2">
                        <i className="bi bi-shield-check me-1"></i>
                        Respuesta del administrador:
                      </h6>
                      <div className="bg-info bg-opacity-10 p-3 rounded border-start border-info border-3">
                        <p className="text-info mb-0">{feedback.respuesta}</p>
                      </div>
                    </div>
                  )}

                  {/* Información adicional */}
                  <div className="col-md-6">
                    <h6 className="fw-semibold mb-2">Detalles:</h6>
                    <div className="bg-white p-3 rounded border">
                      <p className="mb-1"><strong>Cancha:</strong> {feedback.cancha?.nombre} - {feedback.cancha?.tipoEspacio?.nombre}</p>
                      <p className="mb-1">
                        <strong>Calificación:</strong> {feedback.calificacion ? `${feedback.calificacion}/5` : 'Sin calificación'}
                        {feedback.calificacion && (
                          <span className="ms-2">{getCalificacionStars(feedback.calificacion)}</span>
                        )}
                      </p>
                      <p className="mb-0"><strong>Fecha:</strong> {formatDate(feedback.fecha)}</p>
                    </div>
                  </div>

                  {/* Acciones */}
                  <div className="col-md-6">
                    <h6 className="fw-semibold mb-2">Acciones:</h6>
                    <div className="d-flex gap-2">
                      {/* Solo admin puede editar */}
                      {(rol === 'admin' || rol === 'administrador') && (
                        <button 
                          className="btn btn-outline-primary btn-sm"
                          onClick={() => onEdit(feedback)}
                        >
                          <i className="bi bi-pencil-square me-1"></i>Editar
                        </button>
                      )}
                      {/* Solo organizador puede responder */}
                      {rol === 'organizador' && !hasAdminResponse(feedback.respuesta) && (
                        <button 
                          className="btn btn-outline-info btn-sm"
                          onClick={() => onResponder(feedback)}
                        >
                          <i className="bi bi-chat-dots me-1"></i>Responder
                        </button>
                      )}
                      {/* Solo admin puede eliminar */}
                      {(rol === 'admin' || rol === 'administrador') && (
                        <button 
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => onDelete(feedback)}
                        >
                          <i className="bi bi-trash me-1"></i>Eliminar
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
} 
