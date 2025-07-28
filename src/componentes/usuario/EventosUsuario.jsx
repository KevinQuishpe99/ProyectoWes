import React, { useEffect, useState } from 'react';
import api from '../../servicios/api';

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

function formatFecha(fecha) {
  if (!fecha) return '';
  const [y, m, d] = fecha.split('-');
  return `${d}/${m}/${y}`;
}

export default function EventosUsuario() {
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filtroNombre, setFiltroNombre] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('');
  const [filtroCancha, setFiltroCancha] = useState('');

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
    const nombreOk = !filtroNombre || ev.nombre.toLowerCase().includes(filtroNombre.toLowerCase());
    const tipoOk = !filtroTipo || ev.tipo.toLowerCase().includes(filtroTipo.toLowerCase());
    const canchaOk = !filtroCancha || (ev.cancha?.nombre && ev.cancha.nombre.toLowerCase().includes(filtroCancha.toLowerCase()));
    return nombreOk && tipoOk && canchaOk;
  });

  return (
    <div>
      <h2 className="mb-4">Eventos próximos (7 días)</h2>
      <div className="row g-2 mb-3">
        <div className="col-md-3">
          <input type="text" className="form-control" placeholder="Buscar por nombre..." value={filtroNombre} onChange={e => setFiltroNombre(e.target.value)} />
        </div>
        <div className="col-md-3">
          <input type="text" className="form-control" placeholder="Filtrar por tipo..." value={filtroTipo} onChange={e => setFiltroTipo(e.target.value)} />
        </div>
        <div className="col-md-3">
          <input type="text" className="form-control" placeholder="Filtrar por cancha..." value={filtroCancha} onChange={e => setFiltroCancha(e.target.value)} />
        </div>
      </div>
      {loading && <div className="alert alert-info">Cargando eventos...</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      {!loading && !error && (
        eventosFiltrados.length === 0 ? (
          <div className="alert alert-info">No hay eventos próximos.</div>
        ) : (
          <div className="table-responsive">
            <table className="table table-bordered align-middle table-hover shadow-sm rounded">
              <thead className="table-primary">
                <tr>
                  <th>Nombre</th>
                  <th>Cancha</th>
                  <th>Tipo</th>
                  <th>Estado</th>
                  <th>Fecha</th>
                  <th>Hora</th>
                </tr>
              </thead>
              <tbody>
                {eventosFiltrados.map(ev => (
                  <tr key={ev.id}>
                    <td>{ev.nombre}</td>
                    <td>{ev.cancha?.nombre}</td>
                    <td>
                      <span className={`badge ${tipoColors[ev.tipo] || 'bg-secondary'}`}>{ev.tipo}</span>
                    </td>
                    <td>
                      <span className={`badge ${estadoColors[ev.estado] || 'bg-secondary'}`}>{ev.estado}</span>
                    </td>
                    <td>{ev.fecha_inicio === ev.fecha_fin ? formatFecha(ev.fecha_inicio) : `${formatFecha(ev.fecha_inicio)} al ${formatFecha(ev.fecha_fin)}`}</td>
                    <td>{ev.hora_inicio} - {ev.hora_fin}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      )}
    </div>
  );
} 