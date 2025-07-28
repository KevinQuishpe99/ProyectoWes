import React from 'react';

const CanchaCard = ({ cancha, onEdit, onDelete }) => {
  return (
    <div className="card bg-body h-100 shadow-sm rounded border-0">
      {cancha.imagen && typeof cancha.imagen === 'string' && (
        <img
          src={`data:image/jpeg;base64,${cancha.imagen}`}
          alt={cancha.nombre}
          className="card-img-top"
          style={{ objectFit: 'cover', height: 180 }}
        />
      )}
      <div className="card-body">
        <h5 className="card-title mb-1">{cancha.nombre}</h5>
        <div className="mb-2 text-muted small">
          {cancha.tipoEspacioNombre || cancha.tipoEspacio?.nombre || '-'}
        </div>
        <div className="mb-2 d-flex gap-2 flex-wrap">
          <span className="badge bg-success fw-semibold px-3 py-2">
            Capacidad: {cancha.capacidad}
          </span>
          <span className="badge bg-info fw-semibold px-3 py-2">
            {cancha.estadoCanchaNombre ? cancha.estadoCanchaNombre.charAt(0).toUpperCase() + cancha.estadoCanchaNombre.slice(1) : '-'}
          </span>
        </div>
        <div className="mb-2">
          <i className="bi bi-geo-alt-fill me-1"></i>
          <span>{cancha.ubicacion_referencia || '-'}</span>
        </div>
        {cancha.descripcion && (
          <p className="card-text small text-muted">{cancha.descripcion}</p>
        )}
      </div>
      {(onEdit || onDelete) && (
        <div className="card-footer bg-transparent border-0 d-flex justify-content-end gap-2">
          {onEdit && (
            <button className="btn btn-warning btn-sm" onClick={() => onEdit(cancha)}>
              <i className="bi bi-pencil me-1"></i>Editar
            </button>
          )}
          {onDelete && (
            <button className="btn btn-danger btn-sm" onClick={() => onDelete(cancha)}>
              <i className="bi bi-trash me-1"></i>Eliminar
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default CanchaCard; 