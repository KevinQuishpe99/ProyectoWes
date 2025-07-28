import React from 'react';

export default function CanchasContador({ total, filtradas }) {
  return (
    <div className="row mb-3">
      <div className="col-12">
        <div className="d-flex justify-content-end">
          <small className="text-muted">
            {filtradas} de {total} canchas encontradas
          </small>
        </div>
      </div>
    </div>
  );
} 