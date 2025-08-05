import React, { useState, useEffect } from 'react';
import FeedbackService from '../../servicios/feedback/feedbackService';

export default function FeedbackForm({ form, onChange, onSubmit, onCancel, editFeedback, usuarios, canchas, rol }) {
  const [calificacion, setCalificacion] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);

  useEffect(() => {
    if (editFeedback) {
      setCalificacion(editFeedback.calificacion || 0);
    }
  }, [editFeedback]);

  const handleCalificacionChange = (value) => {
    setCalificacion(value);
    onChange({ target: { name: 'calificacion', value: value.toString() } });
  };

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <i
          key={i}
          className={`bi ${i <= (hoveredStar || calificacion) ? 'bi-star-fill text-warning' : 'bi-star text-muted'}`}
          style={{ fontSize: '2rem', cursor: 'pointer' }}
          onMouseEnter={() => setHoveredStar(i)}
          onMouseLeave={() => setHoveredStar(0)}
          onClick={() => handleCalificacionChange(i)}
        ></i>
      );
    }
    return stars;
  };

  const getCalificacionText = () => {
    const value = hoveredStar || calificacion;
    switch (value) {
      case 1: return 'Muy malo';
      case 2: return 'Malo';
      case 3: return 'Regular';
      case 4: return 'Bueno';
      case 5: return 'Excelente';
      default: return 'Selecciona una calificación';
    }
  };

  return (
    <form onSubmit={onSubmit}>
      {/* Mostrar campos completos solo si NO es admin editando */}
      {!(editFeedback && rol === 'admin') && (
        <>
          {/* Solo mostrar selector de usuario si NO es rol usuario (es decir, si es admin) */}
          {rol !== 'usuario' && (
            <div className="row">
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">
                    <i className="bi bi-person me-1"></i>Usuario *
                  </label>
                  <select
                    className="form-select"
                    name="usuario_id"
                    value={form.usuario_id}
                    onChange={onChange}
                    required
                  >
                    <option value="">Selecciona un usuario</option>
                    {usuarios.map(usuario => (
                      <option key={usuario.id} value={usuario.id}>
                        {usuario.nombres} - {usuario.codigo}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">
                    <i className="bi bi-geo-alt me-1"></i>Cancha *
                  </label>
                  <select
                    className="form-select"
                    name="cancha_id"
                    value={form.cancha_id}
                    onChange={onChange}
                    required
                  >
                    <option value="">Selecciona una cancha</option>
                    {canchas.map(cancha => (
                      <option key={cancha.id} value={cancha.id}>
                        {cancha.nombre}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Si es rol usuario, mostrar solo el selector de cancha */}
          {rol === 'usuario' && (
            <div className="mb-3">
              <label className="form-label">
                <i className="bi bi-geo-alt me-1"></i>Cancha *
              </label>
              <select
                className="form-select"
                name="cancha_id"
                value={form.cancha_id}
                onChange={onChange}
                required
              >
                <option value="">Selecciona una cancha</option>
                {canchas.map(cancha => (
                  <option key={cancha.id} value={cancha.id}>
                    {cancha.nombre}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="mb-3">
            <label className="form-label">
              <i className="bi bi-star me-1"></i>Calificación *
            </label>
            <div className="text-center p-3 bg-light rounded">
              <div className="d-flex justify-content-center gap-1 mb-2">
                {renderStars()}
              </div>
              <p className="text-muted mb-0">{getCalificacionText()}</p>
            </div>
          </div>
        </>
      )}

      {/* Si es admin editando, mostrar información del feedback */}
      {editFeedback && rol === 'admin' && (
        <div className="alert alert-info mb-3">
          <h6><i className="bi bi-info-circle me-1"></i>Modo Administrador</h6>
          <p className="mb-1"><strong>Usuario:</strong> {editFeedback.usuario?.nombres}</p>
          <p className="mb-1"><strong>Cancha:</strong> {editFeedback.cancha?.nombre}</p>
          <p className="mb-0"><strong>Calificación:</strong> {editFeedback.calificacion}/5 ⭐</p>
        </div>
      )}

      <div className="mb-3">
        <label className="form-label">
          <i className="bi bi-chat-dots me-1"></i>Comentario *
        </label>
        <textarea
          className="form-control"
          name="comentario"
          value={form.comentario}
          onChange={onChange}
          rows="4"
          placeholder="Escribe tu comentario..."
          required
        />
      </div>

      {editFeedback && (
        <div className="mb-3">
          <label className="form-label">
            <i className="bi bi-reply me-1"></i>Respuesta (opcional)
          </label>
          <textarea
            className="form-control"
            name="respuesta"
            value={form.respuesta}
            onChange={onChange}
            rows="3"
            placeholder="Escribe una respuesta..."
          />
        </div>
      )}

      <div className="d-flex gap-2 justify-content-end">
        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={onCancel}
        >
          <i className="bi bi-x-circle me-1"></i>Cancelar
        </button>
        <button
          type="submit"
          className="btn btn-success"
        >
          <i className="bi bi-check-circle me-1"></i>
          {editFeedback ? 'Actualizar' : 'Crear'} Feedback
        </button>
      </div>
    </form>
  );
} 
