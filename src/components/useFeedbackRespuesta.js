import { useState } from 'react';

export default function useFeedbackRespuesta(closeForm) {
  const [showResponder, setShowResponder] = useState(false);
  const [feedbackToRespond, setFeedbackToRespond] = useState(null);
  const [respuesta, setRespuesta] = useState('');

  const openResponder = (feedback) => {
    setFeedbackToRespond(feedback);
    setRespuesta(feedback.respuesta || '');
    setShowResponder(true);
    closeForm();
  };

  const closeResponder = () => {
    setShowResponder(false);
    setFeedbackToRespond(null);
    setRespuesta('');
  };

  return {
    showResponder,
    feedbackToRespond,
    respuesta,
    setRespuesta,
    openResponder,
    closeResponder
  };
} 