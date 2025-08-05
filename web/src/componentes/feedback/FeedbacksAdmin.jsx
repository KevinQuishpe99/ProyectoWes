import React, { useEffect, useState } from 'react';
import FeedbacksList from './FeedbacksList';
import FeedbackForm from './FeedbackForm';
import Swal from 'sweetalert2';
import FeedbackService from '../../servicios/feedback/feedbackService';
import { showSuccess, showError, showDeleteConfirm, showDeleteError } from '../../utils/notifications';

export default function FeedbacksAdmin({ rol }) {
  const [feedbacks, setFeedbacks] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [canchas, setCanchas] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showResponder, setShowResponder] = useState(false);
  const [editFeedback, setEditFeedback] = useState(null);
  const [feedbackToRespond, setFeedbackToRespond] = useState(null);
  const [form, setForm] = useState({
    usuario_id: '',
    cancha_id: '',
    comentario: '',
    calificacion: '',
    respuesta: ''
  });
  const [respuesta, setRespuesta] = useState('');
  const [filtroCancha, setFiltroCancha] = useState('');
  const [filtroCalificacion, setFiltroCalificacion] = useState('');
  const [filtroFecha, setFiltroFecha] = useState('');

  const fetchAll = async () => {
    try {
      const [feedbacks, usuarios, canchas] = await Promise.all([
        FeedbackService.getFeedbacks(),
        FeedbackService.getUsuarios(),
        FeedbackService.getCanchas(),
      ]);
      setFeedbacks(feedbacks);
      setUsuarios(usuarios);
      setCanchas(canchas);
    } catch (error) {
      console.error('Error al cargar datos:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error al cargar los datos',
        confirmButtonColor: '#d32f2f'
      });
    }
  };

  const fetchFeedbacksConFiltros = async () => {
    try {
      const params = {};
      if (filtroCancha) params.cancha_id = filtroCancha;
      if (filtroCalificacion) params.calificacion = filtroCalificacion;
      if (filtroFecha) params.fecha = filtroFecha;

      const feedbacks = await FeedbackService.getFeedbacks(params);
      setFeedbacks(feedbacks);
    } catch (error) {
      console.error('Error al filtrar feedbacks:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error al aplicar filtros',
        confirmButtonColor: '#d32f2f'
      });
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  useEffect(() => {
    // Aplicar filtros automáticamente cuando cambien
    if (filtroCancha || filtroCalificacion || filtroFecha) {
      fetchFeedbacksConFiltros();
    } else {
      fetchAll();
    }
  }, [filtroCancha, filtroCalificacion, filtroFecha]);

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
      setForm({
        usuario_id: '',
        cancha_id: '',
        comentario: '',
        calificacion: '',
        respuesta: ''
      });
    }
    setShowForm(true);
    setShowResponder(false);
  };

  const openResponder = (feedback) => {
    setFeedbackToRespond(feedback);
    setRespuesta(feedback.respuesta || '');
    setShowResponder(true);
    setShowForm(false);
  };

  const closeForm = () => {
    setShowForm(false);
    setShowResponder(false);
    setEditFeedback(null);
    setFeedbackToRespond(null);
    setForm({
      usuario_id: '',
      cancha_id: '',
      comentario: '',
      calificacion: '',
      respuesta: ''
    });
    setRespuesta('');
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      let formData;

      if (editFeedback) {
        // Si es admin editando, solo enviar comentario y respuesta
        formData = {
          comentario: form.comentario,
          respuesta: form.respuesta
        };
        await FeedbackService.updateFeedback(editFeedback.id, formData);
        showSuccess('¡Actualizado!', 'Feedback actualizado correctamente');
      } else {
        // Si es crear nuevo feedback, enviar todos los campos
        formData = {
          ...form,
          usuario_id: parseInt(form.usuario_id),
          cancha_id: parseInt(form.cancha_id),
          calificacion: form.calificacion ? parseInt(form.calificacion) : null
        };
        await FeedbackService.createFeedback(formData);
        showSuccess('¡Creado!', 'Feedback creado correctamente');
      }
      fetchFeedbacksConFiltros();
      closeForm();
    } catch (err) {
      showError('Error', err.response?.data?.message || 'Error al guardar el feedback');
    }
  };

  const handleResponder = async e => {
    e.preventDefault();
    if (!respuesta.trim()) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Debes escribir una respuesta',
        confirmButtonColor: '#d32f2f'
      });
      return;
    }

    try {
      await FeedbackService.responderFeedback(feedbackToRespond.id, respuesta);
      showSuccess('¡Respuesta enviada!', 'Respuesta enviada correctamente');
      fetchFeedbacksConFiltros();
      closeForm();
    } catch (err) {
      showError('Error', err.response?.data?.message || 'Error al enviar la respuesta');
    }
  };

  const handleDelete = feedback => {
    showDeleteConfirm(feedback.usuario?.nombres || 'feedback', 'feedback').then(async (result) => {
      if (result.isConfirmed) {
        try {
          await FeedbackService.deleteFeedback(feedback.id);
          fetchFeedbacksConFiltros();
          showSuccess('¡Eliminado!', 'Feedback eliminado correctamente');
        } catch (err) {
          console.error('Error eliminando feedback:', err);
          
          // Mostrar mensaje específico del backend si está disponible
          const errorMessage = err.response?.data?.message || 'Error al eliminar el feedback';
          const errorDetails = err.response?.data?.details || '';
          
          showError('Error al eliminar', errorMessage);
        }
      }
    });
  };

  const limpiarFiltros = () => {
    setFiltroCancha('');
    setFiltroCalificacion('');
    setFiltroFecha('');
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="panel-title mb-0">Feedback</h2>
      </div>

      {/* Filtros */}
      <div className="row g-2 mb-3">
        <div className="col-12 col-md-3">
          <label className="form-label">Filtrar por cancha</label>
          <select
            className="form-select"
            value={filtroCancha}
            onChange={e => setFiltroCancha(e.target.value)}
          >
            <option value="">Todas las canchas</option>
            {canchas.map(cancha => (
              <option key={cancha.id} value={cancha.id}>
                {cancha.nombre}
              </option>
            ))}
          </select>
        </div>
        <div className="col-12 col-md-3">
          <label className="form-label">Filtrar por calificación</label>
          <select
            className="form-select"
            value={filtroCalificacion}
            onChange={e => setFiltroCalificacion(e.target.value)}
          >
            <option value="">Todas las calificaciones</option>
            <option value="1">⭐ 1 - Muy malo</option>
            <option value="2">⭐⭐ 2 - Malo</option>
            <option value="3">⭐⭐⭐ 3 - Regular</option>
            <option value="4">⭐⭐⭐⭐ 4 - Bueno</option>
            <option value="5">⭐⭐⭐⭐⭐ 5 - Excelente</option>
          </select>
        </div>
        <div className="col-12 col-md-3">
          <label className="form-label">Filtrar por fecha</label>
          <input
            type="date"
            className="form-control"
            value={filtroFecha}
            onChange={e => setFiltroFecha(e.target.value)}
          />
        </div>
        <div className="col-12 col-md-3 d-flex align-items-end">
          <button
            className="btn btn-outline-secondary w-100"
            onClick={limpiarFiltros}
          >
            <i className="bi bi-arrow-clockwise me-1"></i> Limpiar Filtros
          </button>
        </div>
      </div>

      {/* Lista de feedbacks */}
      {!showForm && !showResponder && (
        <FeedbacksList
          feedbacks={feedbacks}
          onEdit={openForm}
          onDelete={handleDelete}
          onResponder={openResponder}
          rol={rol}
        />
      )}

      {/* Formulario de feedback */}
      {showForm && (
        <div className="card p-4 shadow-sm mb-4">
          <FeedbackForm
            form={form}
            onChange={handleChange}
            onSubmit={handleSubmit}
            onCancel={closeForm}
            editFeedback={editFeedback}
            usuarios={usuarios}
            canchas={canchas}
            rol={rol}
          />
        </div>
      )}

      {/* Formulario de respuesta */}
      {showResponder && (
        <div className="card p-4 shadow-sm mb-4">
          <div className="position-relative">
            {/* Botón X para cerrar */}
            <button
              type="button"
              className="btn-close position-absolute"
              style={{ top: -10, right: -10, zIndex: 10, backgroundColor: 'white', borderRadius: '50%', padding: '8px' }}
              onClick={closeForm}
              aria-label="Cerrar"
            ></button>
            
            <form onSubmit={handleResponder}>
              <h4 className="modal-title-llamativo mb-3">
                {feedbackToRespond?.respuesta ? 'Editar Respuesta' : 'Responder Feedback'}
              </h4>
              
              <div className="mb-3">
                <label className="form-label fw-semibold">Usuario:</label>
                <p className="text-muted">{feedbackToRespond?.usuario?.nombres}</p>
              </div>
              
              <div className="mb-3">
                <label className="form-label fw-semibold">Cancha:</label>
                <p className="text-muted">{feedbackToRespond?.cancha?.nombre}</p>
              </div>
              
              {feedbackToRespond?.comentario && (
                <div className="mb-3">
                  <label className="form-label fw-semibold">Comentario original:</label>
                  <div className="bg-light p-3 rounded">
                    <p className="text-muted mb-0">{feedbackToRespond.comentario}</p>
                  </div>
                </div>
              )}
              
              <div className="mb-3">
                <label className="form-label">
                  {feedbackToRespond?.respuesta ? 'Tu respuesta (editar):' : 'Tu respuesta:'} *
                </label>
                <textarea
                  className="form-control"
                  value={respuesta}
                  onChange={e => setRespuesta(e.target.value)}
                  rows="4"
                  placeholder="Escribe tu respuesta como administrador..."
                  required
                />
              </div>

              <div className="d-flex gap-2 justify-content-end">
                <button type="button" className="btn btn-secondary" onClick={closeForm}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-info">
                  {feedbackToRespond?.respuesta ? 'Actualizar Respuesta' : 'Enviar Respuesta'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 
