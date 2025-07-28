import React from 'react';
import ReservasList from './ReservasList';

export default function ReservasAdminLista({ loading, reservas, onEdit, onDelete, rol }) {
  if (loading) {
    return <div className="text-center my-4"><span className="spinner-border"></span></div>;
  }
  return (
    <ReservasList reservas={reservas} onEdit={onEdit} onDelete={onDelete} rol={rol} />
  );
} 