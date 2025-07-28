import React from 'react';

export default function TiposEspacioAdminBar({
  onNuevo,
  filtroNombre,
  setFiltroNombre,
  limpiarFiltros,
  total,
  filtrados
}) {
  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="panel-title mb-0">Tipos de Espacio</h2>
        <button className="btn btn-success" onClick={onNuevo}>
          <i className="bi bi-plus-lg me-1"></i> Nuevo Tipo
        </button>
      </div>
      <div className="row g-2 mb-3">
        <div className="col-12 col-md-6 col-lg-4">
          <label className="form-label">Buscar por nombre</label>
          <div className="input-group">
            <span className="input-group-text">
              <i className="bi bi-search"></i>
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Buscar tipo de espacio..."
              value={filtroNombre}
              onChange={e => setFiltroNombre(e.target.value)}
            />
          </div>
        </div>
        <div className="col-12 col-md-3 d-flex align-items-end">
          <button
            className="btn btn-outline-secondary w-100"
            onClick={limpiarFiltros}
          >
            <i className="bi bi-arrow-clockwise me-1"></i> Limpiar Filtros
          </button>
        </div>
        <div className="col-12 col-md-3 d-flex align-items-end justify-content-end">
          <small className="text-muted">
            {filtrados} de {total} tipos encontrados
          </small>
        </div>
      </div>
    </>
  );
} 