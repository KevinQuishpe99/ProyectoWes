import { useState } from 'react';

const initialForm = {
  nombre: '',
  tipo: '',
  descripcion: '',
  cancha_id: '',
  fecha_inicio: '',
  fecha_fin: '',
  hora_inicio: '',
  hora_fin: '',
  estado: ''
};

export default function useEventoForm() {
  const [showForm, setShowForm] = useState(false);
  const [editEvento, setEditEvento] = useState(null);
  const [form, setForm] = useState(initialForm);

  const openForm = (evento = null) => {
    setEditEvento(evento);
    if (evento) {
      const normalizarHora = (h) => h ? h.split(':').slice(0,2).join(':') : '';
      setForm({
        ...evento,
        hora_inicio: normalizarHora(evento.hora_inicio),
        hora_fin: normalizarHora(evento.hora_fin),
        cancha_id: evento.cancha_id?.toString() || ''
      });
    } else {
      setForm(initialForm);
    }
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditEvento(null);
    setForm(initialForm);
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  return {
    showForm,
    editEvento,
    form,
    openForm,
    closeForm,
    handleChange,
    setForm
  };
} 