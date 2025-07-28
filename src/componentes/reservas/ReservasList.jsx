import React from 'react';

export default function ReservasList({ reservas, modoUsuario, onCancelar, onEditar }) {
  if (!reservas || reservas.length === 0) {
    return <div className="alert alert-info">No hay reservas.</div>;
  }
  return (
    <div className="table-responsive">
      <table className="table table-bordered align-middle table-hover shadow-sm rounded">
        <thead className="table-primary">
          <tr>
            <th>Cancha</th>
            <th>Fecha</th>
            <th>Hora Inicio</th>
            <th>Hora Fin</th>
            <th>Estado</th>
            {modoUsuario && <th className="text-center">Acciones</th>}
          </tr>
        </thead>
        <tbody>
          {reservas.map(reserva => {
            const esEditable = reserva.estado === 'reservada';
            const esFinalizada = reserva.estado === 'finalizada';
            return (
              <tr key={reserva.id} className={esFinalizada ? 'table-secondary' : ''}>
                <td>{reserva.cancha?.nombre}</td>
                <td>{reserva.fecha}</td>
                <td>{reserva.hora_inicio}</td>
                <td>{reserva.hora_fin}</td>
                <td>
                  <span className={`badge ${reserva.estado === 'reservada' ? 'bg-success' : reserva.estado === 'cancelada' ? 'bg-danger' : 'bg-secondary'}`}>{reserva.estado.charAt(0).toUpperCase() + reserva.estado.slice(1)}</span>
                </td>
                {modoUsuario && (
                  <td className="text-center">
                    <div className="d-flex justify-content-center gap-2">
                      <button
                        className="btn btn-sm btn-outline-primary"
                        title="Editar fecha y estado"
                        disabled={!esEditable}
                        onClick={() => esEditable && onEditar && onEditar(reserva)}
                      >
                        <i className="bi bi-pencil-square"></i>
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        title="Cancelar reserva"
                        disabled={!esEditable}
                        onClick={() => esEditable && onCancelar && onCancelar(reserva)}
                      >
                        <i className="bi bi-x-circle"></i>
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
} 
