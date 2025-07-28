import React from 'react';

export default function EventosFiltros({
  filtroNombre,
  setFiltroNombre,
  filtroTipo,
  setFiltroTipo,
  filtroCancha,
  setFiltroCancha,
  filtroEstado,
  setFiltroEstado,
  filtroFecha,
  setFiltroFecha,
  limpiarFiltros,
  canchas,
  estadosEvento,
  tiposEvento
}) {
  return (
    <div className="row g-2 mb-3">
      <div className="col-12 col-md-2">
        <label className="form-label">Filtrar por nombre</label>
        <input
          type="text"
          className="form-control"
          placeholder="Nombre del evento..."
          value={filtroNombre}
          onChange={e => setFiltroNombre(e.target.value)}
        />
      </div>
      <div className="col-12 col-md-2">
        <label className="form-label">Filtrar por tipo</label>
        <select
          className="form-select"
          value={filtroTipo}
          onChange={e => setFiltroTipo(e.target.value)}
        >
          <option value="">Todos los tipos</option>
          {tiposEvento.map(tipo => (
            <option key={tipo} value={tipo}>{tipo}</option>
          ))}
        </select>
      </div>
      <div className="col-12 col-md-2">
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
      <div className="col-12 col-md-2">
        <label className="form-label">Filtrar por estado</label>
        <select
          className="form-select"
          value={filtroEstado}
          onChange={e => setFiltroEstado(e.target.value)}
        >
          <option value="">Todos los estados</option>
          {estadosEvento.map(estado => (
            <option key={estado.id} value={estado.id}>
              {estado.nombre}
            </option>
          ))}
        </select>
      </div>
      <div className="col-12 col-md-2">
        <label className="form-label">Filtrar por fecha</label>
        <input
          type="date"
          className="form-control"
          value={filtroFecha}
          onChange={e => setFiltroFecha(e.target.value)}
        />
      </div>
      <div className="col-12 col-md-2 d-flex align-items-end">
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