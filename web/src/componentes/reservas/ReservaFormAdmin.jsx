import React from 'react';
import Swal from 'sweetalert2';

export default function ReservaFormAdmin({ form, onChange, onSubmit, onCancel, editReserva, canchas, usuarios, estadosReserva, submitting = false }) {
  console.log('🔍 ReservaFormAdmin - Form recibido:', form);
  console.log('🔍 ReservaFormAdmin - EditReserva:', editReserva);
  console.log('🔍 ReservaFormAdmin - Campos específicos:', {
    fecha: form.fecha,
    hora_inicio: form.hora_inicio,
    hora_fin: form.hora_fin,
    estado: form.estado
  });
  console.log('🔍 ReservaFormAdmin - Tipo de fecha:', typeof form.fecha, 'Valor:', form.fecha);
  const horas = Array.from({ length: 16 }, (_, i) => 7 + i); // 7:00 a 22:00

  const handleHoraInicio = (e) => {
    const inicio = e.target.value;
    onChange(e);
    if (inicio) {
      const hInicio = parseInt(inicio.split(':')[0], 10);
      const hFin = hInicio + 1;
      if (hFin <= 22) {
        onChange({
          target: {
            name: 'hora_fin',
            value: `${hFin}:00`
          }
        });
      }
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <div className="card-header">
        <h5 className="card-title mb-0">
          <i className={`bi ${editReserva ? 'bi-pencil-square' : 'bi-plus-circle'} me-2`}></i>
          {editReserva ? 'Editar Reserva' : 'Nueva Reserva'}
        </h5>
      </div>
      <div className="card-body">
        {/* Mensaje informativo para admin */}
        <div className="alert alert-info mb-3">
          <i className="bi bi-info-circle me-2"></i>
          <strong>Privilegios de Administrador:</strong> Puedes crear y editar reservas para cualquier fecha (pasada, presente o futura) y sobrescribir conflictos de horarios.
        </div>
        
        <div className="row">
          {/* Usuario */}
          <div className="col-md-6 mb-3">
            <label className="form-label">
              <i className="bi bi-person me-1"></i>
              Usuario
            </label>
            <select
              name="usuario_id"
              className="form-select"
              value={form.usuario_id}
              onChange={onChange}
              required
              disabled={submitting}
            >
              <option value="">Seleccionar usuario</option>
              {usuarios.map(usuario => (
                <option key={usuario.id} value={usuario.id}>
                  {usuario.nombres} - {usuario.codigo}
                </option>
              ))}
            </select>
          </div>

          {/* Cancha */}
          <div className="col-md-6 mb-3">
            <label className="form-label">
              <i className="bi bi-building me-1"></i>
              Cancha
            </label>
            <select
              name="cancha_id"
              className="form-select"
              value={form.cancha_id}
              onChange={onChange}
              required
              disabled={submitting}
            >
              <option value="">Seleccionar cancha</option>
              {canchas.map(cancha => (
                <option key={cancha.id} value={cancha.id}>
                  {cancha.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Fecha */}
          <div className="col-md-4 mb-3">
            <label className="form-label">
              <i className="bi bi-calendar me-1"></i>
              Fecha
            </label>
            <input
              type="date"
              name="fecha"
              className="form-control"
              value={form.fecha || ''}
              onChange={(e) => {
                console.log('🔍 Cambio de fecha detectado:', e.target.value);
                onChange(e);
              }}
              required
              disabled={submitting}
              // ADMIN TIENE ACCESO COMPLETO - SIN RESTRICCIONES DE FECHA
              // min={new Date().toISOString().split('T')[0]} // Comentado para admin
            />
          </div>

          {/* Hora Inicio */}
          <div className="col-md-4 mb-3">
            <label className="form-label">
              <i className="bi bi-clock me-1"></i>
              Hora Inicio
            </label>
            <select 
              className="form-select" 
              name="hora_inicio" 
              value={form.hora_inicio || ''} 
              onChange={handleHoraInicio} 
              required
              disabled={submitting}
            >
              <option value="">Selecciona hora inicio</option>
              {horas.map(h => (
                <option key={h} value={`${h}:00`}>{`${h}:00`}</option>
              ))}
            </select>
          </div>

          {/* Hora Fin */}
          <div className="col-md-4 mb-3">
            <label className="form-label">
              <i className="bi bi-clock-fill me-1"></i>
              Hora Fin
            </label>
            <input 
              type="text" 
              className="form-control" 
              name="hora_fin" 
              value={form.hora_fin || ''} 
              readOnly 
              required
              disabled={submitting}
              style={{ backgroundColor: '#f8f9fa' }}
            />
            <small className="text-muted">Se calcula automáticamente (una hora después del inicio)</small>
          </div>

          {/* Estado */}
          <div className="col-md-6 mb-3">
            <label className="form-label">
              <i className="bi bi-flag me-1"></i>
              Estado
            </label>
            <select
              name="estado"
              className="form-select"
              value={form.estado}
              onChange={onChange}
              required
              disabled={submitting}
            >
              <option value="">Seleccionar estado</option>
              {estadosReserva.map(estado => (
                <option key={estado} value={estado}>
                  {estado.charAt(0).toUpperCase() + estado.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      <div className="card-footer">
        <div className="d-flex justify-content-end gap-2">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onCancel}
            disabled={submitting}
          >
            <i className="bi bi-x-circle me-1"></i>
            Cancelar
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={submitting}
          >
            {submitting ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                {editReserva ? 'Actualizando...' : 'Creando...'}
              </>
            ) : (
              <>
                <i className={`bi ${editReserva ? 'bi-check-circle' : 'bi-plus-circle'} me-1`}></i>
                {editReserva ? 'Actualizar' : 'Crear'}
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
} 