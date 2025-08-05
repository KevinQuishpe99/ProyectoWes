import React, { useState, useEffect } from 'react';
import FeedbacksList from '../feedback/FeedbacksList';
import FeedbackForm from '../feedback/FeedbackForm';
import FeedbackService from '../../servicios/feedback/feedbackService';
import { getCanchas } from '../../servicios/canchas/canchasService';
import Swal from 'sweetalert2';

export default function FeedbackUsuario({ user }) {
  const [feedbacks, setFeedbacks] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [canchas, setCanchas] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({
    usuario_id: '',
    cancha_id: '',
    comentario: '',
    calificacion: '',
    respuesta: ''
  });

  const cargarFeedbacks = () => {
    // Cargar TODOS los feedbacks, no solo los del usuario
    FeedbackService.getFeedbacks().then(setFeedbacks);
  };

  const cargarDatos = async () => {
    try {
      console.log('🔍 Cargando datos para FeedbackUsuario...');
      const [feedbacksData, canchasData, usuariosData] = await Promise.all([
        FeedbackService.getFeedbacks(),
        getCanchas(),
        FeedbackService.getUsuarios()
      ]);
      console.log('✅ Feedbacks cargados:', feedbacksData.length);
      console.log('✅ Canchas cargadas:', canchasData.length, canchasData);
      console.log('✅ Usuarios cargados:', usuariosData.length);
      setFeedbacks(feedbacksData);
      setCanchas(canchasData);
      setUsuarios(usuariosData);
    } catch (error) {
      console.error('❌ Error cargando datos:', error);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, [user]);

  const handleNuevoFeedback = () => {
    // Pre-llenar el formulario con los datos del usuario logueado
    setForm({
      usuario_id: user.id.toString(),
      cancha_id: '',
      comentario: '',
      calificacion: '0',
      respuesta: ''
    });
    setMostrarModal(true);
    setError(null);
  };

  const handleCerrarModal = () => {
    setMostrarModal(false);
    setError(null);
    setForm({
      usuario_id: '',
      cancha_id: '',
      comentario: '',
      calificacion: '',
      respuesta: ''
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      await FeedbackService.createFeedback(form);
      Swal.fire({
        icon: 'success',
        title: '¡Feedback creado!',
        text: 'Tu feedback ha sido enviado correctamente',
        confirmButtonColor: '#3085d6'
      });
      handleCerrarModal();
      cargarFeedbacks();
    } catch (err) {
      console.error('Error creando feedback:', err);
      setError(err.response?.data?.message || 'Error al crear el feedback');
    }
  };

  return (
    <div>
      <h2 className="mb-4">Feedbacks</h2>
      <button className="btn btn-primary mb-3" onClick={handleNuevoFeedback}>
        <i className="bi bi-plus-lg me-1"></i> Nuevo Feedback
      </button>
      <FeedbacksList feedbacks={feedbacks} modoUsuario={true} rol="usuario" />
      {mostrarModal && (
        <div className="modal fade show" style={{ display: 'block', background: 'rgba(30,40,60,0.35)', position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 2000 }}>
          <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
            <div className="card shadow-lg p-4" style={{ minWidth: 500, maxWidth: 600, width: '100%' }}>
              <div className="modal-header">
                <h5 className="modal-title">Nuevo Feedback</h5>
                <button type="button" className="btn-close" onClick={handleCerrarModal}></button>
              </div>
              <div className="modal-body">
                {error && (
                  <div className="alert alert-danger text-center py-2 mb-3" role="alert">
                    <i className="bi bi-exclamation-triangle me-2"></i>
                    {error}
                  </div>
                )}
                <FeedbackForm
                  form={form}
                  onChange={handleChange}
                  onSubmit={handleSubmit}
                  onCancel={handleCerrarModal}
                  editFeedback={null}
                  usuarios={usuarios}
                  canchas={canchas}
                  rol="usuario"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 