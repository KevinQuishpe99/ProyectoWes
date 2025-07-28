import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../servicios/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';
import TiposEspacioAdmin from '../componentes/tiposEspacio/TiposEspacioAdmin';
import CanchasAdmin from '../componentes/canchas/CanchasAdmin';
import ReservasAdmin from '../componentes/reservas/ReservasAdmin';
import EventosAdmin from '../componentes/eventos/EventosAdmin';
import FeedbacksAdmin from '../componentes/feedback/FeedbacksAdmin';
import ReportesDashboard from '../componentes/reportes/ReportesDashboard';
import SidebarOrganizador from '../componentes/sidebars/SidebarOrganizador';


const sidebarOptions = [
  { icon: 'bi-layers', label: 'Tipos de Espacio', key: 'tiposEspacio' },
  { icon: 'bi-people', label: 'Canchas', key: 'canchas' },
  { icon: 'bi-calendar-check', label: 'Reservas', key: 'reservas' },
  { icon: 'bi-trophy', label: 'Eventos', key: 'eventos' },
  { icon: 'bi-chat-dots', label: 'Feedback', key: 'feedback' },
  { icon: 'bi-bar-chart', label: 'Reportes', key: 'reportes' },
];

export default function OrganizadorPanel() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selected, setSelected] = useState('tiposEspacio');

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const sectionContent = (selected) => {
    switch (selected) {
      case 'tiposEspacio':
        return <TiposEspacioAdmin rol="organizador" />;
      case 'canchas':
        return <CanchasAdmin rol="organizador" />;
      case 'reservas':
        return <ReservasAdmin rol="organizador" />;
      case 'eventos':
        return <EventosAdmin rol="organizador" />;
      case 'feedback':
        return <FeedbacksAdmin rol="organizador" />;
      case 'reportes':
        return <ReportesDashboard />;
      default:
        return <div className="text-center text-muted py-5">Selecciona un módulo del menú para comenzar.</div>;
    }
  };

  return (
    <div className="d-flex min-vh-100 bg-light">
      <SidebarOrganizador
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        user={user}
        sidebarOptions={sidebarOptions}
        selected={selected}
        setSelected={setSelected}
        handleLogout={handleLogout}
      />
      <div className="flex-grow-1 main-content">
        <div className="container py-4">
          {sectionContent(selected)}
        </div>
      </div>
    </div>
  );
} 
