import React from 'react';

export default function ReportesDashboardModal({ open, title, data, onClose }) {
  if (!open) return null;
  return (
    <div className="modal fade show d-block" tabIndex="-1" style={{ background: 'rgba(0,0,0,0.2)' }}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{title}</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            {data.length === 0 && <div className="text-muted">No hay datos para mostrar.</div>}
            {data.length > 0 && (
              <table className="table table-sm table-bordered">
                <thead>
                  <tr>
                    {Object.keys(data[0]).map(key => <th key={key}>{key}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {data.map((row, idx) => (
                    <tr key={idx}>
                      {Object.values(row).map((val, i) => <td key={i}>{String(val)}</td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 