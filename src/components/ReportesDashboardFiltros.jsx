import React from 'react';

export default function ReportesDashboardFiltros({ dateRange, setDateRange }) {
  return (
    <div className="row mb-4 align-items-end g-2">
      <div className="col-12 col-md-3">
        <label className="form-label">Desde</label>
        <input type="date" className="form-control" value={dateRange.from} onChange={e => setDateRange(r => ({ ...r, from: e.target.value }))} />
      </div>
      <div className="col-12 col-md-3">
        <label className="form-label">Hasta</label>
        <input type="date" className="form-control" value={dateRange.to} onChange={e => setDateRange(r => ({ ...r, to: e.target.value }))} />
      </div>
    </div>
  );
} 