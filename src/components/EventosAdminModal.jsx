import React from 'react';
import EventoForm from './EventoForm';

export default function EventosAdminModal({ show, form, onChange, onSubmit, onCancel, editEvento, canchas, estadosEvento }) {
  if (!show) return null;
  return (
    <div className="card p-4 shadow-sm mb-4">
      <EventoForm
        form={form}
        onChange={onChange}
        onSubmit={onSubmit}
        onCancel={onCancel}
        editEvento={editEvento}
        canchas={canchas}
        estadosEvento={estadosEvento}
      />
    </div>
  );
} 