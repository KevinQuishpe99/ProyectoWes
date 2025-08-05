import React, { useEffect, useState } from 'react';
import api from '../../servicios/api';
import { formatearFechaCorta, normalizarHora } from '../../utils/dateUtils';
import { contieneTexto } from '../../utils/textUtils';

const tipoColors = {
  'Torneo': 'bg-success',
  'Partido': 'bg-primary',
  'Exhibición': 'bg-warning',
  'Otro': 'bg-secondary'
};

const estadoColors = {
  'agendado': 'bg-info',
  'en proceso': 'bg-warning',
  'finalizado': 'bg-success'
};

const getTipoIcon = (tipo) => {
  const iconos = {
    'Torneo': 'bi-trophy',
    'Entrenamiento': 'bi-person-workspace',
    'Exhibición': 'bi-star',
    'Clase': 'bi-book',
    'Competencia': 'bi-award',
    'Partido': 'bi-people',
    'Otro': 'bi-calendar-event'
  };
  return iconos[tipo] || 'bi-calendar-event';
};

export default function EventosUsuario() {
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filtroNombre, setFiltroNombre] = useState('');

  useEffect(() => {
    const fetchEventos = async () => {
      setLoading(true);
      setError(null);
      try {
        const hoy = new Date();
        const hasta = new Date();
        hasta.setDate(hoy.getDate() + 7);
        const desdeStr = hoy.toISOString().slice(0, 10);
        const hastaStr = hasta.toISOString().slice(0, 10);
        const res = await api.get('/eventos', { params: { desde: desdeStr, hasta: hastaStr } });
        setEventos(res.data);
      } catch (err) {
        setError('No se pudieron cargar los eventos');
      } finally {
        setLoading(false);
      }
    };
    fetchEventos();
  }, []);

  const eventosFiltrados = eventos.filter(ev => {
    const nombreOk = !filtroNombre || contieneTexto(ev.nombre, filtroNombre);
    return nombreOk;
  });

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p className="mt-3 text-muted">Cargando eventos próximos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-5">
        <i className="bi bi-exclamation-triangle display-1 text-danger"></i>
        <h5 className="mt-3 text-danger">Error al cargar eventos</h5>
        <p className="text-muted">{error}</p>
      </div>
    );
  }

  if (eventosFiltrados.length === 0) {
    return (
      <div>
        <h2 className="mb-4">Eventos próximos (7 días)</h2>
        
        {/* Filtros */}
        <div className="row g-2 mb-3">
          <div className="col-md-6">
            <div className="input-group">
              <span className="input-group-text">
                <i className="bi bi-search"></i>
              </span>
              <input 
                type="text" 
                className="form-control" 
                placeholder="Buscar por nombre..." 
                value={filtroNombre} 
                onChange={e => setFiltroNombre(e.target.value)} 
              />
            </div>
          </div>
        </div>

        {/* Mensaje cuando no hay eventos */}
        <div className="alert alert-info mb-3">
          <i className="bi bi-info-circle me-2"></i>
          No hay eventos disponibles.
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="mb-4">Eventos próximos (7 días)</h2>
      
      {/* Filtros */}
      <div className="row g-2 mb-3">
        <div className="col-md-6">
          <div className="input-group">
            <span className="input-group-text">
              <i className="bi bi-search"></i>
            </span>
            <input 
              type="text" 
              className="form-control" 
              placeholder="Buscar por nombre..." 
              value={filtroNombre} 
              onChange={e => setFiltroNombre(e.target.value)} 
            />
        </div>
        </div>
      </div>

      {/* Lista de eventos */}
      <div className="d-flex flex-column gap-3">
        {/* Fila de títulos */}
        <div className="bg-light border rounded-3 p-3 d-flex align-items-center">
          <div style={{ width: '20%' }}>
            <h6 className="mb-0 fw-bold text-primary">Evento</h6>
          </div>
          <div className="text-center" style={{ width: '15%' }}>
            <h6 className="mb-0 fw-bold text-primary">Tipo</h6>
          </div>
          <div className="text-center" style={{ width: '15%' }}>
            <h6 className="mb-0 fw-bold text-primary">Cancha</h6>
          </div>
          <div className="text-center" style={{ width: '10%' }}>
            <h6 className="mb-0 fw-bold text-primary">Estado</h6>
          </div>
          <div className="text-center" style={{ width: '12%' }}>
            <h6 className="mb-0 fw-bold text-primary">Fecha Inicio</h6>
          </div>
          <div className="text-center" style={{ width: '12%' }}>
            <h6 className="mb-0 fw-bold text-primary">Fecha Fin</h6>
          </div>
          <div className="text-center" style={{ width: '8%' }}>
            <h6 className="mb-0 fw-bold text-primary">Hora Inicio</h6>
          </div>
          <div className="text-center" style={{ width: '8%' }}>
            <h6 className="mb-0 fw-bold text-primary">Hora Fin</h6>
          </div>
        </div>

                {eventosFiltrados.map(ev => (
          <div key={ev.id} className="bg-white border rounded-3 shadow-sm">
            <div className="p-3 d-flex align-items-center">
              {/* Nombre del evento */}
              <div style={{ width: '20%' }}>
                <div>
                  <h6 className="mb-0 fw-bold small">{ev.nombre}</h6>
                  {ev.descripcion && (
                    <small className="text-muted text-truncate d-block" style={{ maxWidth: '150px' }}>
                      {ev.descripcion}
                    </small>
                  )}
                </div>
              </div>

              {/* Tipo de evento */}
              <div className="text-center" style={{ width: '15%' }}>
                <div className="d-flex align-items-center justify-content-center gap-2">
                  <i className={`bi ${getTipoIcon(ev.tipo)} text-primary`}></i>
                  <span className={`badge ${tipoColors[ev.tipo] || 'bg-secondary'}`}>
                    {ev.tipo}
                  </span>
                </div>
              </div>

              {/* Cancha */}
              <div className="text-center" style={{ width: '15%' }}>
                <div className="d-flex align-items-center justify-content-center gap-1">
                  <i className="bi bi-geo-alt text-primary small"></i>
                  <span className="fw-semibold small">{ev.cancha?.nombre || 'N/A'}</span>
                </div>
              </div>

              {/* Estado */}
              <div className="text-center" style={{ width: '10%' }}>
                <span className={`badge ${estadoColors[ev.estado] || 'bg-secondary'}`}>
                  {ev.estado}
                </span>
              </div>

              {/* Fecha Inicio */}
              <div className="text-center" style={{ width: '12%' }}>
                <div className="d-flex align-items-center justify-content-center gap-1">
                  <i className="bi bi-calendar-plus text-success small"></i>
                  <span className="fw-semibold small">{formatearFechaCorta(ev.fecha_inicio)}</span>
                </div>
              </div>

              {/* Fecha Fin */}
              <div className="text-center" style={{ width: '12%' }}>
                <div className="d-flex align-items-center justify-content-center gap-1">
                  <i className="bi bi-calendar-check text-danger small"></i>
                  <span className="fw-semibold small">{formatearFechaCorta(ev.fecha_fin)}</span>
                </div>
              </div>

              {/* Hora Inicio */}
              <div className="text-center" style={{ width: '8%' }}>
                <div className="d-flex align-items-center justify-content-center gap-1">
                  <i className="bi bi-clock text-primary small"></i>
                  <span className="fw-semibold small">{normalizarHora(ev.hora_inicio)}</span>
                </div>
              </div>

              {/* Hora Fin */}
              <div className="text-center" style={{ width: '8%' }}>
                <div className="d-flex align-items-center justify-content-center gap-1">
                  <i className="bi bi-clock-fill text-primary small"></i>
                  <span className="fw-semibold small">{normalizarHora(ev.hora_fin)}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 