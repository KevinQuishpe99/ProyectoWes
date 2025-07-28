import React from 'react';
import FeedbackForm from './FeedbackForm';

export default function FeedbacksAdminModal({ show, form, onChange, onSubmit, onCancel, editFeedback, usuarios, canchas }) {
  if (!show) return null;
  return (
    <div className="card p-4 shadow-sm mb-4">
      <FeedbackForm
        form={form}
        onChange={onChange}
        onSubmit={onSubmit}
        onCancel={onCancel}
        editFeedback={editFeedback}
        usuarios={usuarios}
        canchas={canchas}
      />
    </div>
  );
} 