import React from 'react';
import { normalizarHora } from '../../utils/dateUtils';
import Swal from 'sweetalert2';

export default function EventoForm({ form, onChange, onSubmit, onCancel, editEvento, canchas, estadosEvento }) {
  console.log('🔍 EventoForm - Form recibido:', form);
  console.log('🔍 EventoForm - EditEvento:', editEvento);
  console.log('🔍 EventoForm - Hora inicio en form:', {
    hora_inicio: form.hora_inicio,
    normalizada: normalizarHora(form.hora_inicio),
    tipo: typeof form.hora_inicio
  });
  const horas = Array.from({ length: 16 }, (_, i) => 7 + i); // 7:00 a 22:00

  const handleHoraInicio = (e) => {
    const inicio = e.target.value;
    // Crear un evento sintético para mantener la compatibilidad con onChange
    const syntheticEvent = {
      target: {
        name: 'hora_inicio',
        value: inicio
      }
    };
    onChange(syntheticEvent);
    
    // Si hay hora de inicio y la hora de fin actual es menor o igual, calcular automáticamente la hora de fin
    if (inicio) {
      const hInicio = parseInt(inicio.split(':')[0], 10);
      const hFinActual = parseInt(form.hora_fin?.split(':')[0] || '0', 10);
      
      if (hFinActual <= hInicio) {
        const siguiente = hInicio + 1;
        const syntheticEventFin = {
          target: {
            name: 'hora_fin',
            value: `${siguiente}:00`
          }
        };
        onChange(syntheticEventFin);
      }
    }
  };

  const handleHoraFin = (e) => {
    const fin = e.target.value;
    const inicio = form.hora_inicio;
    
    // Validar que la hora de fin no sea menor o igual a la hora de inicio
    if (inicio && fin) {
      const hInicio = parseInt(inicio.split(':')[0], 10);
      const hFin = parseInt(fin.split(':')[0], 10);
      
      if (hFin <= hInicio) {
        Swal.fire({
          icon: 'warning',
          title: 'Hora inválida',
          text: 'La hora de fin debe ser mayor a la hora de inicio',
          confirmButtonColor: '#3085d6'
        });
        return;
      }
    }
    
    // Crear un evento sintético para mantener la compatibilidad con onChange
    const syntheticEvent = {
      target: {
        name: 'hora_fin',
        value: fin
      }
    };
    onChange(syntheticEvent);
  };

  return (
    <div className="position-relative">
      <button
        type="button"
        className="btn-close position-absolute"
        style={{ top: -10, right: -10, zIndex: 10, backgroundColor: 'white', borderRadius: '50%', padding: '8px' }}
        onClick={onCancel}
        aria-label="Cerrar"
      ></button>
      
      <form onSubmit={onSubmit}>
        <h4 className="modal-title-llamativo mb-3">
          {editEvento ? 'Editar Evento' : 'Nuevo Evento'}
        </h4>
        
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Nombre del Evento *</label>
            <input
              type="text"
              className="form-control"
              name="nombre"
              value={form.nombre}
              onChange={onChange}
              required
              placeholder="Ej: Torneo de Fútbol"
            />
          </div>
          
          <div className="col-md-6 mb-3">
            <label className="form-label">Tipo de Evento *</label>
            <select
              className="form-select"
              name="tipo"
              value={form.tipo}
              onChange={onChange}
              required
            >
              <option value="">Selecciona el tipo</option>
              <option value="Torneo">Torneo</option>
              <option value="Entrenamiento">Entrenamiento</option>
              <option value="Exhibición">Exhibición</option>
              <option value="Clase">Clase</option>
              <option value="Competencia">Competencia</option>
              <option value="Otro">Otro</option>
            </select>
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label">Descripción</label>
          <textarea
            className="form-control"
            name="descripcion"
            value={form.descripcion}
            onChange={onChange}
            rows="3"
            placeholder="Descripción detallada del evento..."
          />
        </div>

        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Cancha *</label>
            <select
              className="form-select"
              name="cancha_id"
              value={form.cancha_id}
              onChange={onChange}
              required
            >
              <option value="">Selecciona una cancha</option>
              {canchas.map(cancha => (
                <option key={cancha.id} value={cancha.id}>
                  {cancha.nombre} - {cancha.tipoEspacio?.nombre}
                </option>
              ))}
            </select>
          </div>
          
          <div className="col-md-6 mb-3">
            <label className="form-label">Estado *</label>
            <select
              className="form-select"
              name="estado"
              value={form.estado}
              onChange={onChange}
              required
            >
              <option value="">Selecciona el estado</option>
              {estadosEvento.map(estado => (
                <option key={estado.id} value={estado.id}>
                  {estado.nombre}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Fecha de Inicio *</label>
            <input
              type="date"
              className="form-control"
              name="fecha_inicio"
              value={form.fecha_inicio}
              onChange={onChange}
              required
            />
          </div>
          
          <div className="col-md-6 mb-3">
            <label className="form-label">Fecha de Fin *</label>
            <input
              type="date"
              className="form-control"
              name="fecha_fin"
              value={form.fecha_fin}
              onChange={onChange}
              required
            />
          </div>
        </div>

        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Hora de Inicio *</label>
            <select 
              className="form-select" 
              name="hora_inicio" 
              value={form.hora_inicio || ''} 
              onChange={handleHoraInicio} 
              required
            >
              <option value="">Selecciona hora inicio</option>
              {horas.map(h => (
                <option key={h} value={`${h}:00`}>{`${h}:00`}</option>
              ))}
            </select>
          </div>
          
          <div className="col-md-6 mb-3">
            <label className="form-label">Hora de Fin *</label>
            <select 
              className="form-select" 
              name="hora_fin" 
              value={form.hora_fin || ''} 
              onChange={handleHoraFin} 
              required
            >
              <option value="">Selecciona hora fin</option>
              {horas.map(h => {
                const hInicio = parseInt(form.hora_inicio?.split(':')[0] || '0', 10);
                // Solo mostrar horas mayores a la hora de inicio
                if (h > hInicio) {
                  return <option key={h} value={`${h}:00`}>{`${h}:00`}</option>;
                }
                return null;
              })}
            </select>
            <small className="text-muted">Debe ser mayor a la hora de inicio</small>
          </div>
        </div>

        <div className="d-flex gap-2 justify-content-end">
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            Cancelar
          </button>
          <button type="submit" className="btn btn-primary">
            {editEvento ? 'Actualizar' : 'Crear'} Evento
          </button>
        </div>
      </form>
    </div>
  );
} 
