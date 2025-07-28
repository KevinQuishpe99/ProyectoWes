import React from 'react';

export default function EventoForm({ form, onChange, onSubmit, onCancel, editEvento, canchas, estadosEvento }) {
  const normalizarHora = (h) => h ? h.split(':').slice(0,2).join(':') : '';

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
          {editEvento ? 'Editar Evento' : 'Nuevo Evento'}
        </h4>
        
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Nombre del Evento *</label>
            <input
              type="text"
              className="form-control"
              name="nombre"
              value={form.nombre}
              onChange={onChange}
              required
              placeholder="Ej: Torneo de Fútbol"
            />
          </div>
          
          <div className="col-md-6 mb-3">
            <label className="form-label">Tipo de Evento *</label>
            <select
              className="form-select"
              name="tipo"
              value={form.tipo}
              onChange={onChange}
              required
            >
              <option value="">Selecciona el tipo</option>
              <option value="Torneo">Torneo</option>
              <option value="Entrenamiento">Entrenamiento</option>
              <option value="Exhibición">Exhibición</option>
              <option value="Clase">Clase</option>
              <option value="Competencia">Competencia</option>
              <option value="Otro">Otro</option>
            </select>
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label">Descripción</label>
          <textarea
            className="form-control"
            name="descripcion"
            value={form.descripcion}
            onChange={onChange}
            rows="3"
            placeholder="Descripción detallada del evento..."
          />
        </div>

        <div className="row">
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
          
          <div className="col-md-6 mb-3">
            <label className="form-label">Estado *</label>
            <select
              className="form-select"
              name="estado"
              value={form.estado}
              onChange={onChange}
              required
            >
              <option value="">Selecciona el estado</option>
              {estadosEvento.map(estado => (
                <option key={estado.id} value={estado.id}>
                  {estado.nombre}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Fecha de Inicio *</label>
            <input
              type="date"
              className="form-control"
              name="fecha_inicio"
              value={form.fecha_inicio}
              onChange={onChange}
              required
            />
          </div>
          
          <div className="col-md-6 mb-3">
            <label className="form-label">Fecha de Fin *</label>
            <input
              type="date"
              className="form-control"
              name="fecha_fin"
              value={form.fecha_fin}
              onChange={onChange}
              required
            />
          </div>
        </div>

        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Hora de Inicio *</label>
            <input
              type="time"
              className="form-control"
              name="hora_inicio"
              value={normalizarHora(form.hora_inicio)}
              onChange={onChange}
              required
            />
          </div>
          
          <div className="col-md-6 mb-3">
            <label className="form-label">Hora de Fin *</label>
            <input
              type="time"
              className="form-control"
              name="hora_fin"
              value={normalizarHora(form.hora_fin)}
              onChange={onChange}
              required
            />
          </div>
        </div>

        <div className="d-flex gap-2 justify-content-end">
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            Cancelar
          </button>
          <button type="submit" className="btn btn-primary">
            {editEvento ? 'Actualizar' : 'Crear'} Evento
          </button>
        </div>
      </form>
    </div>
  );
} 