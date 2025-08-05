import React, { useState, useEffect } from 'react';
import ListaCanchas from '../landing/ListaCanchas';
import ReservaForm from '../reservas/ReservaForm';
import { getCanchas, getTiposEspacio } from '../../servicios/canchas/canchasService';
import { getReservasPorUsuario } from '../../servicios/reservas/reservasService';
import { contieneTexto } from '../../utils/textUtils';

export default function ReservarCanchaUsuario({ user }) {
  const [canchas, setCanchas] = useState([]);
  const [tiposEspacio, setTiposEspacio] = useState([]);
  const [filtroNombre, setFiltroNombre] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('');
  const [mostrarModal, setMostrarModal] = useState(false);
  const [canchaSeleccionada, setCanchaSeleccionada] = useState(null);
  const [misReservas, setMisReservas] = useState([]);

  useEffect(() => {
    console.log('🔍 ReservarCanchaUsuario - Cargando datos...');
    getCanchas().then(data => {
      console.log('🔍 Canchas cargadas:', data.length);
      setCanchas(data);
    });
    getTiposEspacio().then(data => {
      console.log('🔍 Tipos de espacio cargados:', data.length);
      setTiposEspacio(data);
    });
    if (user) {
      getReservasPorUsuario(user.id).then(data => {
        console.log('🔍 Mis reservas cargadas:', data.length);
        setMisReservas(data);
      });
    }
  }, [user]);

  const canchasFiltradas = canchas.filter(c => {
    const nombreOk = !filtroNombre || contieneTexto(c.nombre, filtroNombre);
    const tipoOk = !filtroTipo || c.tipo_espacio_id === Number(filtroTipo);
    return nombreOk && tipoOk;
  });

  console.log('🔍 Filtros aplicados:', {
    filtroNombre,
    filtroTipo,
    totalCanchas: canchas.length,
    canchasFiltradas: canchasFiltradas.length,
    canchas: canchas.map(c => ({ id: c.id, nombre: c.nombre, tipo_espacio_id: c.tipo_espacio_id }))
  });

  const tieneAgendada = misReservas.some(r => r.estado === 'reservada');

  const handleReservar = (cancha) => {
    setCanchaSeleccionada(cancha);
    setMostrarModal(true);
  };

  const handleCerrarModal = () => {
    setMostrarModal(false);
    setCanchaSeleccionada(null);
  };

  const handleReservaExitosa = () => {
    if (user) getReservasPorUsuario(user.id).then(setMisReservas);
  };

  return (
    <div>
      <h2 className="mb-4">Reservar Cancha</h2>
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
            disabled={tieneAgendada}
          />
        </div>
        <div className="col-md-6">
          <select
            className="form-select"
            value={filtroTipo}
            onChange={e => setFiltroTipo(e.target.value)}
            disabled={tieneAgendada}
          >
            <option value="">Todos los tipos</option>
            {tiposEspacio.map(t => (
              <option key={t.id} value={t.id}>{t.nombre}</option>
            ))}
          </select>
        </div>
      </div>
      <ListaCanchas
        canchas={canchasFiltradas}
        onReservar={tieneAgendada ? undefined : handleReservar}
        modoUsuario={!tieneAgendada}
      />
      {mostrarModal && (
        <div className="modal fade show" style={{ display: 'block', background: 'rgba(30,40,60,0.35)', position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 2000 }}>
          <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
            <div className="card shadow-lg p-0" style={{ minWidth: 380, maxWidth: 420, width: '100%' }}>
              <ReservaForm
                cancha={canchaSeleccionada}
                user={user}
                onClose={handleCerrarModal}
                onReservaExitosa={handleReservaExitosa}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 