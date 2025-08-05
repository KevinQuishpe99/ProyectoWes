import React, { useState, useEffect } from 'react';
import TipoEspacioFormCampos from './TipoEspacioFormCampos';
import TipoEspacioFormImagen from './TipoEspacioFormImagen';
import TipoEspacioFormBotones from './TipoEspacioFormBotones';

export default function TipoEspacioForm({ form, onChange, onSubmit, onCancel, editTipo }) {
  const [preview, setPreview] = useState(form.imagen ? (typeof form.imagen === 'string' ? `data:image/jpeg;base64,${form.imagen}` : null) : null);

  useEffect(() => {
    if (form && form.imagen && typeof form.imagen === 'string') {
      setPreview(`data:image/jpeg;base64,${form.imagen}`);
    }
  }, [form]);

  return (
    <form onSubmit={onSubmit}>
      <div className="modal-header">
        <h5 className="modal-title modal-title-llamativo">{editTipo ? 'Editar' : 'Nuevo'} Tipo de Espacio</h5>
        <button type="button" className="btn-close" onClick={onCancel}></button>
      </div>
      <div className="modal-body">
        <TipoEspacioFormCampos form={form} onChange={onChange} />
        <TipoEspacioFormImagen form={form} onChange={onChange} preview={preview} setPreview={setPreview} />
      </div>
      <TipoEspacioFormBotones onCancel={onCancel} />
    </form>
  );
} 
