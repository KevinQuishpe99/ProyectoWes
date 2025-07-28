import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

export default function ReservaForm({ form, onChange, onSubmit, onCancel, editReserva, canchas, usuarios, estadosReserva }) {
  const [nombreUsuario, setNombreUsuario] = useState('');
  const [canchaFiltro, setCanchaFiltro] = useState('');

  useEffect(() => {
    if (editReserva && editReserva.usuario_id) {
      const usuario = usuarios.find(u => u.id === editReserva.usuario_id);
      setNombreUsuario(usuario ? usuario.nombre || usuario.username || '' : '');
    } else {
      setNombreUsuario('');
    }
    // Sincronizar el nombre de la cancha seleccionada al abrir el form
    if (form.cancha_id && canchas.length > 0) {
      const canchaSel = canchas.find(c => c.id === form.cancha_id);
      setCanchaFiltro(canchaSel ? canchaSel.nombre : '');
    } else {
      setCanchaFiltro('');
    }
  }, [editReserva, usuarios, form.cancha_id, canchas]);

  const handleBuscarUsuario = () => {
    const usuario = usuarios.find(u => (u.nombre || u.username || '').toLowerCase() === nombreUsuario.toLowerCase());
    if (usuario) {
      Swal.fire({ icon: 'success', title: 'Usuario encontrado', text: usuario.nombre || usuario.username, confirmButtonColor: '#3085d6' });
      onChange({ target: { name: 'usuario_id', value: usuario.id } });
    } else {
      Swal.fire({ icon: 'error', title: 'No encontrado', text: 'No existe un usuario con ese nombre.', confirmButtonColor: '#d32f2f' });
      onChange({ target: { name: 'usuario_id', value: '' } });
    }
  };

  const handleChange = e => {
    let { name, value } = e.target;
    // Convertir a número los IDs si corresponde
    if (['usuario_id', 'cancha_id'].includes(name)) {
      value = value ? Number(value) : '';
    }
    onChange({ target: { name, value } });
  };

  // Manejar selección de cancha por nombre
  const handleCanchaInput = (e) => {
    setCanchaFiltro(e.target.value);
    // Buscar si el valor coincide exactamente con alguna cancha (ignorando mayúsculas/minúsculas y espacios)
    const cancha = canchas.find(c => c.nombre.trim().toLowerCase() === e.target.value.trim().toLowerCase());
    if (cancha) {
      onChange({ target: { name: 'cancha_id', value: cancha.id } });
    } else {
      onChange({ target: { name: 'cancha_id', value: '' } });
    }
  };

  const handleSubmit = e => {
    e.preventDefault();
    // Validar que estado no sea vacío
    if (!form.estado) {
      Swal.fire({ icon: 'error', title: 'Error', text: 'Debes seleccionar un estado.', confirmButtonColor: '#d32f2f' });
      return;
    }
    // Validar que usuario_id y cancha_id sean números válidos
    if (!form.usuario_id || !form.cancha_id) {
      Swal.fire({ icon: 'error', title: 'Error', text: 'Debes seleccionar un usuario y una cancha.', confirmButtonColor: '#d32f2f' });
      return;
    }
    onSubmit(e);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="modal-header">
        <h5 className="modal-title modal-title-llamativo">{editReserva ? 'Editar' : 'Nueva'} Reserva</h5>
        <button type="button" className="btn-close" onClick={onCancel}></button>
      </div>
      <div className="modal-body">
        <div className="mb-3">
          <label className="form-label">Usuario</label>
          <select name="usuario_id" className="form-select" value={form.usuario_id} onChange={onChange} required>
            <option value="">Selecciona un usuario</option>
            {usuarios.map(u => <option key={u.id} value={u.id}>{u.nombres}</option>)}
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label">Cancha</label>
          <input
            type="text"
            className="form-control"
            list="canchas-list"
            placeholder="Buscar y seleccionar cancha por nombre..."
            value={canchaFiltro}
            onChange={handleCanchaInput}
            required
          />
          <datalist id="canchas-list">
            {canchas
              .filter(c =>
                !canchaFiltro || (c.nombre && c.nombre.toLowerCase().includes(canchaFiltro.toLowerCase()))
              )
              .map(c => <option key={c.id} value={c.nombre} />)}
          </datalist>
        </div>
        <div className="mb-3">
          <label className="form-label">Fecha</label>
          <input name="fecha" type="date" className="form-control" value={form.fecha} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Hora Inicio</label>
          <select name="hora_inicio" className="form-select" value={form.hora_inicio} onChange={handleChange} required>
            <option value="">Selecciona hora inicio</option>
            {[...Array(16)].map((_, i) => {
              const h = 7 + i;
              const label = `${h}:00`;
              return <option key={h} value={label}>{label}</option>;
            })}
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label">Hora Fin</label>
          <select name="hora_fin" className="form-select" value={form.hora_fin} onChange={handleChange} required>
            <option value="">Selecciona hora fin</option>
            {[...Array(16)].map((_, i) => {
              const h = 7 + i;
              const label = `${h}:00`;
              return <option key={h} value={label}>{label}</option>;
            })}
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label">Estado</label>
          <select
            name="estado"
            className="form-select"
            value={form.estado ? form.estado.toLowerCase() : ''}
            onChange={handleChange}
            required
          >
            <option value="">Selecciona un estado</option>
            {(estadosReserva && estadosReserva.length > 0
              ? estadosReserva
              : ['reservada', 'cancelada', 'finalizada']
            ).map(e => (
              <option key={e} value={e.toLowerCase()}>{e}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancelar</button>
        <button type="submit" className="btn btn-primary">Guardar</button>
      </div>
    </form>
  );
} 