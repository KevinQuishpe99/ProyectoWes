import React from 'react';

export default function FeedbacksAdminFiltros({
  filtroCancha,
  setFiltroCancha,
  filtroCalificacion,
  setFiltroCalificacion,
  filtroFecha,
  setFiltroFecha,
  limpiarFiltros,
  canchas
}) {
  return (
    <div className="row g-2 mb-3">
      <div className="col-12 col-md-3">
        <label className="form-label">Filtrar por cancha</label>
        <select
          className="form-select"
          value={filtroCancha}
          onChange={e => setFiltroCancha(e.target.value)}
        >
          <option value="">Todas las canchas</option>
          {canchas.map(cancha => (
            <option key={cancha.id} value={cancha.id}>
              {cancha.nombre}
            </option>
          ))}
        </select>
      </div>
      <div className="col-12 col-md-3">
        <label className="form-label">Filtrar por calificación</label>
        <select
          className="form-select"
          value={filtroCalificacion}
          onChange={e => setFiltroCalificacion(e.target.value)}
        >
          <option value="">Todas las calificaciones</option>
          <option value="1">★ 1 - Muy malo</option>
          <option value="2">★★ 2 - Malo</option>
          <option value="3">★★★ 3 - Regular</option>
          <option value="4">★★★★ 4 - Bueno</option>
          <option value="5">★★★★★ 5 - Excelente</option>
        </select>
      </div>
      <div className="col-12 col-md-3">
        <label className="form-label">Filtrar por fecha</label>
        <input
          type="date"
          className="form-control"
          value={filtroFecha}
          onChange={e => setFiltroFecha(e.target.value)}
        />
      </div>
      <div className="col-12 col-md-3 d-flex align-items-end">
        <button
          className="btn btn-outline-secondary w-100"
          onClick={limpiarFiltros}
        >
          <i className="bi bi-arrow-clockwise me-1"></i> Limpiar Filtros
        </button>
      </div>
    </div>
  );
} 