import { useState } from 'react';

const initialForm = { usuario_id: '', cancha_id: '', fecha: '', hora_inicio: '', hora_fin: '', estado: '' };

export default function useReservaForm() {
  const [showForm, setShowForm] = useState(false);
  const [editReserva, setEditReserva] = useState(null);
  const [form, setForm] = useState(initialForm);

  const openForm = (reserva = null) => {
    setEditReserva(reserva);
    if (reserva) {
      const normalizarHora = (h) => h ? h.split(':').slice(0,2).join(':') : '';
      setForm({
        ...reserva,
        hora_inicio: normalizarHora(reserva.hora_inicio),
        hora_fin: normalizarHora(reserva.hora_fin),
        estado: reserva.estado ? reserva.estado.toLowerCase() : ''
      });
    } else {
      setForm(initialForm);
    }
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditReserva(null);
    setForm(initialForm);
  };

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  return {
    showForm,
    editReserva,
    form,
    openForm,
    closeForm,
    handleChange
  };
} 