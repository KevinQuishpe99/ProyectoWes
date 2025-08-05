import React from 'react';

const CanchasList = ({ canchas, onEdit, onDelete, rol }) => {
  if (!canchas || canchas.length === 0) {
    return <div className="alert alert-info">No hay canchas registradas.</div>;
  }
  
  // Función para convertir imagen de base64 a URL
  const getImageUrl = (imagen) => {
    console.log('🔍 Procesando imagen:', imagen ? 'Presente' : 'Ausente');
    
    if (!imagen) {
      console.log('❌ No hay imagen');
      return null;
    }
    
    // Si ya es una URL completa, retornarla
    if (typeof imagen === 'string' && imagen.startsWith('data:')) {
      console.log('✅ Imagen ya es data URL');
      return imagen;
    }
    
    // Si es un string base64 (como lo envía el backend)
    if (typeof imagen === 'string' && imagen.length > 100) {
      console.log('✅ Convirtiendo string base64 a data URL');
      return `data:image/jpeg;base64,${imagen}`;
    }
    
    // Si es un buffer (caso raro)
    if (imagen && imagen.data) {
      console.log('🔄 Convirtiendo buffer a base64...');
      try {
        const uint8Array = new Uint8Array(imagen.data);
        const base64String = btoa(String.fromCharCode(...uint8Array));
        const dataUrl = `data:image/jpeg;base64,${base64String}`;
        console.log('✅ Buffer convertido exitosamente');
        return dataUrl;
      } catch (error) {
        console.error('❌ Error convirtiendo imagen:', error);
        return null;
      }
    }
    
    console.log('❌ Formato de imagen no reconocido');
    return null;
  };

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
    <div className="row g-4">
      {canchas.map((cancha) => {
        const imageUrl = getImageUrl(cancha.imagen);
        const estadoNombre = cancha.estadoCancha?.nombre || cancha.estadoCanchaNombre;
        
        return (
          <div className="col-12 col-md-6 col-lg-4" key={cancha.id}>
            <div className="card bg-white h-100 shadow-sm rounded border-0 position-relative overflow-hidden">
              {/* Fondo decorativo */}
              <div className="position-absolute top-0 start-0 w-100 h-100 bg-gradient-primary opacity-5"></div>
              
              {/* Imagen de la cancha */}
              {imageUrl && (
                <div className="position-relative">
                  <img 
                    src={imageUrl} 
                    alt={cancha.nombre}
                    className="card-img-top"
                    style={{ 
                      objectFit: 'cover', 
                      height: 200,
                      transition: 'transform 0.3s ease'
                    }}
                    onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                    onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                    onLoad={() => console.log(`✅ Imagen cargada exitosamente: ${cancha.nombre}`)}
                    onError={(e) => {
                      console.error(`❌ Error cargando imagen: ${cancha.nombre}`, e);
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'block';
                    }}
                  />
                  {/* Overlay sutil en la imagen */}
                  <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark opacity-0" 
                       style={{ transition: 'opacity 0.3s ease' }}
                       onMouseEnter={(e) => e.target.style.opacity = '0.1'}
                       onMouseLeave={(e) => e.target.style.opacity = '0'}></div>
                </div>
              )}
              
              {/* Placeholder si no hay imagen */}
              {!imageUrl && (
                <div 
                  className="card-img-top d-flex align-items-center justify-content-center position-relative"
                  style={{ 
                    height: 200, 
                    background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                    fontSize: '3rem', 
                    color: '#ccc' 
                  }}
                >
                  <i className="bi bi-image"></i>
                  {/* Efecto de brillo */}
                  <div className="position-absolute top-0 start-0 w-100 h-100" 
                       style={{ 
                         background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.3) 50%, transparent 70%)',
                         transform: 'translateX(-100%)',
                         transition: 'transform 0.6s ease'
                       }}
                       onMouseEnter={(e) => e.target.style.transform = 'translateX(100%)'}
                       onMouseLeave={(e) => e.target.style.transform = 'translateX(-100%)'}></div>
                </div>
              )}
              
              <div className="card-body position-relative d-flex flex-column">
                {/* Header con título y tipo */}
                <div className="mb-3">
                  <h5 className="card-title mb-1 fw-bold text-primary" style={{ fontSize: '1.2rem' }}>
                    {cancha.nombre}
                  </h5>
                  <div className="d-flex align-items-center gap-2">
                    <div className="bg-primary bg-opacity-10 rounded-circle p-1">
                      <i className="bi bi-building text-primary" style={{ fontSize: '0.8rem' }}></i>
                    </div>
                    <span className="text-muted fw-semibold small">
                      {cancha.tipoEspacio?.nombre || cancha.tipoEspacioNombre || 'Sin tipo'}
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
                      <div className={`${getEstadoColor(estadoNombre)} bg-opacity-10 rounded p-2 text-center`}>
                        <i className={`bi ${getEstadoIcon(estadoNombre)} ${getEstadoColor(estadoNombre).replace('bg-', 'text-')} d-block mb-1`}></i>
                        <small className={`${getEstadoColor(estadoNombre).replace('bg-', 'text-')} fw-semibold`}>Estado</small>
                        <div className={`fw-bold ${getEstadoColor(estadoNombre).replace('bg-', 'text-')}`}>
                          {estadoNombre ? estadoNombre.charAt(0).toUpperCase() + estadoNombre.slice(1) : 'N/A'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Ubicación */}
                {cancha.ubicacion_referencia && (
                  <div className="mb-3">
                    <div className="bg-light rounded p-3 border-start border-primary border-3">
                      <div className="d-flex align-items-center gap-2 mb-1">
                        <i className="bi bi-geo-alt-fill text-primary"></i>
                        <small className="text-muted fw-semibold">Ubicación Referencial</small>
                      </div>
                      <span className="fw-semibold">{cancha.ubicacion_referencia}</span>
                    </div>
                  </div>
                )}
                
                {/* Botones de acción */}
                <div className="d-flex gap-2 mt-auto">
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
                  {rol !== 'organizador' && (
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
              </div>

              {/* Indicador de estado en la esquina */}
              <div className="position-absolute top-0 end-0 p-2">
                <div className={`${getEstadoColor(estadoNombre)} rounded-circle`} style={{ width: '12px', height: '12px' }}></div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CanchasList; 
