import React from 'react';

export default function TiposEspacioAdminFiltros({ filtroNombre, setFiltroNombre, limpiarFiltros }) {
  return (
    <div className="row g-2 mb-3 align-items-end">
      <div className="col-12 col-md-8">
        <label className="form-label">Buscar por nombre</label>
        <div className="input-group">
          <span className="input-group-text">
            <i className="bi bi-search"></i>
          </span>
          <input
            type="text"
            className="form-control"
            placeholder="Buscar por nombre..."
            value={filtroNombre}
            onChange={(e) => setFiltroNombre(e.target.value)}
          />
        </div>
      </div>
      <div className="col-12 col-md-4 d-flex justify-content-end align-items-end">
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