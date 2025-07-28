import { useState } from 'react';

const initialForm = {
  usuario_id: '',
  cancha_id: '',
  comentario: '',
  calificacion: '',
  respuesta: ''
};

export default function useFeedbackForm() {
  const [showForm, setShowForm] = useState(false);
  const [editFeedback, setEditFeedback] = useState(null);
  const [form, setForm] = useState(initialForm);

  const openForm = (feedback = null) => {
    setEditFeedback(feedback);
    if (feedback) {
      setForm({
        usuario_id: feedback.usuario_id?.toString() || '',
        cancha_id: feedback.cancha_id?.toString() || '',
        comentario: feedback.comentario || '',
        calificacion: feedback.calificacion?.toString() || '',
        respuesta: feedback.respuesta || ''
      });
    } else {
      setForm(initialForm);
    }
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditFeedback(null);
    setForm(initialForm);
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  return {
    showForm,
    editFeedback,
    form,
    openForm,
    closeForm,
    handleChange,
    setForm
  };
} 