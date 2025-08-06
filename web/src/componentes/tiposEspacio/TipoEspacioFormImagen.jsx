import React, { useRef } from 'react';

export default function TipoEspacioFormImagen({ form, onChange, preview, setPreview }) {
  const fileInput = useRef();

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
    <div className="mb-3">
      <label className="form-label">Imagen</label>
      <input type="file" name="imagen" className="form-control" accept="image/*" onChange={handleFile} ref={fileInput} />
      {preview && (
        <img src={preview} alt="preview" className="img-fluid rounded mt-2 border" style={{ maxHeight: 120 }} />
      )}
    </div>
  );
} 