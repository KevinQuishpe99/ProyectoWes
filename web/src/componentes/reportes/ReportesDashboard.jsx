import React, { useEffect, useState } from 'react';
import ReportesService from '../../servicios/reportes/reportesService';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, LineChart, Line, AreaChart, Area
} from 'recharts';

const COLORS = ['#2563eb', '#ef4444', '#22c55e', '#f59e42', '#a855f7', '#eab308', '#06b6d4', '#84cc16'];

export default function ReportesDashboard() {
  const [reservas, setReservas] = useState([]);
  const [eventos, setEventos] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [canchas, setCanchas] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filtros dinámicos
  const [filtros, setFiltros] = useState({
    fechaDesde: '',
    fechaHasta: '',
    canchaSeleccionada: '',
    tipoEvento: '',
    estadoReserva: '',
    estadoEvento: ''
  });

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const [reservas, eventos, canchas, feedbacks] = await Promise.all([
          ReportesService.getReservas(),
          ReportesService.getEventos(),
          ReportesService.getCanchas(),
          ReportesService.getFeedbacks()
        ]);
        setReservas(reservas);
        setEventos(eventos);
        setCanchas(canchas);
        setFeedbacks(feedbacks);
      } catch (e) {
        console.error('Error cargando datos del dashboard:', e);
      }
      setLoading(false);
    };
    fetchAll();
  }, []);

  // Función para aplicar filtros
  const aplicarFiltros = (datos, tipo) => {
    let datosFiltrados = [...datos];

    // Filtro por fecha
    if (filtros.fechaDesde || filtros.fechaHasta) {
      datosFiltrados = datosFiltrados.filter(item => {
        const fecha = new Date(tipo === 'reservas' ? item.fecha : item.fecha_inicio);
        const desde = filtros.fechaDesde ? new Date(filtros.fechaDesde) : null;
        const hasta = filtros.fechaHasta ? new Date(filtros.fechaHasta) : null;
        
        if (desde && fecha < desde) return false;
        if (hasta && fecha > hasta) return false;
      return true;
    });
    }

    // Filtro por cancha
    if (filtros.canchaSeleccionada) {
      datosFiltrados = datosFiltrados.filter(item => 
        item.cancha_id === parseInt(filtros.canchaSeleccionada)
      );
    }

    // Filtros específicos por tipo
    if (tipo === 'eventos' && filtros.tipoEvento) {
      datosFiltrados = datosFiltrados.filter(item => item.tipo === filtros.tipoEvento);
    }

    if (tipo === 'reservas' && filtros.estadoReserva) {
      datosFiltrados = datosFiltrados.filter(item => item.estado === filtros.estadoReserva);
    }

    if (tipo === 'eventos' && filtros.estadoEvento) {
      datosFiltrados = datosFiltrados.filter(item => item.estado === filtros.estadoEvento);
    }

    return datosFiltrados;
  };

  // Datos filtrados
  const reservasFiltradas = aplicarFiltros(reservas, 'reservas');
  const eventosFiltrados = aplicarFiltros(eventos, 'eventos');
  const feedbacksFiltrados = aplicarFiltros(feedbacks, 'feedbacks');

  // Gráfica: Canchas más ocupadas (por reservas)
  const canchasPorId = reservasFiltradas.reduce((acc, r) => {
    acc[r.cancha_id] = (acc[r.cancha_id] || 0) + 1;
    return acc;
  }, {});
  const canchasOcupadasData = Object.entries(canchasPorId)
    .map(([id, count]) => {
      const cancha = canchas.find(c => c.id === Number(id));
      return { name: cancha?.nombre || 'Desconocida', count, canchaId: id };
    })
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // Gráfica: Canchas con más comentarios (por feedbacks)
  const canchaFeedbacks = feedbacksFiltrados.reduce((acc, f) => {
    acc[f.cancha_id] = (acc[f.cancha_id] || 0) + 1;
    return acc;
  }, {});
  const canchasComentariosData = Object.entries(canchaFeedbacks)
    .map(([id, count]) => {
      const cancha = canchas.find(c => c.id === Number(id));
      return { name: cancha?.nombre || 'Desconocida', count, canchaId: id };
    })
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // Gráfica: Reservas por mes (línea de tendencia)
  const reservasPorMes = reservasFiltradas.reduce((acc, r) => {
    const mes = r.fecha?.slice(0, 7) || 'Sin fecha';
    acc[mes] = (acc[mes] || 0) + 1;
    return acc;
  }, {});
  const reservasMesData = Object.entries(reservasPorMes)
    .map(([mes, count]) => ({ mes, count }))
    .sort((a, b) => a.mes.localeCompare(b.mes));

  // Gráfica: Eventos por tipo
  const eventosPorTipo = eventosFiltrados.reduce((acc, e) => {
    acc[e.tipo] = (acc[e.tipo] || 0) + 1;
    return acc;
  }, {});
  const eventosTipoData = Object.entries(eventosPorTipo).map(([tipo, value]) => ({ name: tipo, value }));

  // Gráfica: Ocupación por hora del día
  const ocupacionPorHora = reservasFiltradas.reduce((acc, r) => {
    const hora = r.hora_inicio?.split(':')[0] || '0';
    acc[hora] = (acc[hora] || 0) + 1;
    return acc;
  }, {});
  const ocupacionHoraData = Array.from({ length: 24 }, (_, i) => ({
    hora: `${i.toString().padStart(2, '0')}:00`,
    reservas: ocupacionPorHora[i] || 0
  }));

  // Estadísticas generales
  const estadisticas = {
    totalReservas: reservasFiltradas.length,
    totalEventos: eventosFiltrados.length,
    totalFeedbacks: feedbacksFiltrados.length,
    totalCanchas: canchas.length,
    reservasActivas: reservasFiltradas.filter(r => r.estado === 'reservada').length,
    eventosActivos: eventosFiltrados.filter(e => e.estado === 'agendado').length,
    feedbacksSinResponder: feedbacksFiltrados.filter(f => !f.respuesta).length,
    promedioCalificacion: feedbacksFiltrados.length > 0 
      ? (feedbacksFiltrados.reduce((sum, f) => sum + f.calificacion, 0) / feedbacksFiltrados.length).toFixed(1)
      : 0
  };

  const limpiarFiltros = () => {
    setFiltros({
      fechaDesde: '',
      fechaHasta: '',
      canchaSeleccionada: '',
      tipoEvento: '',
      estadoReserva: '',
      estadoEvento: ''
    });
  };

  const handleFiltroChange = (campo, valor) => {
    setFiltros(prev => ({ ...prev, [campo]: valor }));
  };

  if (loading) {
    return (
      <div className="container py-4">
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="mt-3 text-muted fs-5">Cargando dashboard dinámico...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4">
      <div className="row mb-4">
        <div className="col-12">
          <h2 className="panel-title mb-3">
            <i className="bi bi-graph-up-arrow text-primary me-2"></i>
            Dashboard Dinámico
          </h2>
        </div>
      </div>

      {/* Filtros modernos tipo PowerBI */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-header text-white" style={{background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)'}}>
              <h6 className="mb-0">
                <i className="bi bi-funnel me-2"></i>
                Filtros Dinámicos
              </h6>
            </div>
            <div className="card-body">
              <div className="row g-3">
                <div className="col-md-2">
                  <label className="form-label fw-bold">Desde</label>
                  <input 
                    type="date" 
                    className="form-control form-control-sm" 
                    value={filtros.fechaDesde} 
                    onChange={e => handleFiltroChange('fechaDesde', e.target.value)}
                  />
                </div>
                <div className="col-md-2">
                  <label className="form-label fw-bold">Hasta</label>
                  <input 
                    type="date" 
                    className="form-control form-control-sm" 
                    value={filtros.fechaHasta} 
                    onChange={e => handleFiltroChange('fechaHasta', e.target.value)}
                  />
                </div>
                <div className="col-md-2">
                  <label className="form-label fw-bold">Cancha</label>
                  <select 
                    className="form-select form-select-sm" 
                    value={filtros.canchaSeleccionada} 
                    onChange={e => handleFiltroChange('canchaSeleccionada', e.target.value)}
                  >
                    <option value="">Todas</option>
                    {canchas.map(cancha => (
                      <option key={cancha.id} value={cancha.id}>{cancha.nombre}</option>
                    ))}
                  </select>
                </div>
                <div className="col-md-2">
                  <label className="form-label fw-bold">Tipo Evento</label>
                  <select 
                    className="form-select form-select-sm" 
                    value={filtros.tipoEvento} 
                    onChange={e => handleFiltroChange('tipoEvento', e.target.value)}
                  >
                    <option value="">Todos</option>
                    <option value="Torneo">Torneo</option>
                    <option value="Entrenamiento">Entrenamiento</option>
                    <option value="Exhibición">Exhibición</option>
                    <option value="Clase">Clase</option>
                    <option value="Competencia">Competencia</option>
                    <option value="Otro">Otro</option>
                  </select>
                </div>
                <div className="col-md-2">
                  <label className="form-label fw-bold">Estado Reserva</label>
                  <select 
                    className="form-select form-select-sm" 
                    value={filtros.estadoReserva} 
                    onChange={e => handleFiltroChange('estadoReserva', e.target.value)}
                  >
                    <option value="">Todos</option>
                    <option value="reservada">Reservada</option>
                    <option value="cancelada">Cancelada</option>
                  </select>
                </div>
                <div className="col-md-2 d-flex align-items-end">
                  <button 
                    className="btn btn-outline-secondary btn-sm w-100" 
                    onClick={limpiarFiltros}
                  >
                    <i className="bi bi-arrow-clockwise me-1"></i>
                    Limpiar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Estadísticas generales con animaciones */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-md-2">
          <div className="card text-white h-100 border-0 shadow-sm hover-lift" style={{background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)'}}>
            <div className="card-body text-center">
              <i className="bi bi-calendar-check display-6 mb-2"></i>
              <h3 className="mb-1 fw-bold">{estadisticas.totalReservas}</h3>
              <small className="opacity-75">Total Reservas</small>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-2">
          <div className="card text-white h-100 border-0 shadow-sm hover-lift" style={{background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)'}}>
            <div className="card-body text-center">
              <i className="bi bi-check-circle display-6 mb-2"></i>
              <h3 className="mb-1 fw-bold">{estadisticas.reservasActivas}</h3>
              <small className="opacity-75">Reservas Activas</small>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-2">
          <div className="card text-white h-100 border-0 shadow-sm hover-lift" style={{background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)'}}>
            <div className="card-body text-center">
              <i className="bi bi-trophy display-6 mb-2"></i>
              <h3 className="mb-1 fw-bold">{estadisticas.totalEventos}</h3>
              <small className="opacity-75">Total Eventos</small>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-2">
          <div className="card text-white h-100 border-0 shadow-sm hover-lift" style={{background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'}}>
            <div className="card-body text-center">
              <i className="bi bi-star display-6 mb-2"></i>
              <h3 className="mb-1 fw-bold">{estadisticas.eventosActivos}</h3>
              <small className="opacity-75">Eventos Activos</small>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-2">
          <div className="card text-white h-100 border-0 shadow-sm hover-lift" style={{background: 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)'}}>
            <div className="card-body text-center">
              <i className="bi bi-chat-dots display-6 mb-2"></i>
              <h3 className="mb-1 fw-bold">{estadisticas.totalFeedbacks}</h3>
              <small className="opacity-75">Total Feedbacks</small>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-2">
          <div className="card text-white h-100 border-0 shadow-sm hover-lift" style={{background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'}}>
            <div className="card-body text-center">
              <i className="bi bi-exclamation-circle display-6 mb-2"></i>
              <h3 className="mb-1 fw-bold">{estadisticas.feedbacksSinResponder}</h3>
              <small className="opacity-75">Sin Responder</small>
            </div>
          </div>
        </div>
      </div>

      {/* Gráficas modernas */}
      <div className="row g-4">
          <div className="col-12 col-lg-6">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-light">
              <h6 className="fw-bold mb-0">
                <i className="bi bi-bar-chart text-primary me-2"></i>
                Top 5 Canchas Más Ocupadas
              </h6>
            </div>
            <div className="card-body p-3">
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={canchasOcupadasData} layout="horizontal" margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis type="category" dataKey="name" stroke="#888" fontSize={11} />
                  <YAxis type="number" allowDecimals={false} stroke="#888" fontSize={11} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(255,255,255,0.95)', 
                      border: '1px solid #ddd',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                    }}
                  />
                  <Bar 
                    dataKey="count" 
                    fill="url(#gradient1)" 
                    radius={[4, 4, 0, 0]} 
                    isAnimationActive={true}
                    animationDuration={1500}
                  />
                  <defs>
                    <linearGradient id="gradient1" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#2563eb" />
                      <stop offset="100%" stopColor="#1d4ed8" />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </div>
            </div>
          </div>
          <div className="col-12 col-lg-6">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-light">
              <h6 className="fw-bold mb-0">
                <i className="bi bi-chat-square-text text-danger me-2"></i>
                Top 5 Canchas Con Más Comentarios
              </h6>
            </div>
            <div className="card-body p-3">
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={canchasComentariosData} layout="horizontal" margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis type="category" dataKey="name" stroke="#888" fontSize={11} />
                  <YAxis type="number" allowDecimals={false} stroke="#888" fontSize={11} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(255,255,255,0.95)', 
                      border: '1px solid #ddd',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                    }}
                  />
                  <Bar 
                    dataKey="count" 
                    fill="url(#gradient2)" 
                    radius={[4, 4, 0, 0]} 
                    isAnimationActive={true}
                    animationDuration={1500}
                  />
                  <defs>
                    <linearGradient id="gradient2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#ef4444" />
                      <stop offset="100%" stopColor="#dc2626" />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </div>
            </div>
          </div>
          <div className="col-12 col-lg-6">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-light">
              <h6 className="fw-bold mb-0">
                <i className="bi bi-graph-up text-success me-2"></i>
                Tendencia de Reservas por Mes
              </h6>
            </div>
            <div className="card-body p-3">
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={reservasMesData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="mes" stroke="#888" fontSize={11} />
                  <YAxis allowDecimals={false} stroke="#888" fontSize={11} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(255,255,255,0.95)', 
                      border: '1px solid #ddd',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="count" 
                    stroke="#22c55e" 
                    fill="url(#gradient3)"
                    strokeWidth={3}
                    isAnimationActive={true}
                    animationDuration={1500}
                  />
                  <defs>
                    <linearGradient id="gradient3" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#22c55e" stopOpacity={0.8} />
                      <stop offset="100%" stopColor="#22c55e" stopOpacity={0.1} />
                    </linearGradient>
                  </defs>
                </AreaChart>
              </ResponsiveContainer>
            </div>
            </div>
          </div>
          <div className="col-12 col-lg-6">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-light">
              <h6 className="fw-bold mb-0">
                <i className="bi bi-pie-chart text-warning me-2"></i>
                Distribución de Eventos por Tipo
              </h6>
            </div>
            <div className="card-body p-3">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie 
                    data={eventosTipoData} 
                    dataKey="value" 
                    nameKey="name" 
                    cx="50%" 
                    cy="50%" 
                    outerRadius={80} 
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    isAnimationActive={true}
                    animationDuration={1500}
                  >
                    {eventosTipoData.map((entry, idx) => (
                      <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(255,255,255,0.95)', 
                      border: '1px solid #ddd',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-light">
              <h6 className="fw-bold mb-0">
                <i className="bi bi-clock text-info me-2"></i>
                Ocupación por Hora del Día
              </h6>
      </div>
            <div className="card-body p-3">
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={ocupacionHoraData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="hora" stroke="#888" fontSize={11} />
                  <YAxis allowDecimals={false} stroke="#888" fontSize={11} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(255,255,255,0.95)', 
                      border: '1px solid #ddd',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="reservas" 
                    stroke="#06b6d4" 
                    strokeWidth={3}
                    dot={{ fill: '#06b6d4', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: '#06b6d4', strokeWidth: 2 }}
                    isAnimationActive={true}
                    animationDuration={1500}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
