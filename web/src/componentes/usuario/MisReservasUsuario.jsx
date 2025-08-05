import React, { useState, useEffect } from 'react';
import ReservasList from '../reservas/ReservasList';
import { getReservasPorUsuario, getMisReservas, cancelarReservaUsuario } from '../../servicios/reservas/reservasService';
import ReservasService from '../../servicios/reservas/reservasService';
import Swal from 'sweetalert2';
import { contieneTexto } from '../../utils/textUtils';

export default function MisReservasUsuario({ user }) {
  const [reservas, setReservas] = useState([]);
  const [filtroNombre, setFiltroNombre] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('');
  const [modalCancelar, setModalCancelar] = useState(false);
  const [reservaCancelar, setReservaCancelar] = useState(null);
  const [modalEditar, setModalEditar] = useState(false);
  const [reservaEditar, setReservaEditar] = useState(null);
  const [editFecha, setEditFecha] = useState('');
  const [editHoraInicio, setEditHoraInicio] = useState('');
  const [editHoraFin, setEditHoraFin] = useState('');
  const [editEstado, setEditEstado] = useState('reservada');
  const [error, setError] = useState(null);

  const horas = Array.from({ length: 16 }, (_, i) => 7 + i); // 7:00 a 22:00

  const cargarReservas = () => {
    if (user) {
      console.log('🔍 Cargando reservas para usuario:', user.id, user);
      console.log('🔍 Rol del usuario:', user.rol);
      console.log('🔍 Usando nuevo endpoint: /reservas/mis-reservas');
      
      getMisReservas()
        .then(data => {
          console.log('✅ Reservas cargadas exitosamente:', data);
          console.log('✅ Cantidad de reservas:', data.length);
          setReservas(data);
        })
        .catch(error => {
          console.error('❌ Error cargando reservas:', error);
          console.error('❌ Detalles del error:', {
            status: error.response?.status,
            message: error.response?.data,
            url: error.config?.url
          });
          setReservas([]);
        });
    } else {
      console.log('❌ No hay usuario para cargar reservas');
    }
  };

  useEffect(() => {
    cargarReservas();
  }, [user]);

  const reservasFiltradas = reservas.filter(r => {
    const nombreOk = !filtroNombre || (r.cancha && r.cancha.nombre && contieneTexto(r.cancha.nombre, filtroNombre));
    const tipoOk = !filtroTipo || (r.cancha && r.cancha.tipo_espacio_id === Number(filtroTipo));
    return nombreOk && tipoOk;
  });

  // Lógica para evitar más de una reserva agendada
  const tieneAgendada = reservas.some(r => r.estado === 'reservada');

  const handleCancelar = (reserva) => {
    setReservaCancelar(reserva);
    setModalCancelar(true);
    setError(null);
  };

  const confirmarCancelar = async () => {
    setError(null);
    try {
      await cancelarReservaUsuario(reservaCancelar.id);
      setModalCancelar(false);
      setReservaCancelar(null);
      cargarReservas();
      Swal.fire('Cancelada', 'La reserva fue cancelada', 'success');
    } catch (err) {
      setError(err?.response?.data?.message || 'No se pudo cancelar la reserva');
    }
  };

  const cerrarModalCancelar = () => {
    setModalCancelar(false);
    setReservaCancelar(null);
    setError(null);
  };

  // Edición
  const handleEditar = (reserva) => {
    console.log('🔍 Intentando editar reserva:', {
      id: reserva.id,
      estado: reserva.estado,
      fecha: reserva.fecha,
      hora_inicio: reserva.hora_inicio
    });
    
    // Solo permitir editar reservas en estado "reservada"
    if (reserva.estado !== 'reservada') {
      console.log('❌ Reserva no editable - estado:', reserva.estado);
      Swal.fire({
        icon: 'warning',
        title: 'No se puede editar',
        text: 'Solo se pueden editar reservas en estado "reservada"',
        confirmButtonColor: '#3085d6'
      });
      return;
    }
    
    console.log('✅ Reserva editable - abriendo modal');
    setReservaEditar(reserva);
    setEditFecha(reserva.fecha);
    setEditHoraInicio(reserva.hora_inicio);
    setEditHoraFin(reserva.hora_fin);
    setEditEstado(reserva.estado);
    setModalEditar(true);
    setError(null);
  };

  const handleHoraInicio = (e) => {
    const inicio = e.target.value;
    setEditHoraInicio(inicio);
    if (inicio) {
      const h = parseInt(inicio.split(':')[0], 10);
      const siguiente = h + 1;
      setEditHoraFin(`${siguiente}:00`);
    } else {
      setEditHoraFin('');
    }
  };

  const guardarEdicion = async () => {
    setError(null);
    if (!editEstado) {
      setError('Selecciona un estado');
      return;
    }
    
    // Validar que solo se pueda cambiar a estado "reservada" o "cancelada"
    if (editEstado !== 'reservada' && editEstado !== 'cancelada') {
      setError('Solo puedes cambiar el estado a "reservada" o "cancelada"');
      return;
    }
    
    try {
      console.log('🔍 Guardando edición - Solo estado:', {
        reservaId: reservaEditar.id,
        nuevoEstado: editEstado
      });
      
      await ReservasService.update(reservaEditar.id, { 
        estado: editEstado 
      });
      setModalEditar(false);
      setReservaEditar(null);
      cargarReservas();
      Swal.fire('Actualizada', 'El estado de la reserva fue actualizado', 'success');
    } catch (err) {
      setError(err?.response?.data?.message || 'No se pudo actualizar la reserva');
    }
  };

  const cerrarModalEditar = () => {
    setModalEditar(false);
    setReservaEditar(null);
    setError(null);
  };

  return (
    <div>
      <h2 className="mb-4">Mis Reservas</h2>
      {tieneAgendada && (
        <div className="alert alert-info mb-3">Solo puedes tener una reserva en estado <b>reservada</b> a la vez.</div>
      )}
      <div className="row g-2 mb-3">
        <div className="col-md-6">
          <input
            type="text"
            className="form-control"
            placeholder="Buscar por nombre de cancha..."
            value={filtroNombre}
            onChange={e => setFiltroNombre(e.target.value)}
          />
        </div>
        <div className="col-md-6">
          <input
            type="text"
            className="form-control"
            placeholder="Filtrar por tipo de espacio..."
            value={filtroTipo}
            onChange={e => setFiltroTipo(e.target.value)}
          />
        </div>
      </div>
      <ReservasList 
        reservas={reservasFiltradas} 
        modoUsuario={true} 
        onCancelar={handleCancelar} 
        onEditar={handleEditar}
        rol="usuario"
      />
      {modalCancelar && (
        <div className="modal fade show" style={{ display: 'block', background: 'rgba(30,40,60,0.35)', position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 2000 }}>
          <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
            <div className="card shadow-lg p-4" style={{ minWidth: 340, maxWidth: 400, width: '100%' }}>
              <div className="modal-header">
                <h5 className="modal-title">Cancelar Reserva</h5>
                <button type="button" className="btn-close" onClick={cerrarModalCancelar}></button>
              </div>
              <div className="modal-body">
                {error && (
                  <div className="alert alert-danger text-center py-2 mb-3" role="alert">
                    <i className="bi bi-exclamation-triangle me-2"></i>
                    {error}
                  </div>
                )}
                <p>¿Estás seguro que deseas cancelar la reserva de <b>{reservaCancelar?.cancha?.nombre}</b> el <b>{reservaCancelar?.fecha}</b> de <b>{reservaCancelar?.hora_inicio}</b> a <b>{reservaCancelar?.hora_fin}</b>?</p>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={cerrarModalCancelar}>No, volver</button>
                <button className="btn btn-danger" onClick={confirmarCancelar}>Sí, cancelar</button>
              </div>
            </div>
          </div>
        </div>
      )}
      {modalEditar && (
        <div className="modal fade show" style={{ display: 'block', background: 'rgba(30,40,60,0.35)', position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 2000 }}>
          <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
            <div className="card shadow-lg p-4" style={{ minWidth: 340, maxWidth: 400, width: '100%' }}>
              <div className="modal-header">
                <h5 className="modal-title">Cambiar Estado de Reserva</h5>
                <button type="button" className="btn-close" onClick={cerrarModalEditar}></button>
              </div>
              <div className="modal-body">
                {error && (
                  <div className="alert alert-danger text-center py-2 mb-3" role="alert">
                    <i className="bi bi-exclamation-triangle me-2"></i>
                    {error}
                  </div>
                )}
                <div className="alert alert-info text-center py-2 mb-3" role="alert">
                  <i className="bi bi-info-circle me-2"></i>
                  Solo puedes cambiar el estado de tu reserva. La fecha y horarios no se pueden modificar.
                </div>
                <div className="mb-3">
                  <label className="form-label">Fecha</label>
                  <input 
                    type="date" 
                    className="form-control" 
                    value={editFecha} 
                    disabled
                  />
                  <small className="text-muted">La fecha no se puede modificar</small>
                </div>
                <div className="mb-3">
                  <label className="form-label">Hora Inicio</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={editHoraInicio} 
                    disabled
                  />
                  <small className="text-muted">La hora de inicio no se puede modificar</small>
                </div>
                <div className="mb-3">
                  <label className="form-label">Hora Fin</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={editHoraFin} 
                    disabled
                  />
                  <small className="text-muted">La hora de fin no se puede modificar</small>
                </div>
                <div className="mb-3">
                  <label className="form-label">Estado</label>
                  <select className="form-select" value={editEstado} onChange={e => setEditEstado(e.target.value)} required>
                    <option value="reservada">Reservada</option>
                    <option value="cancelada">Cancelada</option>
                  </select>
                  <small className="text-muted">Solo puedes cambiar entre "reservada" y "cancelada"</small>
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={cerrarModalEditar}>Cancelar</button>
                <button className="btn btn-primary" onClick={guardarEdicion}>Guardar</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 