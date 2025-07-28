import React from 'react';

export default function TiposEspacioList({ tipos, onEdit, onDelete, rol }) {
  return (
    <div className="row g-4">
      {tipos.map((tipo) => (
        <div key={tipo.id} className="col-12 col-md-6 col-lg-4">
          <div className="card bg-body border border-dark shadow-sm p-4 h-100">
            <div className="card-body p-0 d-flex flex-column h-100">
              <div className="d-flex align-items-center mb-3">
                <div className="flex-shrink-0 me-3">
                  {tipo.imagen ? (
                    <img 
                      src={`data:image/jpeg;base64,${tipo.imagen}`} 
                      alt={tipo.nombre} 
                      className="rounded"
                      style={{ 
                        width: 60, 
                        height: 60, 
                        objectFit: 'cover',
                        border: '1px solid var(--bs-border-color, #dee2e6)'
                      }} 
                    />
                  ) : (
                    <div 
                      className="rounded d-flex align-items-center justify-content-center bg-body-tertiary"
                      style={{ 
                        width: 60, 
                        height: 60, 
                        border: '1px solid var(--bs-border-color, #dee2e6)'
                      }}
                    >
                      <i className="bi bi-image text-muted" style={{ fontSize: '1.5rem' }}></i>
                    </div>
                  )}
                </div>
                <div className="flex-grow-1">
                  <h5 className="card-title mb-1 fw-bold text-primary">{tipo.nombre}</h5>
                  <small className="text-muted">Tipo de Espacio</small>
                </div>
              </div>
              {tipo.descripcion && (
                <p className="card-text text-muted mb-3" style={{ fontSize: '0.9rem' }}>
                  {tipo.descripcion}
                </p>
              )}
              <div className="d-flex gap-2 mt-auto">
                <button 
                  className="btn btn-editar btn-sm flex-fill" 
                  onClick={() => onEdit(tipo)}
                  title="Editar"
                >
                  <i className="bi bi-pencil-square me-1"></i>
                  Editar
                </button>
                {rol !== 'organizador' && (
                  <button 
                    className="btn btn-danger btn-sm flex-fill" 
                    onClick={() => onDelete(tipo.id)}
                    title="Eliminar"
                  >
                    <i className="bi bi-trash me-1"></i>
                    Eliminar
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
      {tipos.length === 0 && (
        <div className="col-12">
          <div className="text-center py-5">
            <i className="bi bi-inbox text-muted" style={{ fontSize: '3rem' }}></i>
            <h5 className="text-muted mt-3">No hay tipos de espacio</h5>
            <p className="text-muted">Crea el primer tipo de espacio para comenzar</p>
          </div>
        </div>
      )}
    </div>
  );
} 