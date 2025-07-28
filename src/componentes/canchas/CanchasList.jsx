import React from 'react';

const CanchasList = ({ canchas, onEdit, onDelete, rol }) => {
  if (!canchas || canchas.length === 0) {
    return <div className="alert alert-info">No hay canchas registradas.</div>;
  }
  return (
    <div className="row g-4">
      {canchas.map((cancha) => (
        <div className="col-12 col-md-6 col-lg-4" key={cancha.id}>
          <div className="card bg-body border border-dark shadow-sm p-4 h-100">
            <div className="card-body p-0 d-flex flex-column h-100">
              <h5 className="card-title mb-2">{cancha.nombre}</h5>
              <p className="card-text mb-1"><b>Tipo:</b> {cancha.tipoEspacioNombre}</p>
              <p className="card-text mb-1"><b>Estado:</b> {cancha.estadoCanchaNombre}</p>
              <div className="d-flex gap-2 mt-3">
                <button className="btn btn-editar btn-sm flex-fill" onClick={() => onEdit(cancha)}>
                  <i className="bi bi-pencil-square me-1"></i>Editar
                </button>
                {rol !== 'organizador' && (
                  <button className="btn btn-danger btn-sm flex-fill" onClick={() => onDelete(cancha)}>
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
};

export default CanchasList; 
