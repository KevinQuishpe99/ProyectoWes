import React from 'react';

export default function ReservasAdminFiltros({
  filtroUsuario,
  setFiltroUsuario,
  filtroCodigo,
  setFiltroCodigo,
  filtroFecha,
  setFiltroFecha,
  limpiarFiltros
}) {
  return (
    <div className="row g-2 mb-3">
      <div className="col-12 col-md-3">
        <label className="form-label">Filtrar por nombre de usuario</label>
        <input
          type="text"
          className="form-control"
          placeholder="Nombre de usuario..."
          value={filtroUsuario}
          onChange={e => setFiltroUsuario(e.target.value)}
        />
      </div>
      <div className="col-12 col-md-3">
        <label className="form-label">Filtrar por código único</label>
        <input type="text" className="form-control" placeholder="Código único..." value={filtroCodigo} onChange={e => setFiltroCodigo(e.target.value)} />
      </div>
      <div className="col-12 col-md-3">
        <label className="form-label">Filtrar por fecha</label>
        <input type="date" className="form-control" value={filtroFecha} onChange={e => setFiltroFecha(e.target.value)} />
      </div>
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