import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { createReservaUsuario } from '../../servicios/reservas/reservasService';

export default function ReservaForm({ cancha, user, onClose, onReservaExitosa }) {
  const [fecha, setFecha] = useState('');
  const [horaInicio, setHoraInicio] = useState('');
  const [horaFin, setHoraFin] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const horas = Array.from({ length: 16 }, (_, i) => 7 + i); // 7:00 a 22:00

  const handleHoraInicio = (e) => {
    const inicio = e.target.value;
    setHoraInicio(inicio);
    if (inicio) {
      const h = parseInt(inicio.split(':')[0], 10);
      const siguiente = h + 1;
      setHoraFin(`${siguiente}:00`);
    } else {
      setHoraFin('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!fecha || !horaInicio || !horaFin) {
      setError('Completa todos los campos');
      return;
    }
    setLoading(true);
    try {
      await createReservaUsuario({ usuario_id: user.id, cancha_id: cancha.id, fecha, hora_inicio: horaInicio, hora_fin: horaFin });
      setLoading(false);
      Swal.fire({ icon: 'success', title: 'Reserva realizada', text: 'Tu reserva fue registrada correctamente', confirmButtonColor: '#3085d6' });
      if (onReservaExitosa) onReservaExitosa();
      onClose();
    } catch (err) {
      setLoading(false);
      let msg = err?.response?.data?.message || 'No se pudo registrar la reserva';
      if (msg.includes('reservas_estado_check')) {
        msg = 'Error: El estado de la reserva no es válido. Contacta al administrador.';
      }
      setError(msg);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="modal-header">
        <h5 className="modal-title modal-title-llamativo">Reservar Cancha</h5>
        <button type="button" className="btn-close" onClick={onClose}></button>
      </div>
      <div className="modal-body">
        {error && (
          <div className="alert alert-danger text-center py-2 mb-3" role="alert">
            <i className="bi bi-exclamation-triangle me-2"></i>
            {error}
          </div>
        )}
        <div className="mb-3">
          <label className="form-label">Cancha</label>
          <input type="text" className="form-control" value={cancha?.nombre || ''} disabled />
        </div>
        <div className="mb-3">
          <label className="form-label">Fecha</label>
          <input type="date" className="form-control" value={fecha} onChange={e => setFecha(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Hora Inicio</label>
          <select className="form-select" value={horaInicio} onChange={handleHoraInicio} required>
            <option value="">Selecciona hora inicio</option>
            {horas.map(h => (
              <option key={h} value={`${h}:00`}>{`${h}:00`}</option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label">Hora Fin</label>
          <input type="text" className="form-control" value={horaFin} disabled />
        </div>
      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-secondary" onClick={onClose}>Cancelar</button>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? <span className="spinner-border spinner-border-sm me-2"></span> : null}
          Reservar
        </button>
      </div>
    </form>
  );
} 
