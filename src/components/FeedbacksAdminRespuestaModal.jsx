import React from 'react';

export default function FeedbacksAdminRespuestaModal({ show, feedbackToRespond, respuesta, setRespuesta, onClose, onSubmit }) {
  if (!show) return null;
  return (
    <div className="card p-4 shadow-sm mb-4">
      <div className="position-relative">
        <button
          type="button"
          className="btn-close position-absolute"
          style={{ top: -10, right: -10, zIndex: 10, backgroundColor: 'white', borderRadius: '50%', padding: '8px' }}
          onClick={onClose}
          aria-label="Cerrar"
        ></button>
        <form onSubmit={onSubmit}>
          <h4 className="modal-title-llamativo mb-3">
            {feedbackToRespond?.respuesta ? 'Editar Respuesta' : 'Responder Feedback'}
          </h4>
          <div className="mb-3">
            <label className="form-label fw-semibold">Usuario:</label>
            <p className="text-muted">{feedbackToRespond?.usuario?.nombres}</p>
          </div>
          <div className="mb-3">
            <label className="form-label fw-semibold">Cancha:</label>
            <p className="text-muted">{feedbackToRespond?.cancha?.nombre}</p>
          </div>
          {feedbackToRespond?.comentario && (
            <div className="mb-3">
              <label className="form-label fw-semibold">Comentario original:</label>
              <div className="bg-light p-3 rounded">
                <p className="text-muted mb-0">{feedbackToRespond.comentario}</p>
              </div>
            </div>
          )}
          <div className="mb-3">
            <label className="form-label">
              {feedbackToRespond?.respuesta ? 'Tu respuesta (editar):' : 'Tu respuesta:'} *
            </label>
            <textarea
              className="form-control"
              value={respuesta}
              onChange={e => setRespuesta(e.target.value)}
              rows="4"
              placeholder="Escribe tu respuesta como administrador..."
              required
            />
          </div>
          <div className="d-flex gap-2 justify-content-end">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-info">
              {feedbackToRespond?.respuesta ? 'Actualizar Respuesta' : 'Enviar Respuesta'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 