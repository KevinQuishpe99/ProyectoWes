import React from 'react';

export default function TiposEspacioAdminContador({ total, filtrados }) {
  return (
    <div className="row mb-3">
      <div className="col-12">
        <div className="d-flex justify-content-end">
          <small className="text-muted">
            {filtrados} de {total} tipos encontrados
          </small>
        </div>
      </div>
    </div>
  );
} 