import { useState } from 'react';

const initialForm = { nombre: '', descripcion: '', imagen: null };

export default function useTipoEspacioForm() {
  const [modal, setModal] = useState(false);
  const [editTipo, setEditTipo] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [msg, setMsg] = useState(null);

  const openModal = (tipo = null) => {
    setEditTipo(tipo);
    setForm(tipo ? { nombre: tipo.nombre, descripcion: tipo.descripcion || '', imagen: tipo.imagen || null } : initialForm);
    setModal(true);
    setMsg(null);
  };

  const closeModal = () => {
    setModal(false);
    setEditTipo(null);
    setForm(initialForm);
    setMsg(null);
  };

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  return { modal, editTipo, form, openModal, closeModal, handleChange, msg, setMsg };
} 