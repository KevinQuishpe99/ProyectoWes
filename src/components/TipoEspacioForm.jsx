import React, { useState, useRef, useEffect } from 'react';

export default function TipoEspacioForm({ form, onChange, onSubmit, onCancel, editTipo, ICONS, renderSelectedIcon }) {
  const [preview, setPreview] = useState(form.imagen ? (typeof form.imagen === 'string' ? `data:image/jpeg;base64,${form.imagen}` : null) : null);
  const fileInput = useRef();

  useEffect(() => {
    if (form && form.imagen && typeof form.imagen === 'string') {
      setPreview(`data:image/jpeg;base64,${form.imagen}`);
    }
  }, [form]);

  const handleFile = (e) => {
    const file = e.target.files[0];
    onChange({ target: { name: 'imagen', value: file } });
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <div className="modal-header">
        <h5 className="modal-title modal-title-llamativo">{editTipo ? 'Editar' : 'Nuevo'} Tipo de Espacio</h5>
        <button type="button" className="btn-close" onClick={onCancel}></button>
      </div>
      <div className="modal-body">
        <div className="mb-3">
          <label className="form-label">Nombre</label>
          <input name="nombre" className="form-control" value={form.nombre} onChange={onChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Descripción</label>
          <textarea name="descripcion" className="form-control" value={form.descripcion || ''} onChange={onChange} rows={2} />
        </div>
        <div className="mb-3">
          <label className="form-label">Imagen</label>
          <input type="file" name="imagen" className="form-control" accept="image/*" onChange={handleFile} ref={fileInput} />
          {preview && (
            <img src={preview} alt="preview" className="img-fluid rounded mt-2 border" style={{ maxHeight: 120 }} />
          )}
        </div>
      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancelar</button>
        <button type="submit" className="btn btn-primary">Guardar</button>
      </div>
    </form>
  );
} 