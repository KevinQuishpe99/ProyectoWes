import React from 'react';
import EventosList from './EventosList';

export default function EventosAdminLista({ loading, eventos, onEdit, onDelete, rol }) {
  if (loading) {
    return <div className="text-center my-4"><span className="spinner-border"></span></div>;
  }
  return (
    <EventosList eventos={eventos} onEdit={onEdit} onDelete={onDelete} rol={rol} />
  );
} 