// Importación de React y hooks necesarios
import React, { useState } from 'react';
// Importación de hooks de Redux para gestión de estado
import { useDispatch, useSelector } from 'react-redux';
// Importación de la acción de logout desde el slice de autenticación
import { logout } from '../servicios/auth/authSlice';
// Importación de hook de navegación de React Router
import { useNavigate } from 'react-router-dom';
// Importación de iconos de Bootstrap
import 'bootstrap-icons/font/bootstrap-icons.css';
// Importación de componentes específicos del panel de administrador
import TiposEspacioAdmin from '../componentes/tiposEspacio/TiposEspacioAdmin';
import CanchasAdmin from '../componentes/canchas/CanchasAdmin';
import ReservasAdmin from '../componentes/reservas/ReservasAdmin';
import EventosAdmin from '../componentes/eventos/EventosAdmin';
import FeedbacksAdmin from '../componentes/feedback/FeedbacksAdmin';
// Importación del sidebar específico para administradores
import SidebarAdminPanel from '../componentes/sidebars/SidebarAdminPanel';

// Configuración de las opciones del sidebar para administradores
const sidebarOptions = [
  { icon: 'bi-layers', label: 'Tipos de Espacio', key: 'tiposEspacio' },
  { icon: 'bi-people', label: 'Canchas', key: 'canchas' },
  { icon: 'bi-calendar-check', label: 'Reservas', key: 'reservas' },
  { icon: 'bi-trophy', label: 'Eventos', key: 'eventos' },
  { icon: 'bi-chat-dots', label: 'Feedback', key: 'feedback' },
];

// Función para renderizar el contenido según la sección seleccionada
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

// Componente principal del panel de administrador
export default function AdminPanel() {
  // Hook para despachar acciones de Redux
  const dispatch = useDispatch();
  // Hook para navegación programática
  const navigate = useNavigate();
  // Hook para obtener datos del usuario desde Redux
  const { user } = useSelector((state) => state.auth);
  // Estado para controlar si el sidebar está abierto o cerrado
  const [sidebarOpen, setSidebarOpen] = useState(true);
  // Estado para controlar qué sección está seleccionada
  const [selected, setSelected] = useState('tiposEspacio');

  // Función para manejar el cierre de sesión
  const handleLogout = () => {
    // Despachar la acción de logout
    dispatch(logout());
    // Redirigir al login
    navigate('/login');
  };

  // Renderizar el panel de administrador
  return (
    // Contenedor principal con flexbox para layout horizontal
    <div className="d-flex min-vh-100 bg-light">
      {/* Sidebar del panel de administrador */}
      <SidebarAdminPanel
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        user={user}
        sidebarOptions={sidebarOptions}
        selected={selected}
        setSelected={setSelected}
        handleLogout={handleLogout}
      />

      {/* Contenido principal del panel */}
      <div className="flex-grow-1 main-content">
        <div className="container py-4">
          {/* Renderizar el contenido de la sección seleccionada */}
          {sectionContent(selected, user?.rol || 'admin')}
        </div>
      </div>
    </div>
  );
} 
