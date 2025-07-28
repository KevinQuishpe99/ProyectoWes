import React, { useState, useRef, useEffect } from 'react';
import { getTiposEspacio, getEstadosCancha } from '../../servicios/canchas/canchasService';

const initialState = {
  nombre: '',
  tipo_espacio_id: '',
  capacidad: '',
  ubicacion_referencia: '',
  descripcion: '',
  estado_id: '',
  imagen: null,
};

const CanchaForm = ({ initialData = {}, onSubmit, onCancel, loading }) => {
  const safeInitial = initialData || {};
  const [form, setForm] = useState({
    ...initialState,
    ...safeInitial,
    ubicacion_referencia: safeInitial.ubicacion_referencia || '',
    imagen: safeInitial.imagen && typeof safeInitial.imagen !== 'string' ? safeInitial.imagen : null
  });
  const [preview, setPreview] = useState(safeInitial.imagen ? `data:image/jpeg;base64,${safeInitial.imagen}` : null);
  const [tiposEspacio, setTiposEspacio] = useState([]);
  const [estadosCancha, setEstadosCancha] = useState([]);
  const fileInput = useRef();
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    getTiposEspacio().then(setTiposEspacio);
    getEstadosCancha().then(setEstadosCancha);
  }, []);

  useEffect(() => {
    if (safeInitial && safeInitial.imagen) {
      setPreview(`data:image/jpeg;base64,${safeInitial.imagen}`);
    }
  }, [safeInitial]);

  const handleChange = (e) => {
    let { name, value } = e.target;
    if (["tipo_espacio_id", "estado_id"].includes(name)) {
      value = value ? Number(value) : '';
    }
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFile = (e) => {
    const file = e.target.files[0];
    setForm((prev) => ({ ...prev, imagen: file }));
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    const formData = new FormData();
    formData.append('nombre', form.nombre);
    formData.append('tipo_espacio_id', Number(form.tipo_espacio_id));
    formData.append('capacidad', Number(form.capacidad));
    formData.append('ubicacion_referencia', form.ubicacion_referencia);
    formData.append('descripcion', form.descripcion || '');
    formData.append('estado_id', Number(form.estado_id));
    if (form.imagen && typeof form.imagen !== 'string') {
      formData.append('imagen', form.imagen);
    }
    onSubmit(formData, setErrorMsg);
  };

  return (
    <div className="position-relative">
      {/* Botón X para cerrar */}
      <button
        type="button"
        className="btn-close position-absolute"
        style={{ top: -10, right: -10, zIndex: 10, backgroundColor: 'white', borderRadius: '50%', padding: '8px' }}
        onClick={onCancel}
        aria-label="Cerrar"
      ></button>
      
      <form onSubmit={handleSubmit} className="row g-3">
        <div className="col-12">
          <h5 className="modal-title modal-title-llamativo">{safeInitial && safeInitial.id ? 'Editar' : 'Nueva'} Cancha</h5>
        </div>
        <div className="col-12 col-md-6">
          <label className="form-label">Nombre</label>
          <input type="text" name="nombre" className="form-control" value={form.nombre} onChange={handleChange} required />
        </div>
        <div className="col-12 col-md-6">
          <label className="form-label">Tipo de Espacio</label>
          <select name="tipo_espacio_id" className="form-select" value={form.tipo_espacio_id} onChange={handleChange} required>
            <option value="">Seleccione...</option>
            {tiposEspacio.map((t) => <option key={t.id} value={t.id}>{t.nombre}</option>)}
          </select>
        </div>
        <div className="col-12 col-md-6">
          <label className="form-label">Capacidad</label>
          <input type="number" name="capacidad" className="form-control" value={form.capacidad} onChange={handleChange} required min={1} />
        </div>
        <div className="col-12 col-md-6">
          <label className="form-label">Ubicación Referencial</label>
          <input type="text" name="ubicacion_referencia" className="form-control" value={form.ubicacion_referencia} onChange={handleChange} required />
        </div>
        <div className="col-12">
          <label className="form-label">Descripción</label>
          <textarea name="descripcion" className="form-control" value={form.descripcion} onChange={handleChange} rows={2} />
        </div>
        <div className="col-12 col-md-6">
          <label className="form-label">Estado</label>
          <select name="estado_id" className="form-select" value={form.estado_id} onChange={handleChange} required>
            <option value="">Seleccione...</option>
            {estadosCancha.map((e) => <option key={e.id} value={e.id}>{e.nombre}</option>)}
          </select>
        </div>
        <div className="col-12 col-md-6">
          <label className="form-label">Imagen</label>
          <input type="file" name="imagen" className="form-control" accept="image/*" onChange={handleFile} ref={fileInput} />
          {preview && (
            <img src={preview} alt="preview" className="img-fluid rounded mt-2 border" style={{ maxHeight: 120 }} />
          )}
        </div>
        <div className="col-12">
          {errorMsg && <div className="alert alert-danger text-center py-2">{typeof errorMsg === 'string' ? errorMsg : 'Ocurrió un error al guardar la cancha. Por favor, revisa los campos e inténtalo de nuevo.'}</div>}
        </div>
        <div className="col-12 d-flex justify-content-end gap-2 mt-2">
          {onCancel && (
            <button type="button" className="btn btn-secondary" onClick={onCancel} disabled={loading}>Cancelar</button>
          )}
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? <span className="spinner-border spinner-border-sm me-2"></span> : null}
            Guardar
          </button>
        </div>
      </form>
    </div>
  );
};

export default CanchaForm; 
