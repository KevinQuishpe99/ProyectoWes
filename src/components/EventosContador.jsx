import React from 'react';

export default function EventosContador({ total, filtrados }) {
  return (
    <div className="row mb-3">
      <div className="col-12">
        <div className="d-flex justify-content-end">
          <small className="text-muted">
            {filtrados} de {total} eventos encontrados
          </small>
        </div>
      </div>
    </div>
  );
} 