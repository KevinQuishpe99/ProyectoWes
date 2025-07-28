<<<<<<< HEAD:src/componentes/reportes/ReportesDashboard.jsx
import React, { useRef, useState } from 'react';
import useReportesDashboardData from './useReportesDashboardData';
import useReportesDashboardExport from './useReportesDashboardExport';
import ReportesDashboardHeader from './ReportesDashboardHeader';
import ReportesDashboardFiltros from './ReportesDashboardFiltros';
import ReportesDashboardGraficas from './ReportesDashboardGraficas';
import ReportesDashboardModal from './ReportesDashboardModal';
=======
import React, { useEffect, useState, useRef } from 'react';
import api from '../services/api';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import * as XLSX from 'xlsx';
>>>>>>> parent of 9e760a9 (faltoa modulos de admin):src/components/ReportesDashboard.jsx

const COLORS = ['#2563eb', '#ef4444', '#22c55e', '#f59e42', '#a855f7', '#eab308'];

export default function ReportesDashboard() {
  const dashboardRef = useRef();
  const [modal, setModal] = useState({ open: false, title: '', data: [] });

<<<<<<< HEAD:src/componentes/reportes/ReportesDashboard.jsx
  const {
    reservas,
    eventos,
    feedbacks,
    canchas,
    usuarios,
    loading,
    dateRange,
    setDateRange,
    filterByDate
  } = useReportesDashboardData();
=======
  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const [resReservas, resEventos, resCanchas, resFeedbacks, resUsuarios] = await Promise.all([
          api.get('/reservas'),
          api.get('/eventos'),
          api.get('/canchas'),
          api.get('/feedback'),
          api.get('/usuarios')
        ]);
        setReservas(resReservas.data);
        setEventos(resEventos.data);
        setCanchas(resCanchas.data);
        setFeedbacks(resFeedbacks.data);
        setUsuarios(resUsuarios.data);
      } catch (e) {}
      setLoading(false);
    };
    fetchAll();
  }, []);
>>>>>>> parent of 9e760a9 (faltoa modulos de admin):src/components/ReportesDashboard.jsx

  const { handleDownloadPDF, exportToExcel } = useReportesDashboardExport({
    dashboardRef,
    reservas,
    eventos,
    feedbacks,
    canchas,
    usuarios
  });

  // --- Datos para gráficas ---
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

  const reservasPorMes = reservasFiltradas.reduce((acc, r) => {
    const mes = r.fecha?.slice(0, 7) || 'Sin fecha';
    acc[mes] = (acc[mes] || 0) + 1;
    return acc;
  }, {});
  const reservasMesData = Object.entries(reservasPorMes).map(([mes, count]) => ({ mes, count }));

  const eventosFiltrados = filterByDate(eventos, 'fecha_inicio');
  const eventosPorTipo = eventosFiltrados.reduce((acc, e) => {
    acc[e.tipo] = (acc[e.tipo] || 0) + 1;
    return acc;
  }, {});
  const eventosTipoData = Object.entries(eventosPorTipo).map(([tipo, value]) => ({ name: tipo, value }));

  // --- Modal ---
  const openModal = (title, data) => setModal({ open: true, title, data });
  const closeModal = () => setModal({ open: false, title: '', data: [] });

  return (
    <div className="container py-4">
      <ReportesDashboardHeader
        onDownloadPDF={handleDownloadPDF}
        onExportReservas={() => exportToExcel('reservas')}
        onExportEventos={() => exportToExcel('eventos')}
        onExportFeedbacks={() => exportToExcel('feedbacks')}
      />
      <ReportesDashboardFiltros dateRange={dateRange} setDateRange={setDateRange} />
      <div ref={dashboardRef}>
        <ReportesDashboardGraficas
          canchasOcupadasData={canchasOcupadasData}
          canchasComentariosData={canchasComentariosData}
          reservasMesData={reservasMesData}
          eventosTipoData={eventosTipoData}
          openModal={openModal}
          reservasFiltradas={reservasFiltradas}
          feedbacksFiltrados={feedbacksFiltrados}
          eventosFiltrados={eventosFiltrados}
        />
      </div>
      <ReportesDashboardModal open={modal.open} title={modal.title} data={modal.data} onClose={closeModal} />
    </div>
  );
} 