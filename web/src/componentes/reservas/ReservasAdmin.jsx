import React, { useEffect, useState } from 'react';
import ReservasList from './ReservasList';
import ReservaFormAdmin from './ReservaFormAdmin';
import Swal from 'sweetalert2';
import ReservasService from '../../servicios/reservas/reservasService';
import { contieneTexto } from '../../utils/textUtils';

export default function ReservasAdmin({ rol }) {
  const [reservas, setReservas] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [canchas, setCanchas] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editReserva, setEditReserva] = useState(null);
    const [form, setForm] = useState({
    usuario_id: '',
    cancha_id: '',
    fecha: '',
    hora_inicio: '',
    hora_fin: '',
    estado: 'reservada'
  });
  
  console.log('🔍 ReservasAdmin - Estado actual del form:', form);
  const [estadosReserva, setEstadosReserva] = useState([]);
  const [usuarioFiltro, setUsuarioFiltro] = useState('');
  const [codigoUsuario, setCodigoUsuario] = useState('');
  const [usuarioEncontrado, setUsuarioEncontrado] = useState(null);
  const [filtroCodigo, setFiltroCodigo] = useState('');
  const [filtroFecha, setFiltroFecha] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Cargar todos los datos necesarios
  const fetchAll = async () => {
    try {
      setLoading(true);
      const [reservas, usuarios, canchas, estados] = await Promise.all([
        ReservasService.getAll(),
        ReservasService.getUsuarios(),
        ReservasService.getCanchas(),
        ReservasService.getEstados(),
      ]);
      setReservas(reservas);
      setUsuarios(usuarios);
      setCanchas(canchas);
      setEstadosReserva(estados);
    } catch (error) {
      console.error('Error al cargar datos:', error);
      Swal.fire({ 
        icon: 'error', 
        title: 'Error', 
        text: 'Error al cargar los datos. Intenta recargar la página.', 
        confirmButtonColor: '#d32f2f' 
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    fetchAll(); 
  }, []);

  // Limpiar filtros
  const limpiarFiltros = () => {
    setUsuarioFiltro('');
    setFiltroCodigo('');
    setFiltroFecha('');
  };

  // Abrir formulario (crear o editar)
  const openForm = (reserva = null) => {
    setEditReserva(reserva);
    if (reserva) {
      // Modo edición - prellenar formulario
      const normalizarHora = (h) => {
        if (!h) return '';
        // Si ya está en formato HH:MM, devuélvelo tal cual
        if (/^\d{2}:\d{2}$/.test(h)) return h;
        // Si viene como HH:MM:SS, recorta a HH:MM
        if (/^\d{2}:\d{2}:\d{2}$/.test(h)) return h.slice(0, 5);
        // Si viene como Date, formatea
        if (h instanceof Date) {
          return h.getHours().toString().padStart(2, '0') + ':' + h.getMinutes().toString().padStart(2, '0');
        }
        // Si es string, intenta parsearlo
        if (typeof h === 'string') {
          const parts = h.split(':');
          if (parts.length >= 2) {
            return parts[0].padStart(2, '0') + ':' + parts[1].padStart(2, '0');
          }
        }
        return h;
      };
      
      // Normalizar fechas para evitar problemas de zona horaria
      const normalizarFecha = (fecha) => {
        if (!fecha) return '';
        
        // Si la fecha ya viene en formato YYYY-MM-DD, devolverla tal como está
        if (typeof fecha === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
          return fecha;
        }
        
        // Si viene como objeto Date o string con zona horaria, convertirla
        const date = new Date(fecha);
        
        // Verificar si la fecha es válida
        if (isNaN(date.getTime())) {
          console.error('Fecha inválida:', fecha);
          return '';
        }
        
        // Usar métodos UTC para evitar problemas de zona horaria
        const year = date.getUTCFullYear();
        const month = String(date.getUTCMonth() + 1).padStart(2, '0');
        const day = String(date.getUTCDate()).padStart(2, '0');
        const fechaNormalizada = `${year}-${month}-${day}`;
        
        console.log('🔍 Normalización de fecha (ReservasAdmin):', {
          fechaOriginal: fecha,
          fechaDate: date,
          fechaNormalizada: fechaNormalizada,
          timezoneOffset: date.getTimezoneOffset()
        });
        
        return fechaNormalizada;
      };
      
      const formData = {
        ...reserva,
        fecha: normalizarFecha(reserva.fecha),
        hora_inicio: normalizarHora(reserva.hora_inicio),
        hora_fin: normalizarHora(reserva.hora_fin),
        estado: reserva.estado ? reserva.estado.toLowerCase() : 'reservada'
      };
      
      console.log('🔍 ReservasAdmin - Form data preparado:', formData);
      console.log('🔍 ReservasAdmin - Campos específicos:', {
        fecha: formData.fecha,
        hora_inicio: formData.hora_inicio,
        hora_fin: formData.hora_fin,
        estado: formData.estado
      });
      
      setForm(formData);
    } else {
      // Modo creación - formulario vacío
      setForm({ 
        usuario_id: '', 
        cancha_id: '', 
        fecha: '', 
        hora_inicio: '', 
        hora_fin: '', 
        estado: 'reservada' 
      });
    }
    setShowForm(true);
  };

  // Función específica para editar reserva
  const handleEdit = (reserva) => {
    console.log('Editando reserva:', reserva); // Debug
    console.log('Datos de la reserva:', {
      id: reserva.id,
      usuario: reserva.usuario,
      cancha: reserva.cancha,
      fecha: reserva.fecha,
      hora_inicio: reserva.hora_inicio,
      hora_fin: reserva.hora_fin,
      estado: reserva.estado
    });
    
    // Verificar que la reserva tenga todos los datos necesarios
    if (!reserva.id) {
      console.error('Error: La reserva no tiene ID');
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se puede editar esta reserva. Falta información.',
        confirmButtonColor: '#d32f2f'
      });
      return;
    }
    
    openForm(reserva);
  };

  // Cerrar formulario
  const closeForm = () => {
    setShowForm(false);
    setEditReserva(null);
    setForm({ 
      usuario_id: '', 
      cancha_id: '', 
      fecha: '', 
      hora_inicio: '', 
      hora_fin: '', 
      estado: 'reservada' 
    });
    setUsuarioEncontrado(null);
    setCodigoUsuario('');
  };

  // Manejar cambios en el formulario
  const handleChange = e => {
    setForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  // Validar formulario
  const validarFormulario = () => {
    const { usuario_id, cancha_id, fecha, hora_inicio, hora_fin, estado } = form;
    
    if (!usuario_id) {
      Swal.fire({ icon: 'error', title: 'Error', text: 'Selecciona un usuario' });
      return false;
    }
    
    if (!cancha_id) {
      Swal.fire({ icon: 'error', title: 'Error', text: 'Selecciona una cancha' });
      return false;
    }
    
    if (!fecha) {
      Swal.fire({ icon: 'error', title: 'Error', text: 'Selecciona una fecha' });
      return false;
    }
    
    if (!hora_inicio || !hora_fin) {
      Swal.fire({ icon: 'error', title: 'Error', text: 'Selecciona horas de inicio y fin' });
      return false;
    }
    
    if (hora_inicio >= hora_fin) {
      Swal.fire({ icon: 'error', title: 'Error', text: 'La hora de fin debe ser posterior a la hora de inicio' });
      return false;
    }
    
    // ADMIN TIENE ACCESO COMPLETO - SIN RESTRICCIONES DE FECHA
    // Comentamos la validación de fecha pasada para admin
    /*
    // Validar que la fecha no sea anterior a hoy (solo para usuarios normales)
    const fechaReserva = new Date(fecha);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    
    if (fechaReserva < hoy) {
      Swal.fire({ icon: 'error', title: 'Error', text: 'No puedes crear reservas para fechas pasadas' });
      return false;
    }
    */
    
    return true;
  };

  // Manejar envío del formulario
  const handleSubmit = async e => {
    e.preventDefault();
    
    if (!validarFormulario()) return;
    
    try {
      setSubmitting(true);
      
      // ADMIN TIENE ACCESO COMPLETO - VALIDACIÓN DE DISPONIBILIDAD OPCIONAL
      // Verificar disponibilidad pero permitir al admin sobrescribir
      const disponible = await ReservasService.validarDisponibilidad(
        form.cancha_id, 
        form.fecha, 
        form.hora_inicio, 
        form.hora_fin, 
        editReserva?.id
      );
      
      if (!disponible) {
        // Para admin, mostrar advertencia pero permitir continuar
        const result = await Swal.fire({
          icon: 'warning',
          title: 'Conflicto de horarios',
          text: 'Ya existe una reserva para esta cancha en el horario seleccionado. ¿Deseas continuar de todas formas?',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Sí, continuar',
          cancelButtonText: 'Cancelar'
        });
        
        if (!result.isConfirmed) {
          setSubmitting(false);
          return;
        }
      }
      
      if (editReserva) {
        // Actualizar reserva existente
        await ReservasService.update(editReserva.id, form);
        Swal.fire({ 
          icon: 'success', 
          title: '¡Actualizada!', 
          text: 'Reserva actualizada correctamente', 
          confirmButtonColor: '#3085d6' 
        });
      } else {
        // Crear nueva reserva
        await ReservasService.create(form);
        Swal.fire({ 
          icon: 'success', 
          title: '¡Creada!', 
          text: 'Reserva creada correctamente', 
          confirmButtonColor: '#3085d6' 
        });
      }
      
      fetchAll(); // Recargar datos
      closeForm();
    } catch (err) {
      console.error('Error al guardar reserva:', err);
      Swal.fire({ 
        icon: 'error', 
        title: 'Error', 
        text: err.response?.data?.message || 'Error al guardar la reserva', 
        confirmButtonColor: '#d32f2f' 
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Eliminar reserva
  const handleDelete = reserva => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Deseas eliminar la reserva de ${reserva.usuario?.nombres || 'usuario'} para el ${reserva.fecha} (${reserva.hora_inicio} - ${reserva.hora_fin})?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await ReservasService.delete(reserva.id);
          fetchAll(); // Recargar datos
          Swal.fire({ 
            icon: 'success', 
            title: '¡Eliminada!', 
            text: 'Reserva eliminada correctamente', 
            confirmButtonColor: '#3085d6' 
          });
        } catch (err) {
          console.error('Error al eliminar reserva:', err);
          Swal.fire({
            icon: 'error',
            html: '<b>No se puede eliminar la reserva.</b><br><span style="font-size:1.1em">Puede estar asociada a dependencias.</span>',
            background: '#d32f2f',
            color: '#fff',
            iconColor: '#fff',
            confirmButtonColor: '#fff',
            confirmButtonText: '<span style="color:#d32f2f;font-weight:bold">Entendido</span>',
            customClass: {
              popup: 'swal2-border-radius',
              title: 'swal2-title-bold',
            },
          });
        }
      }
    });
  };

  // Buscar usuario por código
  const buscarUsuarioPorCodigo = () => {
    const usuario = usuarios.find(u => u.codigo === codigoUsuario.trim());
    setUsuarioEncontrado(usuario || null);
    if (usuario) {
      setForm(f => ({ ...f, usuario_id: usuario.id }));
    }
  };

  // Limpiar búsqueda de usuario
  const limpiarBusqueda = () => {
    setCodigoUsuario('');
    setUsuarioEncontrado(null);
    setForm(f => ({ ...f, usuario_id: '' }));
  };

  // Aplicar filtros a las reservas
  const reservasFiltradas = reservas.filter(r => {
    const usuarioOk = !usuarioFiltro || 
      (r.usuario && r.usuario.nombres && 
       contieneTexto(r.usuario.nombres, usuarioFiltro));
    
    const codigoOk = !filtroCodigo || 
      (r.usuario && r.usuario.codigo && 
       contieneTexto(r.usuario.codigo, filtroCodigo));
    
    const fechaOk = !filtroFecha || r.fecha === filtroFecha;
    
    return usuarioOk && codigoOk && fechaOk;
  });

  // Mostrar loading
  if (loading) {
    return (
      <div className="container py-4">
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="mt-2 text-muted">Cargando reservas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="panel-title mb-0">Reservas</h2>
          <small className="text-muted">
            <i className="bi bi-shield-check me-1"></i>
            {rol === 'organizador' ? 'Modo Organizador - Puede ver y editar reservas' : 'Modo Administrador - Acceso completo sin restricciones'}
          </small>
        </div>
        <button className="btn btn-success" onClick={() => openForm()}>
          <i className="bi bi-plus-lg me-1"></i> Nueva Reserva
        </button>
      </div>
      
      {/* Filtros de reservas */}
      <div className="row g-2 mb-3">
        <div className="col-12 col-md-3">
          <label className="form-label">Filtrar por nombre de usuario</label>
          <input
            type="text"
            className="form-control"
            placeholder="Nombre de usuario..."
            value={usuarioFiltro}
            onChange={e => setUsuarioFiltro(e.target.value)}
          />
        </div>
        <div className="col-12 col-md-3">
          <label className="form-label">Filtrar por código único</label>
          <input 
            type="text" 
            className="form-control" 
            placeholder="Código único..." 
            value={filtroCodigo} 
            onChange={e => setFiltroCodigo(e.target.value)} 
          />
        </div>
        <div className="col-12 col-md-3">
          <label className="form-label">Filtrar por fecha</label>
          <input 
            type="date" 
            className="form-control" 
            value={filtroFecha} 
            onChange={e => setFiltroFecha(e.target.value)} 
          />
        </div>
        <div className="col-12 col-md-3 d-flex justify-content-end align-items-end">
          <button
            className="btn btn-outline-secondary px-4"
            style={{ minWidth: 180 }}
            onClick={limpiarFiltros}
          >
            <i className="bi bi-arrow-clockwise me-1"></i> Limpiar Filtros
          </button>
        </div>
      </div>

      {/* Búsqueda de usuario para formulario */}
      {showForm && (
        <div className="mb-3">
          <label className="form-label">Buscar usuario por código único</label>
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="Código único del usuario..."
              value={codigoUsuario}
              onChange={e => setCodigoUsuario(e.target.value)}
            />
            <button 
              type="button" 
              className="btn btn-outline-primary" 
              onClick={buscarUsuarioPorCodigo}
            >
              Buscar
            </button>
            {usuarioEncontrado && (
              <button 
                type="button" 
                className="btn btn-outline-secondary" 
                onClick={limpiarBusqueda}
              >
                Limpiar
              </button>
            )}
          </div>
          {usuarioEncontrado && (
            <div className="mt-2 text-success fw-bold">
              <i className="bi bi-check-circle me-1"></i>
              {usuarioEncontrado.nombres}
            </div>
          )}
          {!usuarioEncontrado && codigoUsuario && (
            <div className="mt-2 text-danger">
              <i className="bi bi-exclamation-circle me-1"></i>
              No se encontró usuario con ese código.
            </div>
          )}
        </div>
      )}

      {/* Lista de reservas */}
      {!showForm && (
        <ReservasList
          reservas={reservasFiltradas}
          onEditar={handleEdit}
          onDelete={(rol === 'admin' || rol === 'administrador') ? handleDelete : null}
          rol={rol}
        />
      )}

      {/* Formulario de reserva */}
      {showForm && (
        <div className="card p-4 shadow-sm mb-4">
          <ReservaFormAdmin
            form={form}
            onChange={handleChange}
            onSubmit={handleSubmit}
            onCancel={closeForm}
            editReserva={editReserva}
            canchas={canchas}
            usuarios={usuarioEncontrado ? [usuarioEncontrado] : usuarios}
            estadosReserva={estadosReserva}
            submitting={submitting}
          />
          {console.log('🔍 ReservasAdmin - Estado del form enviado:', form)}
        </div>
      )}
    </div>
  );
} 