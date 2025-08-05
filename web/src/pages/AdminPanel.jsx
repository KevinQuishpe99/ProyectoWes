import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../servicios/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';
import TiposEspacioAdmin from '../componentes/tiposEspacio/TiposEspacioAdmin';
import CanchasAdmin from '../componentes/canchas/CanchasAdmin';
import ReservasAdmin from '../componentes/reservas/ReservasAdmin';
import EventosAdmin from '../componentes/eventos/EventosAdmin';
import FeedbacksAdmin from '../componentes/feedback/FeedbacksAdmin';
import SidebarAdminPanel from '../componentes/sidebars/SidebarAdminPanel';

const sidebarOptions = [
  { icon: 'bi-layers', label: 'Tipos de Espacio', key: 'tiposEspacio' },
  { icon: 'bi-people', label: 'Canchas', key: 'canchas' },
  { icon: 'bi-calendar-check', label: 'Reservas', key: 'reservas' },
  { icon: 'bi-trophy', label: 'Eventos', key: 'eventos' },
  { icon: 'bi-chat-dots', label: 'Feedback', key: 'feedback' },
];

const sectionContent = (selected, rol) => {
  switch (selected) {
    case 'tiposEspacio':
      return <TiposEspacioAdmin rol={rol} />;
    case 'canchas':
      return <CanchasAdmin rol={rol} />;
    case 'reservas':
      return <ReservasAdmin rol={rol} />;
    case 'eventos':
      return <EventosAdmin rol={rol} />;
    case 'feedback':
      return <FeedbacksAdmin rol={rol} />;
    default:
      return <div className="text-center text-muted py-5">Selecciona un módulo del menú para comenzar.</div>;
  }
};

export default function AdminPanel() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selected, setSelected] = useState('tiposEspacio');

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div className="d-flex min-vh-100 bg-light">
      <SidebarAdminPanel
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        user={user}
        sidebarOptions={sidebarOptions}
        selected={selected}
        setSelected={setSelected}
        handleLogout={handleLogout}
      />

      {/* Main content */}
      <div className="flex-grow-1 main-content">
        <div className="container py-4">
          {sectionContent(selected, user?.rol || 'admin')}
        </div>
      </div>
    </div>
  );
} 
