import React, { useEffect, useState } from 'react';
import TiposEspacioService from '../../servicios/tiposEspacio/tiposEspacioService';
import Swal from 'sweetalert2';
import TiposEspacioAdminHeader from './TiposEspacioAdminHeader';
import TiposEspacioAdminFiltros from './TiposEspacioAdminFiltros';
import TiposEspacioAdminContador from './TiposEspacioAdminContador';
import TiposEspacioAdminLista from './TiposEspacioAdminLista';
import TiposEspacioAdminModal from './TiposEspacioAdminModal';
import { contieneTexto } from '../../utils/textUtils';

export default function TiposEspacioAdmin({ rol }) {
  const [tipos, setTipos] = useState([]);
  const [tiposFiltrados, setTiposFiltrados] = useState([]);
  const [filtroNombre, setFiltroNombre] = useState('');
  const [modal, setModal] = useState(false);
  const [editTipo, setEditTipo] = useState(null);
  const [form, setForm] = useState({ nombre: '', descripcion: '', imagen: null });
  const [msg, setMsg] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchTipos = async () => {
    try {
      setLoading(true);
      const data = await TiposEspacioService.getAll();
      setTipos(data);
      setTiposFiltrados(data);
    } catch (error) {
      console.error('Error fetching tipos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTipos(); }, []);

  // Filtrar tipos por nombre
  useEffect(() => {
    if (filtroNombre.trim() === '') {
      setTiposFiltrados(tipos);
    } else {
      const filtrados = tipos.filter(tipo => 
        contieneTexto(tipo.nombre, filtroNombre)
      );
      setTiposFiltrados(filtrados);
    }
  }, [filtroNombre, tipos]);

  const limpiarFiltros = () => {
    setFiltroNombre('');
  };

  const openModal = (tipo = null) => {
    setEditTipo(tipo);
    setForm(tipo ? { nombre: tipo.nombre, descripcion: tipo.descripcion || '', imagen: tipo.imagen || null } : { nombre: '', descripcion: '', imagen: null });
    setModal(true);
    setMsg(null);
  };

  const closeModal = () => {
    setModal(false);
    setEditTipo(null);
    setForm({ nombre: '', descripcion: '', imagen: null });
    setMsg(null);
  };

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('nombre', form.nombre);
      formData.append('descripcion', form.descripcion || '');
      if (form.imagen && typeof form.imagen !== 'string') {
        formData.append('imagen', form.imagen);
      }
      if (editTipo) {
        await TiposEspacioService.update(editTipo.id, formData);
        Swal.fire({
          icon: 'success',
          title: '¡Actualizado!',
          text: 'Tipo de espacio actualizado correctamente',
          confirmButtonColor: '#3085d6',
          timer: 2000,
          showConfirmButton: false
        });
      } else {
        await TiposEspacioService.create(formData);
        Swal.fire({
          icon: 'success',
          title: '¡Creado!',
          text: 'Tipo de espacio creado correctamente',
          confirmButtonColor: '#3085d6',
          timer: 2000,
          showConfirmButton: false
        });
      }
      fetchTipos();
      setTimeout(closeModal, 1000);
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error al procesar la solicitud';
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: errorMessage,
        confirmButtonColor: '#d32f2f'
      });
      setMsg({ type: 'danger', text: errorMessage });
    }
  };

  const handleDelete = async id => {
    const tipo = tipos.find(t => t.id === id);
    const nombre = tipo ? tipo.nombre : '';
    Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Deseas eliminar el tipo de espacio "${nombre}"? Esta acción no se puede deshacer.`,
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
          await TiposEspacioService.delete(id);
          fetchTipos();
          Swal.fire({
            icon: 'success',
            title: 'Eliminado',
            text: 'Tipo de espacio eliminado correctamente',
            confirmButtonColor: '#3085d6',
          });
        } catch (err) {
          Swal.fire({
            icon: 'error',
            html: '<b>No se puede eliminar el tipo de espacio.</b><br><span style="font-size:1.1em">Puede estar asociado a canchas.</span>',
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

  return (
    <div className="bg-body-tertiary p-0" style={{ minHeight: '100%', borderRadius: 0 }}>
      <TiposEspacioAdminHeader onNuevo={() => openModal()} />
      <TiposEspacioAdminFiltros filtroNombre={filtroNombre} setFiltroNombre={setFiltroNombre} limpiarFiltros={limpiarFiltros} />
      <TiposEspacioAdminContador total={tipos.length} filtrados={tiposFiltrados.length} />
      <TiposEspacioAdminLista loading={loading} tiposFiltrados={tiposFiltrados} onEdit={openModal} onDelete={handleDelete} rol={rol} />
      <TiposEspacioAdminModal show={modal} form={form} onChange={handleChange} onSubmit={handleSubmit} onCancel={closeModal} editTipo={editTipo} />
    </div>
  );
} 
