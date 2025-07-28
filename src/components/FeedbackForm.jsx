import React from 'react';

export default function FeedbackForm({ form, onChange, onSubmit, onCancel, editFeedback, usuarios, canchas }) {
  return (
    <div className="position-relative">
      <button
        type="button"
        className="btn-close position-absolute"
        style={{ top: -10, right: -10, zIndex: 10, backgroundColor: 'white', borderRadius: '50%', padding: '8px' }}
        onClick={onCancel}
        aria-label="Cerrar"
      ></button>
      
      <form onSubmit={onSubmit}>
        <h4 className="modal-title-llamativo mb-3">
          {editFeedback ? 'Editar Feedback' : 'Nuevo Feedback'}
        </h4>
        
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Usuario *</label>
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
                  {usuario.nombres} ({usuario.codigo})
                </option>
              ))}
            </select>
          </div>
          
          <div className="col-md-6 mb-3">
            <label className="form-label">Cancha *</label>
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
                  {cancha.nombre} - {cancha.tipoEspacio?.nombre}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label">Comentario</label>
          <textarea
            className="form-control"
            name="comentario"
            value={form.comentario}
            onChange={onChange}
            rows="4"
            placeholder="Escribe tu comentario sobre la cancha..."
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Calificación</label>
          <select
            className="form-select"
            name="calificacion"
            value={form.calificacion}
            onChange={onChange}
          >
            <option value="">Sin calificación</option>
            <option value="1">⭐ 1 - Muy malo</option>
            <option value="2">⭐⭐ 2 - Malo</option>
            <option value="3">⭐⭐⭐ 3 - Regular</option>
            <option value="4">⭐⭐⭐⭐ 4 - Bueno</option>
            <option value="5">⭐⭐⭐⭐⭐ 5 - Excelente</option>
          </select>
        </div>

        {editFeedback && (
          <div className="mb-3">
            <label className="form-label">
              <i className="bi bi-shield-check me-1 text-info"></i>
              Respuesta del Administrador
            </label>
            <textarea
              className="form-control"
              name="respuesta"
              value={form.respuesta}
              onChange={onChange}
              rows="3"
              placeholder="Respuesta del administrador (opcional)..."
            />
            <small className="text-muted">
              Este campo permite editar la respuesta del administrador directamente
            </small>
          </div>
        )}

        <div className="d-flex gap-2 justify-content-end">
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            Cancelar
          </button>
          <button type="submit" className="btn btn-primary">
            {editFeedback ? 'Actualizar' : 'Crear'} Feedback
          </button>
        </div>
      </form>
    </div>
  );
} 