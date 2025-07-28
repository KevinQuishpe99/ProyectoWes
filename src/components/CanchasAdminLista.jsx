import React from 'react';
import CanchasList from './CanchasList';

export default function CanchasAdminLista({ loading, canchas, onEdit, onDelete, rol }) {
  if (loading) {
    return <div className="text-center my-4"><span className="spinner-border"></span></div>;
  }
  return (
    <CanchasList canchas={canchas} onEdit={onEdit} onDelete={onDelete} rol={rol} />
  );
} 