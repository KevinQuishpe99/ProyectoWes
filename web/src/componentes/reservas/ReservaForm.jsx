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
    // Calcular automáticamente la hora de fin (una hora más)
    if (inicio) {
      const hInicio = parseInt(inicio.split(':')[0], 10);
      const hFin = hInicio + 1;
      if (hFin <= 22) { // Verificar que no exceda el límite de 22:00
        setHoraFin(`${hFin}:00`);
      } else {
        setHoraFin('');
      }
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
    
    // Validar fecha no pasada (permitir la fecha actual)
    const hoy = new Date();
    const fechaReserva = new Date(fecha);
    
    // Convertir ambas fechas a YYYY-MM-DD para comparación correcta
    const hoyStr = hoy.toISOString().split('T')[0];
    const fechaReservaStr = fechaReserva.toISOString().split('T')[0];
    
    console.log('🔍 Validación de fecha (frontend):', {
      fechaSolicitada: fecha,
      fechaReservaStr: fechaReservaStr,
      hoyStr: hoyStr,
      esPasada: fechaReservaStr < hoyStr
    });
    
    if (fechaReservaStr < hoyStr) {
      setError('No puedes reservar fechas pasadas');
      return;
    }
    
    // Validar hora no pasada si es para hoy
    if (fechaReservaStr === hoyStr) {
      const ahora = new Date();
      const horaActual = ahora.getHours();
      const minutoActual = ahora.getMinutes();
      const horaReserva = parseInt(horaInicio.split(':')[0], 10);
      const minutoReserva = parseInt(horaInicio.split(':')[1], 10);
      
      console.log('🔍 Validación de hora (frontend):', {
        horaActual: `${horaActual}:${minutoActual}`,
        horaReserva: `${horaReserva}:${minutoReserva}`,
        esHoraPasada: (horaReserva < horaActual) || (horaReserva === horaActual && minutoReserva < minutoActual)
      });
      
      if ((horaReserva < horaActual) || (horaReserva === horaActual && minutoReserva < minutoActual)) {
        setError('No puedes reservar horas pasadas para el día actual');
        return;
      }
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
          <input 
            type="date" 
            className="form-control" 
            value={fecha} 
            onChange={e => setFecha(e.target.value)} 
            min={new Date().toISOString().split('T')[0]}
            required 
          />
          <small className="text-muted">No puedes seleccionar fechas pasadas</small>
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
          <input 
            type="text" 
            className="form-control" 
            value={horaFin} 
            readOnly 
            required 
            style={{ backgroundColor: '#f8f9fa' }}
          />
          <small className="text-muted">Se calcula automáticamente (una hora después del inicio)</small>
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
