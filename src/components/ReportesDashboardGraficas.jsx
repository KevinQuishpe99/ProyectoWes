import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const COLORS = ['#2563eb', '#ef4444', '#22c55e', '#f59e42', '#a855f7', '#eab308'];

export default function ReportesDashboardGraficas({
  canchasOcupadasData,
  canchasComentariosData,
  reservasMesData,
  eventosTipoData,
  openModal,
  reservasFiltradas,
  feedbacksFiltrados,
  eventosFiltrados
}) {
  return (
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
  );
} 