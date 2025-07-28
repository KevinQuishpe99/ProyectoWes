import React from 'react';
import ReservaForm from './ReservaForm';

export default function ReservasAdminModal({ show, form, onChange, onSubmit, onCancel, editReserva, canchas, usuarios, estadosReserva, loading }) {
  if (!show) return null;
  return (
    <div className="card p-4 shadow-sm mb-4">
      <ReservaForm
        form={form}
        onChange={onChange}
        onSubmit={onSubmit}
        onCancel={onCancel}
        editReserva={editReserva}
        canchas={canchas}
        usuarios={usuarios}
        estadosReserva={estadosReserva}
        loading={loading}
      />
    </div>
  );
} 