<<<<<<< HEAD:src/componentes/eventos/EventosAdmin.jsx
import React, { useEffect } from 'react';
import useEventosAdminData from './useEventosAdminData';
import useEventoForm from './useEventoForm';
import useEventoDelete from './useEventoDelete';
import useFiltroEventos from './useFiltroEventos';
import EventosAdminHeader from './EventosAdminHeader';
import EventosFiltros from './EventosFiltros';
import EventosContador from './EventosContador';
import EventosAdminLista from './EventosAdminLista';
import EventosAdminModal from './EventosAdminModal';
=======
import React, { useEffect, useState } from 'react';
import EventosList from './EventosList';
import EventoForm from './EventoForm';
import Swal from 'sweetalert2';
import api from '../services/api';
>>>>>>> parent of 9e760a9 (faltoa modulos de admin):src/components/EventosAdmin.jsx

export default function EventosAdmin({ rol }) {
  const tiposEvento = ['Torneo', 'Entrenamiento', 'Exhibición', 'Clase', 'Competencia', 'Otro'];
  const {
    eventos,
    setEventos,
    canchas,
    setCanchas,
    estadosEvento,
    setEstadosEvento,
    loading,
    fetchAll
  } = useEventosAdminData();

<<<<<<< HEAD:src/componentes/eventos/EventosAdmin.jsx
  const {
    showForm,
    editEvento,
    form,
    openForm,
    closeForm,
    handleChange,
    setForm
  } = useEventoForm();

  const handleDelete = useEventoDelete(fetchAll);

  const {
    filtroNombre,
    setFiltroNombre,
    filtroTipo,
    setFiltroTipo,
    filtroCancha,
    setFiltroCancha,
    filtroEstado,
    setFiltroEstado,
    filtroFecha,
    setFiltroFecha,
    limpiarFiltros,
    eventosFiltrados
  } = useFiltroEventos(eventos, canchas, estadosEvento, tiposEvento);
=======
  const fetchAll = async () => {
    try {
      const [resEventos, resCanchas, resEstados] = await Promise.all([
        api.get('/eventos'),
        api.get('/canchas'),
        api.get('/eventos/estados-evento'),
      ]);
      setEventos(resEventos.data);
      setCanchas(resCanchas.data);
      setEstadosEvento(resEstados.data);
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
>>>>>>> parent of 9e760a9 (faltoa modulos de admin):src/components/EventosAdmin.jsx

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  // Manejo de submit
  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const formData = {
        ...form,
        cancha_id: parseInt(form.cancha_id)
      };
      if (editEvento) {
<<<<<<< HEAD:src/componentes/eventos/EventosAdmin.jsx
        await import('../../servicios/eventos/eventosService').then(({ default: EventosService }) =>
          EventosService.updateEvento(editEvento.id, formData)
        );
        window.Swal.fire({
=======
        await api.put(`/eventos/${editEvento.id}`, formData);
        Swal.fire({
>>>>>>> parent of 9e760a9 (faltoa modulos de admin):src/components/EventosAdmin.jsx
          icon: 'success',
          title: 'Actualizado',
          text: 'Evento actualizado correctamente',
          confirmButtonColor: '#3085d6'
        });
      } else {
<<<<<<< HEAD:src/componentes/eventos/EventosAdmin.jsx
        await import('../../servicios/eventos/eventosService').then(({ default: EventosService }) =>
          EventosService.createEvento(formData)
        );
        window.Swal.fire({
=======
        await api.post('/eventos', formData);
        Swal.fire({
>>>>>>> parent of 9e760a9 (faltoa modulos de admin):src/components/EventosAdmin.jsx
          icon: 'success',
          title: 'Creado',
          text: 'Evento creado correctamente',
          confirmButtonColor: '#3085d6'
        });
      }
      fetchAll();
      closeForm();
    } catch (err) {
      window.Swal.fire({
        icon: 'error',
        title: 'Error',
        text: err.response?.data?.message || 'Error al guardar el evento',
        confirmButtonColor: '#d32f2f'
      });
    }
  };

<<<<<<< HEAD:src/componentes/eventos/EventosAdmin.jsx
=======
  const handleDelete = evento => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Deseas eliminar el evento "${evento.nombre}"?`,
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
          await api.delete(`/eventos/${evento.id}`);
          fetchAll();
          Swal.fire({
            icon: 'success',
            title: 'Eliminado',
            text: 'Evento eliminado correctamente',
            confirmButtonColor: '#3085d6'
          });
        } catch (err) {
          Swal.fire({
            icon: 'error',
            html: '<b>No se puede eliminar el evento.</b><br><span style="font-size:1.1em">Puede estar asociado a dependencias.</span>',
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

  const eventosFiltrados = eventos.filter(evento => {
    const nombreOk = !filtroNombre || evento.nombre.toLowerCase().includes(filtroNombre.toLowerCase());
    const tipoOk = !filtroTipo || evento.tipo === filtroTipo;
    const canchaOk = !filtroCancha || evento.cancha_id === Number(filtroCancha);
    const estadoOk = !filtroEstado || evento.estado === filtroEstado;
    const fechaOk = !filtroFecha || 
      (evento.fecha_inicio <= filtroFecha && evento.fecha_fin >= filtroFecha);
    
    return nombreOk && tipoOk && canchaOk && estadoOk && fechaOk;
  });

  const tiposEvento = ['Torneo', 'Entrenamiento', 'Exhibición', 'Clase', 'Competencia', 'Otro'];

>>>>>>> parent of 9e760a9 (faltoa modulos de admin):src/components/EventosAdmin.jsx
  return (
    <div className="container py-4">
      <EventosAdminHeader onNuevo={() => openForm()} />
      <EventosFiltros
        filtroNombre={filtroNombre}
        setFiltroNombre={setFiltroNombre}
        filtroTipo={filtroTipo}
        setFiltroTipo={setFiltroTipo}
        filtroCancha={filtroCancha}
        setFiltroCancha={setFiltroCancha}
        filtroEstado={filtroEstado}
        setFiltroEstado={setFiltroEstado}
        filtroFecha={filtroFecha}
        setFiltroFecha={setFiltroFecha}
        limpiarFiltros={limpiarFiltros}
        canchas={canchas}
        estadosEvento={estadosEvento}
        tiposEvento={tiposEvento}
      />
      <EventosContador total={eventos.length} filtrados={eventosFiltrados.length} />
      <EventosAdminLista
        loading={loading && !showForm}
        eventos={eventosFiltrados}
        onEdit={openForm}
        onDelete={handleDelete}
        rol={rol}
      />
      <EventosAdminModal
        show={showForm}
        form={form}
        onChange={handleChange}
        onSubmit={handleSubmit}
        onCancel={closeForm}
        editEvento={editEvento}
        canchas={canchas}
        estadosEvento={estadosEvento}
      />
    </div>
  );
} 