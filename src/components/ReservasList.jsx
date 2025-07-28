import React from 'react';

export default function ReservasList({ reservas, onEdit, onDelete, rol }) {
  const formatHora = (hora) => {
    if (!hora) return '-';
    const [h] = hora.split(':');
    return `${parseInt(h, 10)}:00`;
  };

  if (!reservas || reservas.length === 0) {
    return (
      <div className="text-center py-5">
        <i className="bi bi-calendar-x display-1 text-muted"></i>
        <h5 className="mt-3 text-muted">No hay reservas</h5>
      </div>
    );
  }

  return (
    <div className="row g-4">
      {reservas.map((r) => (
        <div key={r.id} className="col-12 col-md-6 col-lg-4">
          <div className="card bg-body border border-dark shadow-sm p-4 h-100">
            <div className="card-body p-0 d-flex flex-column h-100">
              <h5 className="card-title mb-2">{r.cancha?.nombre || r.canchaNombre || '-'}</h5>
              <div className="mb-2">
                <span className="fw-semibold">Usuario: </span>
                <span>{r.usuario?.nombres || r.usuarioNombre || '-'}</span>
              </div>
              <div className="mb-2">
                <span className="fw-semibold">Fecha: </span>
                <span>{r.fecha}</span>
              </div>
              <div className="mb-2">
                <span className="fw-semibold">Hora Inicio: </span>
                <span>{formatHora(r.hora_inicio)}</span>
              </div>
              <div className="mb-2">
                <span className="fw-semibold">Hora Fin: </span>
                <span>{formatHora(r.hora_fin)}</span>
              </div>
              <div className="mb-2">
                <span className="fw-semibold">Estado: </span>
                <span>{r.estado}</span>
              </div>
              <div className="d-flex gap-2 mt-auto">
                <button className="btn btn-editar btn-sm flex-fill" onClick={() => onEdit(r)}>
                  <i className="bi bi-pencil-square me-1"></i>Editar
                </button>
                {rol !== 'organizador' && (
                  <button className="btn btn-danger btn-sm flex-fill" onClick={() => onDelete(r)}>
                    <i className="bi bi-trash me-1"></i>Eliminar
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
} 