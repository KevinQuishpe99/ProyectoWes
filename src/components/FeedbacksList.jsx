import React from 'react';

export default function FeedbacksList({ feedbacks, onEdit, onDelete, onResponder, rol }) {
  const getCalificacionStars = (calificacion) => {
    if (!calificacion) return <span className="text-muted">Sin calificación</span>;
    return '\u2b50'.repeat(calificacion) + ' '.repeat(5 - calificacion);
  };

  const getCalificacionColor = (calificacion) => {
    if (!calificacion) return 'text-muted';
    if (calificacion >= 4) return 'text-success';
    if (calificacion >= 3) return 'text-warning';
    return 'text-danger';
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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

  return (
    <div>
      <div className="row g-4">
        {feedbacks.map((feedback) => {
          return (
            <div key={feedback.id} className="col-12 col-md-6 col-lg-4">
              <div className="card bg-body border border-dark shadow-sm p-4 h-100">
                <div className="card-header bg-transparent border-0 pb-0">
                  <div className="d-flex justify-content-between align-items-start">
                    <div className="d-flex align-items-center gap-2">
                      <i className="bi bi-person-circle text-primary fs-4"></i>
                      <div>
                        <h6 className="mb-0 fw-bold">{feedback.usuario?.nombres}</h6>
                        <small className="text-muted">{feedback.usuario?.codigo}</small>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="card-body">
                  <div className="mb-3 p-2 bg-light rounded">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <i className="bi bi-calendar-event text-primary me-1"></i>
                        <small className="fw-semibold">{formatDate(feedback.fecha)}</small>
                      </div>
                      <div>
                        <small className="text-muted">{getTimeAgo(feedback.fecha)}</small>
                      </div>
                    </div>
                  </div>

                  <div className="mb-3">
                    <div className="d-flex align-items-center gap-2 mb-2">
                      <i className="bi bi-geo-alt text-primary"></i>
                      <span className="fw-semibold">{feedback.cancha?.nombre}</span>
                    </div>
                    <small className="text-muted">{feedback.cancha?.tipoEspacio?.nombre}</small>
                  </div>

                  <div className="mb-3">
                    <div className="d-flex align-items-center gap-2 mb-1">
                      <i className="bi bi-star text-warning"></i>
                      <span className={`fw-semibold ${getCalificacionColor(feedback.calificacion)}`}>
                        {getCalificacionStars(feedback.calificacion)}
                      </span>
                    </div>
                  </div>

                  {feedback.comentario && (
                    <div className="mb-3">
                      <h6 className="fw-semibold mb-2">Comentario:</h6>
                      <p className="text-muted small mb-0">{feedback.comentario}</p>
                    </div>
                  )}

                  {hasAdminResponse(feedback.respuesta) && (
                    <div className="mb-3">
                      <h6 className="fw-semibold mb-2 text-info">
                        <i className="bi bi-shield-check me-1"></i>
                        Respuesta:
                      </h6>
                      <div className="bg-info bg-opacity-10 p-3 rounded border-start border-info border-3">
                        <p className="text-info small mb-0">{feedback.respuesta}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer con acciones */}
                <div className="card-footer bg-transparent border-0 pt-0">
                  <div className="d-flex gap-2">
                    {rol !== 'organizador' && (
                      <button 
                        className="btn btn-editar btn-sm flex-fill"
                        onClick={() => onEdit(feedback)}
                      >
                        <i className="bi bi-pencil-square me-1"></i>Editar
                      </button>
                    )}
                    {rol === 'organizador' && !hasAdminResponse(feedback.respuesta) && (
                      <button 
                        className="btn btn-editar btn-sm flex-fill"
                        onClick={() => onResponder(feedback)}
                      >
                        <i className="bi bi-pencil-square me-1"></i>Responder
                      </button>
                    )}
                    {rol !== 'organizador' && (
                      <button 
                        className="btn btn-danger btn-sm flex-fill"
                        onClick={() => onDelete(feedback)}
                      >
                        <i className="bi bi-trash me-1"></i>Eliminar
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
} 