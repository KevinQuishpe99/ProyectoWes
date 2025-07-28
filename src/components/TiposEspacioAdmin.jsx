<<<<<<< HEAD:src/componentes/tiposEspacio/TiposEspacioAdmin.jsx
import React from 'react';
import useTiposEspacioAdminData from './useTiposEspacioAdminData';
import useTiposEspacioFiltros from './useTiposEspacioFiltros';
import useTiposEspacioFiltrados from './useTiposEspacioFiltrados';
import useTipoEspacioForm from './useTipoEspacioForm';
import useTipoEspacioDelete from './useTipoEspacioDelete';
import useTipoEspacioSubmit from './useTipoEspacioSubmit';
import TiposEspacioAdminBar from './TiposEspacioAdminBar';
import TiposEspacioAdminLista from './TiposEspacioAdminLista';
import TiposEspacioAdminModal from './TiposEspacioAdminModal';

export default function TiposEspacioAdmin({ rol }) {
  const { tipos, setTipos, loading, fetchTipos } = useTiposEspacioAdminData();
  const { filtroNombre, setFiltroNombre, limpiarFiltros } = useTiposEspacioFiltros();
  const tiposFiltrados = useTiposEspacioFiltrados(tipos, filtroNombre);
  const { modal, editTipo, form, openModal, closeModal, handleChange, msg, setMsg } = useTipoEspacioForm();
  const handleDelete = useTipoEspacioDelete(fetchTipos, tipos);
  const handleSubmit = useTipoEspacioSubmit({ editTipo, form, fetchTipos, closeModal, setMsg });

  return (
    <div className="bg-body-tertiary p-0" style={{ minHeight: '100%', borderRadius: 0 }}>
      <TiposEspacioAdminBar
        onNuevo={() => openModal()}
        filtroNombre={filtroNombre}
        setFiltroNombre={setFiltroNombre}
        limpiarFiltros={limpiarFiltros}
        total={tipos.length}
        filtrados={tiposFiltrados.length}
      />
      <TiposEspacioAdminLista loading={loading} tiposFiltrados={tiposFiltrados} onEdit={openModal} onDelete={handleDelete} rol={rol} />
      <TiposEspacioAdminModal show={modal} form={form} onChange={handleChange} onSubmit={handleSubmit} onCancel={closeModal} editTipo={editTipo} msg={msg} />
=======
import React, { useEffect, useState } from 'react';
import api from '../services/api';
import Swal from 'sweetalert2';
import TiposEspacioList from './TiposEspacioList';
import TipoEspacioForm from './TipoEspacioForm';

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
      const res = await api.get('/tipos-espacio');
      setTipos(res.data);
      setTiposFiltrados(res.data);
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
        tipo.nombre.toLowerCase().includes(filtroNombre.toLowerCase())
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
        await api.put(`/tipos-espacio/${editTipo.id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        setMsg({ type: 'success', text: 'Tipo de espacio actualizado' });
      } else {
        await api.post('/tipos-espacio', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        setMsg({ type: 'success', text: 'Tipo de espacio creado' });
      }
      fetchTipos();
      setTimeout(closeModal, 1000);
    } catch (err) {
      setMsg({ type: 'danger', text: err.response?.data?.message || 'Error' });
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
          await api.delete(`/tipos-espacio/${id}`);
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
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="panel-title mb-0">Tipos de Espacio</h2>
        <button 
          className="btn btn-success d-flex align-items-center gap-2" 
          onClick={() => openModal()}
        >
          <i className="bi bi-plus-lg me-1"></i>
          Nuevo Tipo
        </button>
      </div>

      {/* Filtros */}
      <div className="row g-2 mb-3 align-items-end">
        <div className="col-12 col-md-8">
          <label className="form-label">Buscar por nombre</label>
          <div className="input-group">
            <span className="input-group-text">
              <i className="bi bi-search"></i>
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Buscar por nombre..."
              value={filtroNombre}
              onChange={(e) => setFiltroNombre(e.target.value)}
            />
          </div>
        </div>
        <div className="col-12 col-md-4 d-flex justify-content-end align-items-end">
          <button
            className="btn btn-outline-secondary px-4"
            style={{ minWidth: 180 }}
            onClick={limpiarFiltros}
          >
            <i className="bi bi-arrow-clockwise me-1"></i> Limpiar Filtros
          </button>
        </div>
      </div>

      {/* Contador de resultados */}
      <div className="row mb-3">
        <div className="col-12">
          <div className="d-flex justify-content-end">
            <small className="text-muted">
              {tiposFiltrados.length} de {tipos.length} tipos encontrados
            </small>
          </div>
        </div>
      </div>

      <div className="">
        <div className="">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Cargando...</span>
              </div>
              <p className="text-muted mt-3">Cargando tipos de espacio...</p>
            </div>
          ) : (
            <TiposEspacioList tipos={tiposFiltrados} onEdit={openModal} onDelete={handleDelete} renderSelectedIcon={null} rol={rol} />
          )}
        </div>
      </div>
      {/* Modal */}
      {modal && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ background: 'rgba(0,0,0,0.2)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <TipoEspacioForm
                form={form}
                onChange={handleChange}
                onSubmit={handleSubmit}
                onCancel={closeModal}
                editTipo={editTipo}
                ICONS={[]}
                renderSelectedIcon={() => null}
              />
            </div>
          </div>
        </div>
      )}
>>>>>>> parent of 9e760a9 (faltoa modulos de admin):src/components/TiposEspacioAdmin.jsx
    </div>
  );
} 