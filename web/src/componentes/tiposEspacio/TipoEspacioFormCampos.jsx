import React from 'react';

export default function TipoEspacioFormCampos({ form, onChange }) {
  return (
    <>
      <div className="mb-3">
        <label className="form-label">Nombre</label>
        <input name="nombre" className="form-control" value={form.nombre} onChange={onChange} required />
      </div>
      <div className="mb-3">
        <label className="form-label">Descripción</label>
        <textarea name="descripcion" className="form-control" value={form.descripcion || ''} onChange={onChange} rows={2} />
      </div>
    </>
  );
} 