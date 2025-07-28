<<<<<<< HEAD:src/componentes/feedback/FeedbacksAdmin.jsx
import React, { useEffect } from 'react';
import useFeedbacksAdminData from './useFeedbacksAdminData';
import useFeedbackForm from './useFeedbackForm';
import useFeedbackDelete from './useFeedbackDelete';
import useFeedbacksFiltros from './useFeedbacksFiltros';
import useFeedbackRespuesta from './useFeedbackRespuesta';
import FeedbacksAdminHeader from './FeedbacksAdminHeader';
import FeedbacksAdminLista from './FeedbacksAdminLista';
import FeedbacksAdminModal from './FeedbacksAdminModal';
import FeedbacksAdminFiltros from './FeedbacksAdminFiltros';
import FeedbacksAdminRespuestaModal from './FeedbacksAdminRespuestaModal';
=======
import React, { useEffect, useState } from 'react';
import FeedbacksList from './FeedbacksList';
import FeedbackForm from './FeedbackForm';
import Swal from 'sweetalert2';
import api from '../services/api';
>>>>>>> parent of 9e760a9 (faltoa modulos de admin):src/components/FeedbacksAdmin.jsx

export default function FeedbacksAdmin({ rol }) {
  const {
    feedbacks,
    setFeedbacks,
    usuarios,
    canchas,
    loading,
    fetchAll
  } = useFeedbacksAdminData();

<<<<<<< HEAD:src/componentes/feedback/FeedbacksAdmin.jsx
  const {
    showForm,
    editFeedback,
    form,
    openForm,
    closeForm,
    handleChange
  } = useFeedbackForm();
=======
  const fetchAll = async () => {
    try {
      const [resFeedbacks, resUsuarios, resCanchas] = await Promise.all([
        api.get('/feedback'),
        api.get('/usuarios'),
        api.get('/canchas'),
      ]);
      setFeedbacks(resFeedbacks.data);
      setUsuarios(resUsuarios.data);
      setCanchas(resCanchas.data);
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
>>>>>>> parent of 9e760a9 (faltoa modulos de admin):src/components/FeedbacksAdmin.jsx

  const handleDelete = useFeedbackDelete(fetchAll);

<<<<<<< HEAD:src/componentes/feedback/FeedbacksAdmin.jsx
  // Filtros
  const {
    filtroCancha,
    setFiltroCancha,
    filtroCalificacion,
    setFiltroCalificacion,
    filtroFecha,
    setFiltroFecha,
    limpiarFiltros,
    fetchFeedbacksConFiltros
  } = useFeedbacksFiltros({ setFeedbacks, fetchAll });

  // Respuesta
  const {
    showResponder,
    feedbackToRespond,
    respuesta,
    setRespuesta,
    openResponder,
    closeResponder
  } = useFeedbackRespuesta(closeForm);
=======
      const response = await api.get('/feedback', { params });
      setFeedbacks(response.data);
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
>>>>>>> parent of 9e760a9 (faltoa modulos de admin):src/components/FeedbacksAdmin.jsx

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  useEffect(() => {
    if (filtroCancha || filtroCalificacion || filtroFecha) {
      fetchFeedbacksConFiltros();
    } else {
      fetchAll();
    }
    // eslint-disable-next-line
  }, [filtroCancha, filtroCalificacion, filtroFecha]);

  // Submit feedback
  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const formData = {
        ...form,
        usuario_id: parseInt(form.usuario_id),
        cancha_id: parseInt(form.cancha_id),
        calificacion: form.calificacion ? parseInt(form.calificacion) : null
      };
      if (editFeedback) {
<<<<<<< HEAD:src/componentes/feedback/FeedbacksAdmin.jsx
        await import('../../servicios/feedback/feedbackService').then(({ default: FeedbackService }) =>
          FeedbackService.updateFeedback(editFeedback.id, formData)
        );
        window.Swal.fire({
=======
        await api.put(`/feedback/${editFeedback.id}`, formData);
        Swal.fire({
>>>>>>> parent of 9e760a9 (faltoa modulos de admin):src/components/FeedbacksAdmin.jsx
          icon: 'success',
          title: 'Actualizado',
          text: 'Feedback actualizado correctamente',
          confirmButtonColor: '#3085d6'
        });
      } else {
<<<<<<< HEAD:src/componentes/feedback/FeedbacksAdmin.jsx
        await import('../../servicios/feedback/feedbackService').then(({ default: FeedbackService }) =>
          FeedbackService.createFeedback(formData)
        );
        window.Swal.fire({
=======
        await api.post('/feedback', formData);
        Swal.fire({
>>>>>>> parent of 9e760a9 (faltoa modulos de admin):src/components/FeedbacksAdmin.jsx
          icon: 'success',
          title: 'Creado',
          text: 'Feedback creado correctamente',
          confirmButtonColor: '#3085d6'
        });
      }
      fetchFeedbacksConFiltros();
      closeForm();
    } catch (err) {
      window.Swal.fire({
        icon: 'error',
        title: 'Error',
        text: err.response?.data?.message || 'Error al guardar el feedback',
        confirmButtonColor: '#d32f2f'
      });
    }
  };

  // Responder feedback
  const handleResponder = async e => {
    e.preventDefault();
    if (!respuesta.trim()) {
      window.Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Debes escribir una respuesta',
        confirmButtonColor: '#d32f2f'
      });
      return;
    }
    try {
<<<<<<< HEAD:src/componentes/feedback/FeedbacksAdmin.jsx
      await import('../../servicios/feedback/feedbackService').then(({ default: FeedbackService }) =>
        FeedbackService.responderFeedback(feedbackToRespond.id, respuesta)
      );
      window.Swal.fire({
=======
      await api.post(`/feedback/${feedbackToRespond.id}/responder`, { respuesta });
      Swal.fire({
>>>>>>> parent of 9e760a9 (faltoa modulos de admin):src/components/FeedbacksAdmin.jsx
        icon: 'success',
        title: 'Respondido',
        text: 'Respuesta enviada correctamente',
        confirmButtonColor: '#3085d6'
      });
      fetchFeedbacksConFiltros();
      closeResponder();
    } catch (err) {
      window.Swal.fire({
        icon: 'error',
        title: 'Error',
        text: err.response?.data?.message || 'Error al enviar la respuesta',
        confirmButtonColor: '#d32f2f'
      });
    }
  };

<<<<<<< HEAD:src/componentes/feedback/FeedbacksAdmin.jsx
=======
  const handleDelete = feedback => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Deseas eliminar el feedback de ${feedback.usuario?.nombres}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await api.delete(`/feedback/${feedback.id}`);
          fetchFeedbacksConFiltros();
          Swal.fire({
            icon: 'success',
            title: 'Eliminado',
            text: 'Feedback eliminado correctamente',
            confirmButtonColor: '#3085d6'
          });
        } catch (err) {
          Swal.fire({
            icon: 'error',
            html: '<b>No se puede eliminar el feedback.</b><br><span style="font-size:1.1em">Puede estar asociado a dependencias.</span>',
            background: '#d32f2f',
            color: '#fff',
            iconColor: '#fff',
            confirmButtonColor: '#fff',
            confirmButtonText: '<span style="color:#d32f2f;font-weight:bold">Entendido</span>',
            customClass: {
              popup: 'swal2-border-radius',
              title: 'swal2-title-bold',
            },
          });
        }
      }
    });
  };

  const limpiarFiltros = () => {
    setFiltroCancha('');
    setFiltroCalificacion('');
    setFiltroFecha('');
  };

>>>>>>> parent of 9e760a9 (faltoa modulos de admin):src/components/FeedbacksAdmin.jsx
  return (
    <div className="container py-4">
      <FeedbacksAdminHeader onNuevo={() => openForm()} />
      <FeedbacksAdminFiltros
        filtroCancha={filtroCancha}
        setFiltroCancha={setFiltroCancha}
        filtroCalificacion={filtroCalificacion}
        setFiltroCalificacion={setFiltroCalificacion}
        filtroFecha={filtroFecha}
        setFiltroFecha={setFiltroFecha}
        limpiarFiltros={limpiarFiltros}
        canchas={canchas}
      />
      <FeedbacksAdminLista
        loading={loading && !showForm && !showResponder}
        feedbacks={feedbacks}
        onEdit={openForm}
        onDelete={handleDelete}
        onResponder={openResponder}
        rol={rol}
      />
      <FeedbacksAdminModal
        show={showForm}
        form={form}
        onChange={handleChange}
        onSubmit={handleSubmit}
        onCancel={closeForm}
        editFeedback={editFeedback}
        usuarios={usuarios}
        canchas={canchas}
      />
      <FeedbacksAdminRespuestaModal
        show={showResponder}
        feedbackToRespond={feedbackToRespond}
        respuesta={respuesta}
        setRespuesta={setRespuesta}
        onClose={closeResponder}
        onSubmit={handleResponder}
      />
    </div>
  );
} 