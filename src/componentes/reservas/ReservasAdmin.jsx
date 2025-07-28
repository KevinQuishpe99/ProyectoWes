import React, { useEffect, useState } from 'react';
import ReservasList from './ReservasList';
import ReservaForm from './ReservaForm';
import Swal from 'sweetalert2';
import ReservasService from '../../servicios/reservas/reservasService';
import { getEstadosCancha } from '../../servicios/canchas/canchasService';

export default function ReservasAdmin({ rol }) {
  const [reservas, setReservas] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [canchas, setCanchas] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editReserva, setEditReserva] = useState(null);
  const [form, setForm] = useState({ usuario_id: '', cancha_id: '', fecha: '', hora_inicio: '', hora_fin: '', estado: '' });
  const [estadosCancha, setEstadosCancha] = useState([]);
  const [estadosReserva, setEstadosReserva] = useState([]);
  const [usuarioFiltro, setUsuarioFiltro] = useState('');
  const [codigoUsuario, setCodigoUsuario] = useState('');
  const [usuarioEncontrado, setUsuarioEncontrado] = useState(null);
  const [busquedaRealizada, setBusquedaRealizada] = useState(false);
  const [filtroUsuarioId, setFiltroUsuarioId] = useState('');
  const [filtroCodigo, setFiltroCodigo] = useState('');
  const [filtroFecha, setFiltroFecha] = useState('');

  const fetchAll = async () => {
    const [reservas, usuarios, canchas, estados] = await Promise.all([
      ReservasService.getAll(),
      ReservasService.getUsuarios(),
      ReservasService.getCanchas(),
      ReservasService.getEstados(),
    ]);
    setReservas(reservas);
    setUsuarios(usuarios);
    setCanchas(canchas);
    setEstadosCancha(estados);
  };

  useEffect(() => { fetchAll(); }, []);

  const limpiarFiltros = () => {
    setUsuarioFiltro('');
    setFiltroCodigo('');
    setFiltroFecha('');
  };

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
        await ReservasService.update(editReserva.id, form);
        Swal.fire({ icon: 'success', title: 'Actualizada', text: 'Reserva actualizada correctamente', confirmButtonColor: '#3085d6' });
      } else {
        await ReservasService.create(form);
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
          await ReservasService.delete(reserva.id);
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

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="panel-title mb-0">Reservas</h2>
        <button className="btn btn-success" onClick={() => openForm()}>
          <i className="bi bi-plus-lg me-1"></i> Nueva Reserva
        </button>
      </div>
      {/* Filtros de reservas */}
      <div className="row g-2 mb-3">
        <div className="col-12 col-md-3">
          <label className="form-label">Filtrar por nombre de usuario</label>
          <input
            type="text"
            className="form-control"
            placeholder="Nombre de usuario..."
            value={usuarioFiltro}
            onChange={e => setUsuarioFiltro(e.target.value)}
          />
        </div>
        <div className="col-12 col-md-3">
          <label className="form-label">Filtrar por código único</label>
          <input type="text" className="form-control" placeholder="Código único..." value={filtroCodigo} onChange={e => setFiltroCodigo(e.target.value)} />
        </div>
        <div className="col-12 col-md-3">
          <label className="form-label">Filtrar por fecha</label>
          <input type="date" className="form-control" value={filtroFecha} onChange={e => setFiltroFecha(e.target.value)} />
        </div>
        <div className="col-12 col-md-3 d-flex justify-content-end align-items-end">
          <button
            className="btn btn-outline-secondary px-4"
            style={{ minWidth: 180 }}
            onClick={limpiarFiltros}
          >
            <i className="bi bi-arrow-clockwise me-1"></i> Limpiar Filtros
          </button>
        </div>
      </div>
      {/* Filtro de usuario por nombre */}
      {showForm && (
        <div className="mb-3">
          <label className="form-label">Buscar usuario por código único</label>
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="Código único del usuario..."
              value={codigoUsuario}
              onChange={e => setCodigoUsuario(e.target.value)}
            />
            <button type="button" className="btn btn-outline-primary" onClick={buscarUsuarioPorCodigo}>Buscar</button>
          </div>
          {usuarioEncontrado && (
            <div className="mt-2 text-success fw-bold">{usuarioEncontrado.nombres}</div>
          )}
          {!usuarioEncontrado && codigoUsuario && (
            <div className="mt-2 text-danger">No se encontró usuario con ese código.</div>
          )}
        </div>
      )}
      {!showForm && (
        <ReservasList
          reservas={reservas.filter(r => {
            const usuarioOk = !usuarioFiltro || (r.usuario && r.usuario.nombres && r.usuario.nombres.toLowerCase().includes(usuarioFiltro.toLowerCase()));
            const codigoOk = !filtroCodigo || (r.usuario && r.usuario.codigo && r.usuario.codigo.toLowerCase().includes(filtroCodigo.toLowerCase()));
            const fechaOk = !filtroFecha || r.fecha === filtroFecha;
            return usuarioOk && codigoOk && fechaOk;
          })}
          onEdit={openForm}
          onDelete={handleDelete}
          rol={rol}
        />
      )}
      {showForm && (
        <div className="card p-4 shadow-sm mb-4">
          <ReservaForm
            form={form}
            onChange={handleChange}
            onSubmit={handleSubmit}
            onCancel={closeForm}
            editReserva={editReserva}
            canchas={canchas}
            usuarios={usuarioEncontrado ? [usuarioEncontrado] : usuarios}
            estadosReserva={estadosReserva}
          />
        </div>
      )}
    </div>
  );
} 