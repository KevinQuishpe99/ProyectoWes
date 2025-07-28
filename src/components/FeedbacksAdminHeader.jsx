import React from 'react';

export default function FeedbacksAdminHeader({ onNuevo }) {
  return (
    <div className="d-flex justify-content-between align-items-center mb-4">
      <h2 className="panel-title mb-0">Feedback</h2>
      <button className="btn btn-success" onClick={onNuevo}>
        <i className="bi bi-plus-lg me-1"></i> Nuevo Feedback
      </button>
    </div>
  );
} 