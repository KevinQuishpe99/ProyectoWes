import React, { useState } from 'react';
import FeedbackService from '../../servicios/feedback/feedbackService';

export default function FeedbackForm({ user, canchas, onClose, onFeedbackExitoso, setError }) {
  const [canchaId, setCanchaId] = useState('');
  const [comentario, setComentario] = useState('');
  const [calificacion, setCalificacion] = useState('');
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canchaId || !comentario || !calificacion) {
      setLocalError('Completa todos los campos');
      if (setError) setError('Completa todos los campos');
      return;
    }
    setLoading(true);
    setLocalError(null);
    if (setError) setError(null);
    try {
      await FeedbackService.createFeedback({ usuario_id: user.id, cancha_id: canchaId, comentario, calificacion });
      setLoading(false);
      if (onFeedbackExitoso) onFeedbackExitoso();
      onClose();
    } catch (err) {
      setLoading(false);
      const msg = err?.response?.data?.message || 'No se pudo enviar el feedback';
      setLocalError(msg);
      if (setError) setError(msg);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="modal-header">
        <h5 className="modal-title modal-title-llamativo">Nuevo Feedback</h5>
        <button type="button" className="btn-close" onClick={onClose}></button>
      </div>
      <div className="modal-body">
        {localError && (
          <div className="alert alert-danger text-center py-2 mb-3" role="alert">
            <i className="bi bi-exclamation-triangle me-2"></i>
            {localError}
          </div>
        )}
        <div className="mb-3">
          <label className="form-label">Cancha *</label>
          <select className="form-select" value={canchaId} onChange={e => setCanchaId(e.target.value)} required>
            <option value="">Selecciona una cancha</option>
            {canchas && canchas.map(cancha => (
              <option key={cancha.id} value={cancha.id}>{cancha.nombre}</option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label">Comentario *</label>
          <textarea className="form-control" value={comentario} onChange={e => setComentario(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Calificación *</label>
          <select className="form-select" value={calificacion} onChange={e => setCalificacion(e.target.value)} required>
            <option value="">Selecciona</option>
            {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>
      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-secondary" onClick={onClose}>Cancelar</button>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? <span className="spinner-border spinner-border-sm me-2"></span> : null}
          Enviar
        </button>
      </div>
    </form>
  );
} 
