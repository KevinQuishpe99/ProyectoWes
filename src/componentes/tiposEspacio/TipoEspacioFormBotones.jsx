import React from 'react';

export default function TipoEspacioFormBotones({ onCancel }) {
  return (
    <div className="modal-footer">
      <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancelar</button>
      <button type="submit" className="btn btn-primary">Guardar</button>
    </div>
  );
} 