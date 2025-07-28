import React from 'react';
import FeedbacksList from './FeedbacksList';

export default function FeedbacksAdminLista({ loading, feedbacks, onEdit, onDelete, onResponder, rol }) {
  if (loading) {
    return <div className="text-center my-4"><span className="spinner-border"></span></div>;
  }
  return (
    <FeedbacksList feedbacks={feedbacks} onEdit={onEdit} onDelete={onDelete} onResponder={onResponder} rol={rol} />
  );
} 