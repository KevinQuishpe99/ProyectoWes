import React, { useEffect, useState } from 'react';
import EventosList from './EventosList';
import EventoForm from './EventoForm';
import Swal from 'sweetalert2';
import EventosService from '../../servicios/eventos/eventosService';

export default function EventosAdmin({ rol }) {
  const [eventos, setEventos] = useState([]);
  const [canchas, setCanchas] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editEvento, setEditEvento] = useState(null);
  const [form, setForm] = useState({
    nombre: '',
    tipo: '',
    descripcion: '',
    cancha_id: '',
    fecha_inicio: '',
    fecha_fin: '',
    hora_inicio: '',
    hora_fin: '',
    estado: ''
  });
  const [estadosEvento, setEstadosEvento] = useState([]);
  const [filtroNombre, setFiltroNombre] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('');
  const [filtroCancha, setFiltroCancha] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('');
  const [filtroFecha, setFiltroFecha] = useState('');

  const fetchAll = async () => {
    try {
      const [eventos, canchas, estados] = await Promise.all([
        EventosService.getEventos(),
        EventosService.getCanchas(),
        EventosService.getEstadosEvento(),
      ]);
      setEventos(eventos);
      setCanchas(canchas);
      setEstadosEvento(estados);
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

  useEffect(() => {
    fetchAll();
  }, []);

  const limpiarFiltros = () => {
    setFiltroNombre('');
    setFiltroTipo('');
    setFiltroCancha('');
    setFiltroEstado('');
    setFiltroFecha('');
  };

  const openForm = (evento = null) => {
    setEditEvento(evento);
    if (evento) {
      const normalizarHora = (h) => h ? h.split(':').slice(0,2).join(':') : '';
      setForm({
        ...evento,
        hora_inicio: normalizarHora(evento.hora_inicio),
        hora_fin: normalizarHora(evento.hora_fin),
        cancha_id: evento.cancha_id?.toString() || ''
      });
    } else {
      setForm({
        nombre: '',
        tipo: '',
        descripcion: '',
        cancha_id: '',
        fecha_inicio: '',
        fecha_fin: '',
        hora_inicio: '',
        hora_fin: '',
        estado: ''
      });
    }
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditEvento(null);
    setForm({
      nombre: '',
      tipo: '',
      descripcion: '',
      cancha_id: '',
      fecha_inicio: '',
      fecha_fin: '',
      hora_inicio: '',
      hora_fin: '',
      estado: ''
    });
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const formData = {
        ...form,
        cancha_id: parseInt(form.cancha_id)
      };

      if (editEvento) {
        await EventosService.updateEvento(editEvento.id, formData);
        Swal.fire({
          icon: 'success',
          title: 'Actualizado',
          text: 'Evento actualizado correctamente',
          confirmButtonColor: '#3085d6'
        });
      } else {
        await EventosService.createEvento(formData);
        Swal.fire({
          icon: 'success',
          title: 'Creado',
          text: 'Evento creado correctamente',
          confirmButtonColor: '#3085d6'
        });
      }
      fetchAll();
      closeForm();
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: err.response?.data?.message || 'Error al guardar el evento',
        confirmButtonColor: '#d32f2f'
      });
    }
  };

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
          await EventosService.deleteEvento(evento.id);
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

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="panel-title mb-0">Eventos</h2>
        <button className="btn btn-success" onClick={() => openForm()}>
          <i className="bi bi-plus-lg me-1"></i> Nuevo Evento
        </button>
      </div>

      {/* Filtros */}
      <div className="row g-2 mb-3">
        <div className="col-12 col-md-2">
          <label className="form-label">Filtrar por nombre</label>
          <input
            type="text"
            className="form-control"
            placeholder="Nombre del evento..."
            value={filtroNombre}
            onChange={e => setFiltroNombre(e.target.value)}
          />
        </div>
        <div className="col-12 col-md-2">
          <label className="form-label">Filtrar por tipo</label>
          <select
            className="form-select"
            value={filtroTipo}
            onChange={e => setFiltroTipo(e.target.value)}
          >
            <option value="">Todos los tipos</option>
            {tiposEvento.map(tipo => (
              <option key={tipo} value={tipo}>{tipo}</option>
            ))}
          </select>
        </div>
        <div className="col-12 col-md-2">
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
        <div className="col-12 col-md-2">
          <label className="form-label">Filtrar por estado</label>
          <select
            className="form-select"
            value={filtroEstado}
            onChange={e => setFiltroEstado(e.target.value)}
          >
            <option value="">Todos los estados</option>
            {estadosEvento.map(estado => (
              <option key={estado.id} value={estado.id}>
                {estado.nombre}
              </option>
            ))}
          </select>
        </div>
        <div className="col-12 col-md-2">
          <label className="form-label">Filtrar por fecha</label>
          <input
            type="date"
            className="form-control"
            value={filtroFecha}
            onChange={e => setFiltroFecha(e.target.value)}
          />
        </div>
        <div className="col-12 col-md-2 d-flex align-items-end">
          <button
            className="btn btn-outline-secondary w-100"
            onClick={limpiarFiltros}
          >
            <i className="bi bi-arrow-clockwise me-1"></i> Limpiar Filtros
          </button>
        </div>
      </div>

      {/* Lista de eventos */}
      {!showForm && (
        <EventosList
          eventos={eventosFiltrados}
          onEdit={openForm}
          onDelete={handleDelete}
          rol={rol}
        />
      )}

      {/* Formulario */}
      {showForm && (
        <div className="card p-4 shadow-sm mb-4">
          <EventoForm
            form={form}
            onChange={handleChange}
            onSubmit={handleSubmit}
            onCancel={closeForm}
            editEvento={editEvento}
            canchas={canchas}
            estadosEvento={estadosEvento}
          />
        </div>
      )}
    </div>
  );
} 