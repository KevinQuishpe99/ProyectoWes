import React from 'react';
import CanchaForm from './CanchaForm';

export default function CanchasAdminModal({ show, initialData, onSubmit, onCancel, loading }) {
  if (!show) return null;
  return (
    <div className="card p-4 shadow-sm mb-4">
      <CanchaForm
        initialData={initialData}
        onSubmit={onSubmit}
        onCancel={onCancel}
        loading={loading}
      />
    </div>
  );
} 