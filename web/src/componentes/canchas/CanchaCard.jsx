import React from 'react';

const CanchaCard = ({ cancha, onEdit, onDelete, modoUsuario, onReservar }) => {
  const getEstadoColor = (estado) => {
    switch (estado?.toLowerCase()) {
      case 'disponible':
        return 'bg-success';
      case 'mantenimiento':
        return 'bg-warning';
      case 'ocupada':
        return 'bg-danger';
      default:
        return 'bg-secondary';
    }
  };

  const getEstadoIcon = (estado) => {
    switch (estado?.toLowerCase()) {
      case 'disponible':
        return 'bi-check-circle';
      case 'mantenimiento':
        return 'bi-tools';
      case 'ocupada':
        return 'bi-x-circle';
      default:
        return 'bi-question-circle';
    }
  };

  return (
    <div className="card bg-white h-100 shadow-sm rounded border-0 position-relative overflow-hidden">
      {/* Fondo decorativo */}
      <div className="position-absolute top-0 start-0 w-100 h-100 bg-gradient-primary opacity-5"></div>
      
      {/* Imagen de la cancha */}
      {cancha.imagen && typeof cancha.imagen === 'string' && (
        <div className="position-relative">
          <img
            src={`data:image/jpeg;base64,${cancha.imagen}`}
            alt={cancha.nombre}
            className="card-img-top"
            style={{ 
              objectFit: 'cover', 
              height: 200,
              transition: 'transform 0.3s ease'
            }}
            onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
            onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
          />
          {/* Overlay sutil en la imagen */}
          <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark opacity-0" 
               style={{ transition: 'opacity 0.3s ease' }}
               onMouseEnter={(e) => e.target.style.opacity = '0.1'}
               onMouseLeave={(e) => e.target.style.opacity = '0'}></div>
        </div>
      )}

      <div className="card-body position-relative">
        {/* Header con título y tipo */}
        <div className="mb-3">
          <h5 className="card-title mb-1 fw-bold text-primary" style={{ fontSize: '1.2rem' }}>
            {cancha.nombre}
          </h5>
          <div className="d-flex align-items-center gap-2">
            <div className="bg-primary bg-opacity-10 rounded-circle p-1">
              <i className="bi bi-geo-alt text-primary" style={{ fontSize: '0.8rem' }}></i>
            </div>
            <span className="text-muted fw-semibold small">
              {cancha.tipoEspacioNombre || cancha.tipoEspacio?.nombre || 'Sin tipo'}
            </span>
          </div>
        </div>

        {/* Información de capacidad y estado */}
        <div className="mb-3">
          <div className="row g-2">
            <div className="col-6">
              <div className="bg-success bg-opacity-10 rounded p-2 text-center">
                <i className="bi bi-people text-success d-block mb-1"></i>
                <small className="text-success fw-semibold">Capacidad</small>
                <div className="fw-bold text-success">{cancha.capacidad}</div>
              </div>
            </div>
            <div className="col-6">
              <div className={`${getEstadoColor(cancha.estadoCanchaNombre)} bg-opacity-10 rounded p-2 text-center`}>
                <i className={`bi ${getEstadoIcon(cancha.estadoCanchaNombre)} ${getEstadoColor(cancha.estadoCanchaNombre).replace('bg-', 'text-')} d-block mb-1`}></i>
                <small className={`${getEstadoColor(cancha.estadoCanchaNombre).replace('bg-', 'text-')} fw-semibold`}>Estado</small>
                <div className={`fw-bold ${getEstadoColor(cancha.estadoCanchaNombre).replace('bg-', 'text-')}`}>
                  {cancha.estadoCanchaNombre ? cancha.estadoCanchaNombre.charAt(0).toUpperCase() + cancha.estadoCanchaNombre.slice(1) : 'N/A'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Ubicación */}
        <div className="mb-3">
          <div className="bg-light rounded p-3 border-start border-primary border-3">
            <div className="d-flex align-items-center gap-2 mb-1">
              <i className="bi bi-geo-alt-fill text-primary"></i>
              <small className="text-muted fw-semibold">Ubicación Referencial</small>
            </div>
            <span className="fw-semibold">{cancha.ubicacion_referencia || 'No especificada'}</span>
          </div>
        </div>

        {/* Descripción */}
        {cancha.descripcion && (
          <div className="mb-3">
            <div className="bg-light rounded p-3 border-start border-info border-3">
              <div className="d-flex align-items-center gap-2 mb-1">
                <i className="bi bi-info-circle text-info"></i>
                <small className="text-muted fw-semibold">Descripción</small>
              </div>
              <p className="card-text small text-muted mb-0" style={{ lineHeight: '1.4' }}>
                {cancha.descripcion}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Botones de acción */}
      <div className="card-footer bg-transparent border-0 pt-0">
        {(onEdit || onDelete) && (
          <div className="d-flex gap-2 mb-2">
            {onEdit && (
              <button 
                className="btn btn-outline-primary btn-sm flex-fill position-relative overflow-hidden"
                onClick={() => onEdit(cancha)}
                title="Editar cancha"
                style={{ transition: 'all 0.3s ease' }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 4px 8px rgba(0,123,255,0.3)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'none';
                }}
              >
                <i className="bi bi-pencil-square me-1"></i>Editar
              </button>
            )}
            {onDelete && (
              <button 
                className="btn btn-outline-danger btn-sm flex-fill position-relative overflow-hidden"
                onClick={() => onDelete(cancha)}
                title="Eliminar cancha"
                style={{ transition: 'all 0.3s ease' }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 4px 8px rgba(220,53,69,0.3)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'none';
                }}
              >
                <i className="bi bi-trash me-1"></i>Eliminar
              </button>
            )}
          </div>
        )}
        
        {modoUsuario && (
          <button 
            className="btn btn-primary w-100 position-relative overflow-hidden"
            onClick={() => onReservar(cancha)}
            title="Reservar cancha"
            style={{ transition: 'all 0.3s ease' }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 4px 8px rgba(0,123,255,0.3)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = 'none';
            }}
          >
            <i className="bi bi-calendar-plus me-1"></i> Reservar Cancha
          </button>
        )}
      </div>

      {/* Indicador de estado en la esquina */}
      <div className="position-absolute top-0 end-0 p-2">
        <div className={`${getEstadoColor(cancha.estadoCanchaNombre)} rounded-circle`} style={{ width: '12px', height: '12px' }}></div>
      </div>
    </div>
  );
};

export default CanchaCard; 
