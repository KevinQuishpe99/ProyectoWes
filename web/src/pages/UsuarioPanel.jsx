import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../servicios/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';
import SidebarUsuario from '../componentes/sidebars/SidebarUsuario';
import ReservarCanchaUsuario from '../componentes/usuario/ReservarCanchaUsuario';
import MisReservasUsuario from '../componentes/usuario/MisReservasUsuario';
import FeedbackUsuario from '../componentes/usuario/FeedbackUsuario';
import EventosUsuario from '../componentes/usuario/EventosUsuario';

const sidebarOptions = [
  { icon: 'bi-search', label: 'Reservar Cancha', key: 'reservar' },
  { icon: 'bi-calendar-check', label: 'Mis Reservas', key: 'misReservas' },
  { icon: 'bi-chat-dots', label: 'Feedback', key: 'feedback' },
  { icon: 'bi-calendar-event', label: 'Eventos', key: 'eventos' },
];

export default function UsuarioPanel() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selected, setSelected] = useState('reservar');

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const sectionContent = (selected) => {
    switch (selected) {
      case 'reservar':
        return <ReservarCanchaUsuario user={user} />;
      case 'misReservas':
        return <MisReservasUsuario user={user} />;
      case 'feedback':
        return <FeedbackUsuario user={user} />;
      case 'eventos':
        return <EventosUsuario />;
      default:
        return <div className="text-center text-muted py-5">Selecciona una opción del menú para comenzar.</div>;
    }
  };

  return (
    <div className="d-flex min-vh-100 bg-light">
      <SidebarUsuario
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