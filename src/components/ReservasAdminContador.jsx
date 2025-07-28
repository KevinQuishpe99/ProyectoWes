import React from 'react';

export default function ReservasAdminContador({ total, filtradas }) {
  return (
    <div className="row mb-3">
      <div className="col-12">
        <div className="d-flex justify-content-end">
          <small className="text-muted">
            {filtradas} de {total} reservas encontradas
          </small>
        </div>
      </div>
    </div>
  );
} 