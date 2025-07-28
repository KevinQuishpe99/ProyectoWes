import React from 'react';

export default function ReportesDashboardHeader({ onDownloadPDF, onExportReservas, onExportEventos, onExportFeedbacks }) {
  return (
    <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-2">
      <h2 className="panel-title mb-0">Reportes del Sistema</h2>
      <div className="d-flex gap-2">
        <button className="btn btn-editar px-4" onClick={onDownloadPDF}>
          <i className="bi bi-file-earmark-arrow-down me-2"></i>
          Descargar PDF
        </button>
        <button className="btn btn-editar px-4" onClick={onExportReservas}>
          <i className="bi bi-file-earmark-excel me-2"></i>
          Exportar Reservas
        </button>
        <button className="btn btn-editar px-4" onClick={onExportEventos}>
          <i className="bi bi-file-earmark-excel me-2"></i>
          Exportar Eventos
        </button>
        <button className="btn btn-editar px-4" onClick={onExportFeedbacks}>
          <i className="bi bi-file-earmark-excel me-2"></i>
          Exportar Feedbacks
        </button>
      </div>
    </div>
  );
} 