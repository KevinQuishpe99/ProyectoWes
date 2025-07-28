import React, { useEffect, useState, useRef } from 'react';
import ReportesService from '../../servicios/reportes/reportesService';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import * as XLSX from 'xlsx';

const COLORS = ['#2563eb', '#ef4444', '#22c55e', '#f59e42', '#a855f7', '#eab308'];

export default function ReportesDashboard() {
  const [reservas, setReservas] = useState([]);
  const [eventos, setEventos] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [canchas, setCanchas] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [dateRange, setDateRange] = useState({ from: '', to: '' });
  const [modal, setModal] = useState({ open: false, title: '', data: [] });
  const [loading, setLoading] = useState(true);
  const dashboardRef = useRef();

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const [reservas, eventos, canchas, feedbacks, usuarios] = await Promise.all([
          ReportesService.getReservas(),
          ReportesService.getEventos(),
          ReportesService.getCanchas(),
          ReportesService.getFeedbacks(),
          ReportesService.getUsuarios()
        ]);
        setReservas(reservas);
        setEventos(eventos);
        setCanchas(canchas);
        setFeedbacks(feedbacks);
        setUsuarios(usuarios);
      } catch (e) {}
      setLoading(false);
    };
    fetchAll();
  }, []);

  // Filtros por fecha
  const filterByDate = (arr, field) => {
    if (!dateRange.from && !dateRange.to) return arr;
    return arr.filter(item => {
      const date = new Date(item[field]);
      const from = dateRange.from ? new Date(dateRange.from) : null;
      const to = dateRange.to ? new Date(dateRange.to) : null;
      if (from && date < from) return false;
      if (to && date > to) return false;
      return true;
    });
  };

  // Gráfica: Canchas más ocupadas (por reservas)
  const reservasFiltradas = filterByDate(reservas, 'fecha');
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
  const feedbacksFiltrados = filterByDate(feedbacks, 'fecha');
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

  // Gráfica: Reservas por mes
  const reservasPorMes = reservasFiltradas.reduce((acc, r) => {
    const mes = r.fecha?.slice(0, 7) || 'Sin fecha';
    acc[mes] = (acc[mes] || 0) + 1;
    return acc;
  }, {});
  const reservasMesData = Object.entries(reservasPorMes).map(([mes, count]) => ({ mes, count }));

  // Gráfica: Eventos por tipo
  const eventosFiltrados = filterByDate(eventos, 'fecha_inicio');
  const eventosPorTipo = eventosFiltrados.reduce((acc, e) => {
    acc[e.tipo] = (acc[e.tipo] || 0) + 1;
    return acc;
  }, {});
  const eventosTipoData = Object.entries(eventosPorTipo).map(([tipo, value]) => ({ name: tipo, value }));

  // Modal de detalles
  const openModal = (title, data) => setModal({ open: true, title, data });
  const closeModal = () => setModal({ open: false, title: '', data: [] });

  // Descargar PDF
  const handleDownloadPDF = async () => {
    if (!dashboardRef.current) return;
    const canvas = await html2canvas(dashboardRef.current, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'a4' });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = pageWidth - 40;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    pdf.addImage(imgData, 'PNG', 20, 20, imgWidth, imgHeight);
    pdf.save('reporte-epn.pdf');
  };

  // Exportar a Excel
  const exportToExcel = (type) => {
    let data = [];
    if (type === 'reservas') {
      data = reservas.map(r => {
        const cancha = canchas.find(c => c.id === r.cancha_id) || r.cancha;
        const usuario = usuarios.find(u => u.id === r.usuario_id) || r.usuario;
        return {
          'ID Reserva': r.id,
          'Fecha': r.fecha,
          'Hora inicio': r.hora_inicio,
          'Hora fin': r.hora_fin,
          'Estado': r.estado,
          'Usuario ID': usuario?.id || r.usuario_id,
          'Usuario Nombre': usuario?.nombres || usuario?.nombre || '',
          'Usuario Correo': usuario?.correo || '',
          'Usuario Código': usuario?.codigo || '',
          'Usuario Rol': usuario?.rol?.nombre || usuario?.rol || '',
          'Cancha ID': cancha?.id || r.cancha_id,
          'Cancha Nombre': cancha?.nombre || '',
          'Cancha Capacidad': cancha?.capacidad || '',
          'Tipo Espacio': cancha?.tipoEspacio?.nombre || '',
          'Estado Cancha': cancha?.estadoCancha?.nombre || '',
          'Ubicación': cancha?.ubicacion_referencia || '',
          'Descripción Cancha': cancha?.descripcion || ''
        };
      });
    } else if (type === 'eventos') {
      data = eventos.map(e => {
        const cancha = canchas.find(c => c.id === e.cancha_id) || e.cancha;
        return {
          'ID Evento': e.id,
          'Nombre': e.nombre,
          'Tipo': e.tipo,
          'Descripción': e.descripcion || '',
          'Fecha inicio': e.fecha_inicio,
          'Fecha fin': e.fecha_fin,
          'Hora inicio': e.hora_inicio,
          'Hora fin': e.hora_fin,
          'Estado': e.estado,
          'Cancha ID': cancha?.id || e.cancha_id,
          'Cancha Nombre': cancha?.nombre || '',
          'Cancha Capacidad': cancha?.capacidad || '',
          'Tipo Espacio': cancha?.tipoEspacio?.nombre || '',
          'Estado Cancha': cancha?.estadoCancha?.nombre || '',
          'Ubicación': cancha?.ubicacion_referencia || '',
          'Descripción Cancha': cancha?.descripcion || ''
        };
      });
    } else if (type === 'feedbacks') {
      data = feedbacks.map(f => {
        const cancha = canchas.find(c => c.id === f.cancha_id) || f.cancha;
        const usuario = usuarios.find(u => u.id === f.usuario_id) || f.usuario;
        return {
          'ID Feedback': f.id,
          'Fecha': f.fecha,
          'Calificación': f.calificacion,
          'Comentario': f.comentario,
          'Respuesta': f.respuesta || '',
          'Usuario ID': usuario?.id || f.usuario_id,
          'Usuario Nombre': usuario?.nombres || usuario?.nombre || '',
          'Usuario Correo': usuario?.correo || '',
          'Usuario Código': usuario?.codigo || '',
          'Usuario Rol': usuario?.rol?.nombre || usuario?.rol || '',
          'Cancha ID': cancha?.id || f.cancha_id,
          'Cancha Nombre': cancha?.nombre || '',
          'Cancha Capacidad': cancha?.capacidad || '',
          'Tipo Espacio': cancha?.tipoEspacio?.nombre || '',
          'Estado Cancha': cancha?.estadoCancha?.nombre || '',
          'Ubicación': cancha?.ubicacion_referencia || '',
          'Descripción Cancha': cancha?.descripcion || ''
        };
      });
    }
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, type.charAt(0).toUpperCase() + type.slice(1));
    XLSX.writeFile(wb, `reporte-${type}-epn.xlsx`);
  };

  return (
    <div className="container py-4">
      <h2 className="panel-title mb-4">Reportes del Sistema</h2>
      {/* Filtros solo por fecha */}
      <div className="row mb-4 align-items-end g-2">
        <div className="col-12 col-md-3">
          <label className="form-label">Desde</label>
          <input type="date" className="form-control" value={dateRange.from} onChange={e => setDateRange(r => ({ ...r, from: e.target.value }))} />
        </div>
        <div className="col-12 col-md-3">
          <label className="form-label">Hasta</label>
          <input type="date" className="form-control" value={dateRange.to} onChange={e => setDateRange(r => ({ ...r, to: e.target.value }))} />
        </div>
      </div>
      {/* Gráficas de análisis */}
      <div ref={dashboardRef}>
        <div className="row g-4 mb-4">
          <div className="col-12 col-lg-6">
            <div className="card border border-dark shadow-sm h-100 p-3">
              <h6 className="fw-bold mb-3">Top 5 canchas más ocupadas</h6>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={canchasOcupadasData} layout="vertical" margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis type="number" allowDecimals={false} stroke="#888" fontSize={12} />
                  <YAxis dataKey="name" type="category" stroke="#888" fontSize={12} width={100} />
                  <Tooltip content={({ active, payload }) => active && payload && payload.length ? (
                    <div className="bg-white p-2 rounded shadow-sm border">
                      <div><b>{payload[0].payload.name}</b></div>
                      <div>Reservas: {payload[0].payload.count}</div>
                    </div>
                  ) : null} />
                  <Bar dataKey="count" fill="var(--color-primary)" radius={[0, 4, 4, 0]}
                    onClick={(_, idx) => openModal('Reservas de ' + canchasOcupadasData[idx].name, reservasFiltradas.filter(r => r.cancha_id === Number(canchasOcupadasData[idx].canchaId)))}
                    isAnimationActive={true}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="col-12 col-lg-6">
            <div className="card border border-dark shadow-sm h-100 p-3">
              <h6 className="fw-bold mb-3">Top 5 canchas con más comentarios</h6>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={canchasComentariosData} layout="vertical" margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis type="number" allowDecimals={false} stroke="#888" fontSize={12} />
                  <YAxis dataKey="name" type="category" stroke="#888" fontSize={12} width={100} />
                  <Tooltip content={({ active, payload }) => active && payload && payload.length ? (
                    <div className="bg-white p-2 rounded shadow-sm border">
                      <div><b>{payload[0].payload.name}</b></div>
                      <div>Comentarios: {payload[0].payload.count}</div>
                    </div>
                  ) : null} />
                  <Bar dataKey="count" fill="var(--color-danger)" radius={[0, 4, 4, 0]}
                    onClick={(_, idx) => openModal('Comentarios de ' + canchasComentariosData[idx].name, feedbacksFiltrados.filter(f => f.cancha_id === Number(canchasComentariosData[idx].canchaId)))}
                    isAnimationActive={true}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="col-12 col-lg-6">
            <div className="card border border-dark shadow-sm h-100 p-3">
              <h6 className="fw-bold mb-3">Reservas por mes</h6>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={reservasMesData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="mes" stroke="#888" fontSize={12} />
                  <YAxis allowDecimals={false} stroke="#888" fontSize={12} />
                  <Tooltip />
                  <Bar dataKey="count" fill="var(--color-primary)" radius={[4, 4, 0, 0]} isAnimationActive={true} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="col-12 col-lg-6">
            <div className="card border border-dark shadow-sm h-100 p-3">
              <h6 className="fw-bold mb-3">Eventos por tipo</h6>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={eventosTipoData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} label isAnimationActive={true}
                    onClick={(_, idx) => openModal('Eventos tipo ' + eventosTipoData[idx].name, eventosFiltrados.filter(e => e.tipo === eventosTipoData[idx].name))}
                  >
                    {eventosTipoData.map((entry, idx) => (
                      <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
      {/* Modal de detalles */}
      {modal.open && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ background: 'rgba(0,0,0,0.2)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{modal.title}</h5>
                <button type="button" className="btn-close" onClick={closeModal}></button>
              </div>
              <div className="modal-body">
                {modal.data.length === 0 && <div className="text-muted">No hay datos para mostrar.</div>}
                {modal.data.length > 0 && (
                  <table className="table table-sm table-bordered">
                    <thead>
                      <tr>
                        {Object.keys(modal.data[0]).map(key => <th key={key}>{key}</th>)}
                      </tr>
                    </thead>
                    <tbody>
                      {modal.data.map((row, idx) => (
                        <tr key={idx}>
                          {Object.values(row).map((val, i) => <td key={i}>{String(val)}</td>)}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="d-flex justify-content-end gap-2 mt-4">
        <button className="btn btn-editar px-4" onClick={handleDownloadPDF}> 
          <i className="bi bi-file-earmark-arrow-down me-2"></i>
          Descargar PDF
        </button>
        <button className="btn btn-editar px-4" onClick={() => exportToExcel('reservas')}>
          <i className="bi bi-file-earmark-excel me-2"></i>
          Exportar Reservas
        </button>
        <button className="btn btn-editar px-4" onClick={() => exportToExcel('eventos')}>
          <i className="bi bi-file-earmark-excel me-2"></i>
          Exportar Eventos
        </button>
        <button className="btn btn-editar px-4" onClick={() => exportToExcel('feedbacks')}>
          <i className="bi bi-file-earmark-excel me-2"></i>
          Exportar Feedbacks
        </button>
      </div>
    </div>
  );
} 
