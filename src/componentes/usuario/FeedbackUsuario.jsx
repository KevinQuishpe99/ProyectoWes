import React, { useState, useEffect } from 'react';
import FeedbacksList from '../feedback/FeedbacksList';
import FeedbackForm from '../feedback/FeedbackForm';
import { getFeedbacksPorUsuario } from '../../servicios/feedback/feedbackService';
import { getCanchas } from '../../servicios/canchas/canchasService';

export default function FeedbackUsuario({ user }) {
  const [feedbacks, setFeedbacks] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [canchas, setCanchas] = useState([]);
  const [error, setError] = useState(null);

  const cargarFeedbacks = () => {
    if (user) getFeedbacksPorUsuario(user.id).then(setFeedbacks);
  };

  useEffect(() => {
    cargarFeedbacks();
    getCanchas().then(setCanchas);
  }, [user]);

  const handleNuevoFeedback = () => {
    setMostrarModal(true);
    setError(null);
  };
  const handleCerrarModal = () => {
    setMostrarModal(false);
    setError(null);
  };
  const handleFeedbackExitoso = () => cargarFeedbacks();

  return (
    <div>
      <h2 className="mb-4">Mi Feedback</h2>
      <button className="btn btn-primary mb-3" onClick={handleNuevoFeedback}>
        <i className="bi bi-plus-lg me-1"></i> Nuevo Feedback
      </button>
      <FeedbacksList feedbacks={feedbacks} modoUsuario={true} />
      {mostrarModal && (
        <div className="modal fade show" style={{ display: 'block', background: 'rgba(30,40,60,0.35)', position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 2000 }}>
          <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
            <div className="card shadow-lg p-0" style={{ minWidth: 380, maxWidth: 420, width: '100%' }}>
              <FeedbackForm
                user={user}
                canchas={canchas}
                onClose={handleCerrarModal}
                onFeedbackExitoso={handleFeedbackExitoso}
                setError={setError}
              />
              {error && (
                <div className="alert alert-danger text-center py-2 mb-3" role="alert">
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  {error}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 