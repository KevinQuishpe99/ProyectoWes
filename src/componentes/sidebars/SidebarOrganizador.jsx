import React from 'react';

export default function SidebarOrganizador({ sidebarOpen, setSidebarOpen, user, sidebarOptions, selected, setSelected, handleLogout }) {
  return (
    <nav className={`sidebar-admin ${sidebarOpen ? 'sidebar-open' : 'sidebar-collapsed'}`}>
      <div className="p-3 border-bottom border-white border-opacity-25 pb-2">
        <div className="d-flex flex-column">
          <div className="d-flex justify-content-end mb-2">
            <button
              className="btn btn-outline-light btn-sm"
              onClick={() => setSidebarOpen((v) => !v)}
            >
              <i className={`bi ${sidebarOpen ? 'bi-chevron-left' : 'bi-chevron-right'}`}></i>
            </button>
          </div>
          <div className="d-flex align-items-center mb-2">
            <div className="bg-success rounded p-2 me-2">
              <i className="bi bi-shield-check text-white"></i>
            </div>
            {sidebarOpen && (
              <h6 className="mb-0 text-white fw-bold">Sistema de Gestión Canchas EPN</h6>
            )}
          </div>
          <hr className="text-white opacity-25 my-2" />
          <div className="d-flex align-items-center mt-2">
            <div className="bg-primary rounded-circle p-1 me-2">
              <i className="bi bi-person text-white small"></i>
            </div>
            {sidebarOpen && (
              <div className="text-white small">
                <span className="text-white-50">Organizador</span>
                <span className="mx-1">:</span>
                <span className="fw-semibold">{user?.nombres || user?.username}</span>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="flex-grow-1 p-2 pt-3 pb-2">
        <div className="mb-2">
          {sidebarOpen && (
            <div className="text-white-50 small fw-semibold text-uppercase">
              <i className="bi bi-gear me-2"></i>
              Módulos
            </div>
          )}
        </div>
        <div className="d-flex flex-column gap-1">
          {sidebarOptions.map((opt) => (
            <button
              key={opt.key}
              className={`btn text-start px-3 py-2 d-flex align-items-center mb-1 border-0 ${
                selected === opt.key 
                  ? 'btn-light' 
                  : 'btn-outline-light'
              }`}
              onClick={() => setSelected(opt.key)}
            >
              <i className={`bi ${opt.icon} me-3`}></i>
              {sidebarOpen && (
                <span>{opt.label}</span>
              )}
            </button>
          ))}
        </div>
      </div>
      <div className="p-2 border-top border-white border-opacity-25 mt-0">
        <button 
          className="btn btn-danger w-100 d-flex align-items-center justify-content-center gap-2" 
          onClick={handleLogout}
        >
          <i className="bi bi-box-arrow-right"></i>
          {sidebarOpen && <span>Cerrar Sesión</span>}
        </button>
      </div>
    </nav>
  );
} 