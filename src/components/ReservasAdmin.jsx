<<<<<<< HEAD:src/componentes/reservas/ReservasAdmin.jsx
import React from 'react';
import useReservasAdminData from './useReservasAdminData';
import useReservasFiltros from './useReservasFiltros';
import useReservaForm from './useReservaForm';
import useReservaDelete from './useReservaDelete';
import useReservasFiltradas from './useReservasFiltradas';
import useReservaSubmit from './useReservaSubmit';
import ReservasAdminHeader from './ReservasAdminHeader';
import ReservasAdminFiltros from './ReservasAdminFiltros';
import ReservasAdminContador from './ReservasAdminContador';
import ReservasAdminLista from './ReservasAdminLista';
import ReservasAdminModal from './ReservasAdminModal';
=======
import React, { useEffect, useState } from 'react';
import ReservasList from './ReservasList';
import ReservaForm from './ReservaForm';
import Swal from 'sweetalert2';
import api from '../services/api';
import { getEstadosCancha } from '../features/canchas/canchasService';
>>>>>>> parent of 9e760a9 (faltoa modulos de admin):src/components/ReservasAdmin.jsx

export default function ReservasAdmin({ rol }) {
  const {
    reservas,
    usuarios,
    canchas,
    estadosCancha,
    loading,
    fetchAll
  } = useReservasAdminData();

<<<<<<< HEAD:src/componentes/reservas/ReservasAdmin.jsx
  const {
    filtroUsuario,
    setFiltroUsuario,
    filtroCodigo,
    setFiltroCodigo,
    filtroFecha,
    setFiltroFecha,
    limpiarFiltros
  } = useReservasFiltros();
=======
  const fetchAll = async () => {
    const [resReservas, resUsuarios, resCanchas, resEstados] = await Promise.all([
      api.get('/reservas'),
      api.get('/usuarios'),
      api.get('/canchas'),
      api.get('/reservas/estados-reserva'),
    ]);
    setReservas(resReservas.data);
    setUsuarios(resUsuarios.data);
    setCanchas(resCanchas.data);
    setEstadosCancha(resEstados.data);
  };
>>>>>>> parent of 9e760a9 (faltoa modulos de admin):src/components/ReservasAdmin.jsx

  const {
    showForm,
    editReserva,
    form,
    openForm,
    closeForm,
    handleChange
  } = useReservaForm();

  const handleDelete = useReservaDelete(fetchAll);

<<<<<<< HEAD:src/componentes/reservas/ReservasAdmin.jsx
  const reservasFiltradas = useReservasFiltradas(reservas, filtroUsuario, filtroCodigo, filtroFecha);
  const handleSubmit = useReservaSubmit({ editReserva, form, fetchAll, closeForm });
=======
  const openForm = (reserva = null) => {
    setEditReserva(reserva);
    if (reserva) {
      const normalizarHora = (h) => h ? h.split(':').slice(0,2).join(':') : '';
      setForm({
        ...reserva,
        hora_inicio: normalizarHora(reserva.hora_inicio),
        hora_fin: normalizarHora(reserva.hora_fin),
        estado: reserva.estado ? reserva.estado.toLowerCase() : ''
      });
    } else {
      setForm({ usuario_id: '', cancha_id: '', fecha: '', hora_inicio: '', hora_fin: '', estado: '' });
    }
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditReserva(null);
    setForm({ usuario_id: '', cancha_id: '', fecha: '', hora_inicio: '', hora_fin: '', estado: '' });
  };

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      if (editReserva) {
        await api.put(`/reservas/${editReserva.id}`, form);
        Swal.fire({ icon: 'success', title: 'Actualizada', text: 'Reserva actualizada correctamente', confirmButtonColor: '#3085d6' });
      } else {
        await api.post('/reservas', form);
        Swal.fire({ icon: 'success', title: 'Creada', text: 'Reserva creada correctamente', confirmButtonColor: '#3085d6' });
      }
      fetchAll();
      closeForm();
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Error', text: err.response?.data?.message || 'Error al guardar la reserva', confirmButtonColor: '#d32f2f' });
    }
  };

  const handleDelete = reserva => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Deseas eliminar la reserva de ${reserva.fecha} (${reserva.hora_inicio} - ${reserva.hora_fin})?`,
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
          await api.delete(`/reservas/${reserva.id}`);
          fetchAll();
          Swal.fire({ icon: 'success', title: 'Eliminada', text: 'Reserva eliminada correctamente', confirmButtonColor: '#3085d6' });
        } catch (err) {
          Swal.fire({
            icon: 'error',
            html: '<b>No se puede eliminar la reserva.</b><br><span style="font-size:1.1em">Puede estar asociada a dependencias.</span>',
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

  const buscarUsuarioPorCodigo = () => {
    const usuario = usuarios.find(u => u.codigo === codigoUsuario.trim());
    setUsuarioEncontrado(usuario || null);
    if (usuario) {
      setForm(f => ({ ...f, usuario_id: usuario.id }));
    }
  };
>>>>>>> parent of 9e760a9 (faltoa modulos de admin):src/components/ReservasAdmin.jsx

  return (
    <div className="container py-4">
      <ReservasAdminHeader onNuevo={() => openForm()} />
      <ReservasAdminFiltros
        filtroUsuario={filtroUsuario}
        setFiltroUsuario={setFiltroUsuario}
        filtroCodigo={filtroCodigo}
        setFiltroCodigo={setFiltroCodigo}
        filtroFecha={filtroFecha}
        setFiltroFecha={setFiltroFecha}
        limpiarFiltros={limpiarFiltros}
      />
      <ReservasAdminContador total={reservas.length} filtradas={reservasFiltradas.length} />
      <ReservasAdminLista
        loading={loading && !showForm}
        reservas={reservasFiltradas}
        onEdit={openForm}
        onDelete={handleDelete}
        rol={rol}
      />
      <ReservasAdminModal
        show={showForm}
        form={form}
        onChange={handleChange}
        onSubmit={handleSubmit}
        onCancel={closeForm}
        editReserva={editReserva}
        canchas={canchas}
        usuarios={usuarios}
        estadosReserva={estadosCancha}
        loading={loading}
      />
    </div>
  );
} 