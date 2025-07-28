import React from 'react';

export default function CanchasFiltros({
  filtroNombre,
  setFiltroNombre,
  filtroTipo,
  setFiltroTipo,
  filtroEstado,
  setFiltroEstado,
  limpiarFiltros,
  tiposEspacio,
  estadosCancha
}) {
  return (
    <div className="row g-2 mb-3">
      {/* Filtro por nombre */}
      <div className="col-12 col-md-3">
        <label className="form-label">Buscar por nombre</label>
        <div className="input-group">
          <span className="input-group-text">
            <i className="bi bi-search"></i>
          </span>
          <input
            type="text"
            className="form-control"
            placeholder="Buscar cancha..."
            value={filtroNombre}
            onChange={(e) => setFiltroNombre(e.target.value)}
          />
        </div>
      </div>
      {/* Filtro por tipo */}
      <div className="col-12 col-md-3">
        <label className="form-label">Filtrar por tipo</label>
        <select className="form-select" value={filtroTipo} onChange={e => setFiltroTipo(e.target.value)}>
          <option value="">Todos</option>
          {tiposEspacio.map(t => <option key={t.id} value={t.id}>{t.nombre}</option>)}
        </select>
      </div>
      {/* Filtro por estado */}
      <div className="col-12 col-md-3">
        <label className="form-label">Filtrar por estado</label>
        <select className="form-select" value={filtroEstado} onChange={e => setFiltroEstado(e.target.value)}>
          <option value="">Todos</option>
          {estadosCancha.map(e => <option key={e.id} value={e.id}>{e.nombre}</option>)}
        </select>
      </div>
      {/* Boton limpiar filtros */}
      <div className="col-12 col-md-3 d-flex justify-content-end align-items-end">
        <button
          className="btn btn-outline-secondary px-4"
          style={{ minWidth: 180 }}
          onClick={limpiarFiltros}
        >
          <i className="bi bi-arrow-clockwise me-1"></i> Limpiar Filtros
        </button>
      </div>
    </div>
  );
} 