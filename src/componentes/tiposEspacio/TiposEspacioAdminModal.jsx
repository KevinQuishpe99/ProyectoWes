import React from 'react';
import TipoEspacioForm from './TipoEspacioForm';

export default function TiposEspacioAdminModal({ show, form, onChange, onSubmit, onCancel, editTipo }) {
  if (!show) return null;
  return (
    <div className="modal fade show d-block" tabIndex="-1" style={{ background: 'rgba(0,0,0,0.2)' }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <TipoEspacioForm
            form={form}
            onChange={onChange}
            onSubmit={onSubmit}
            onCancel={onCancel}
            editTipo={editTipo}
          />
        </div>
      </div>
    </div>
  );
} 