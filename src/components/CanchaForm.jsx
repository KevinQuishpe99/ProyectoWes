// Formulario para crear o editar una cancha
import React, { useState, useRef, useEffect } from 'react';
import { getTiposEspacio, getEstadosCancha } from '../features/canchas/canchasService';

/**
 * Estado inicial del formulario de cancha.
 * Define los campos requeridos para crear o editar una cancha.
 * Se utiliza para inicializar y resetear el formulario.
 */
const estadoInicial = {
  nombre: '',
  tipo_espacio_id: '',
  capacidad: '',
  ubicacion_referencia: '',
  descripcion: '',
  estado_id: '',
  imagen: null,
};

/**
 * Componente de formulario para crear o editar una cancha.
 * Este componente se utiliza dentro del modal de administración de canchas.
 * Permite ingresar todos los datos necesarios para una cancha, incluyendo imagen.
 *
 * Props:
 *   - initialData: objeto con los datos de la cancha a editar (vacío para nueva cancha).
 *   - onSubmit: función que se llama al enviar el formulario (recibe FormData y setMensajeError).
 *   - onCancel: función para cerrar el formulario sin guardar cambios.
 *   - loading: booleano para mostrar estado de carga en el botón guardar.
 *
 * Uso:
 *   <CanchaForm initialData={cancha} onSubmit={fn} onCancel={fn} loading={bool} />
 */
const CanchaForm = ({ initialData = {}, onSubmit, onCancel, loading }) => {
  /**
   * Preparar datos iniciales y estado del formulario.
   * Se combinan los valores por defecto con los datos recibidos por props.
   * El estado 'formulario' almacena los valores actuales de todos los campos.
   */
  const datosIniciales = initialData || {};
  const [formulario, setFormulario] = useState({
    ...estadoInicial,
    ...datosIniciales,
    ubicacion_referencia: datosIniciales.ubicacion_referencia || '',
    imagen: datosIniciales.imagen && typeof datosIniciales.imagen !== 'string' ? datosIniciales.imagen : null
  });

  /**
   * Estado para la vista previa de la imagen seleccionada.
   * Si se edita una cancha con imagen previa, se muestra la imagen existente.
   */
  const [vistaPrevia, setVistaPrevia] = useState(datosIniciales.imagen ? `data:image/jpeg;base64,${datosIniciales.imagen}` : null);

  /**
   * Listas de tipos de espacio y estados de cancha.
   * Se obtienen desde los servicios al montar el componente.
   * Se usan para poblar los selectores del formulario.
   */
  const [tiposEspacio, setTiposEspacio] = useState([]);
  const [estadosCancha, setEstadosCancha] = useState([]);

  /**
   * Referencia al input de archivo para poder limpiar o manipular el input desde código.
   */
  const inputArchivo = useRef();

  /**
   * Mensaje de error para mostrar validaciones o errores de guardado.
   * Se muestra en un alert dentro del formulario.
   */
  const [mensajeError, setMensajeError] = useState('');

  /**
   * useEffect para cargar los catálogos de tipos de espacio y estados de cancha al montar.
   * Llama a los servicios getTiposEspacio y getEstadosCancha y actualiza el estado local.
   * Solo se ejecuta una vez al montar el componente.
   */
  useEffect(() => {
    getTiposEspacio().then(setTiposEspacio);
    getEstadosCancha().then(setEstadosCancha);
  }, []);

  /**
   * useEffect para actualizar la vista previa de la imagen si cambia la imagen inicial (por edición).
   * Si el initialData cambia y tiene imagen, se actualiza la vista previa.
   */
  useEffect(() => {
    if (datosIniciales && datosIniciales.imagen) {
      setVistaPrevia(`data:image/jpeg;base64,${datosIniciales.imagen}`);
    }
  }, [datosIniciales]);

  /**
   * Handler para cambios en los campos del formulario.
   * Actualiza el estado 'formulario' con el nuevo valor del campo editado.
   * Convierte a número los campos selectores si corresponde.
   *
   * Uso:
   *   <input name="nombre" onChange={manejarCambio} />
   */
  const manejarCambio = (e) => {
    let { name, value } = e.target;
    // Convertir a número si corresponde (para selects)
    if (["tipo_espacio_id", "estado_id"].includes(name)) {
      value = value ? Number(value) : '';
    }
    setFormulario((anterior) => ({ ...anterior, [name]: value }));
  };

  /**
   * Handler para la selección de archivo de imagen.
   * Actualiza el estado 'formulario.imagen' y genera una vista previa usando FileReader.
   * Si se elimina la imagen, limpia la vista previa.
   *
   * Uso:
   *   <input type="file" onChange={manejarArchivo} />
   */
  const manejarArchivo = (e) => {
    const archivo = e.target.files[0];
    setFormulario((anterior) => ({ ...anterior, imagen: archivo }));
    if (archivo) {
      const lector = new FileReader();
      lector.onloadend = () => setVistaPrevia(lector.result);
      lector.readAsDataURL(archivo);
    } else {
      setVistaPrevia(null);
    }
  };

  /**
   * Handler para el submit del formulario.
   * Prepara los datos en un FormData (para enviar archivos) y llama a onSubmit.
   * Si hay error, setMensajeError lo muestra en el formulario.
   *
   * Uso:
   *   <form onSubmit={manejarSubmit} />
   */
  const manejarSubmit = (e) => {
    e.preventDefault();
    setMensajeError('');
    // Preparar datos para enviar al backend como FormData
    const datosFormulario = new FormData();
    datosFormulario.append('nombre', formulario.nombre);
    datosFormulario.append('tipo_espacio_id', Number(formulario.tipo_espacio_id));
    datosFormulario.append('capacidad', Number(formulario.capacidad));
    datosFormulario.append('ubicacion_referencia', formulario.ubicacion_referencia);
    datosFormulario.append('descripcion', formulario.descripcion || '');
    datosFormulario.append('estado_id', Number(formulario.estado_id));
    if (formulario.imagen && typeof formulario.imagen !== 'string') {
      datosFormulario.append('imagen', formulario.imagen);
    }
    onSubmit(datosFormulario, setMensajeError);
  };

  /**
   * Render principal del formulario.
   * Incluye todos los campos necesarios, la vista previa de la imagen, el mensaje de error y los botones de acción.
   * Los selectores se llenan con los catálogos obtenidos por los efectos.
   */
  return (
    <div className="position-relative">
      {/* Boton X para cerrar el formulario */}
      <button
        type="button"
        className="btn-close position-absolute"
        style={{ top: -10, right: -10, zIndex: 10, backgroundColor: 'white', borderRadius: '50%', padding: '8px' }}
        onClick={onCancel}
        aria-label="Cerrar"
      ></button>
      
      <form onSubmit={manejarSubmit} className="row g-3">
        <div className="col-12">
          <h5 className="modal-title modal-title-llamativo">{datosIniciales && datosIniciales.id ? 'Editar' : 'Nueva'} Cancha</h5>
        </div>
        {/* Campo nombre de la cancha */}
        <div className="col-12 col-md-6">
          <label className="form-label">Nombre</label>
          <input type="text" name="nombre" className="form-control" value={formulario.nombre} onChange={manejarCambio} required />
        </div>
        {/* Selector de tipo de espacio */}
        <div className="col-12 col-md-6">
          <label className="form-label">Tipo de Espacio</label>
          <select name="tipo_espacio_id" className="form-select" value={formulario.tipo_espacio_id} onChange={manejarCambio} required>
            <option value="">Seleccione...</option>
            {tiposEspacio.map((t) => <option key={t.id} value={t.id}>{t.nombre}</option>)}
          </select>
        </div>
        {/* Campo capacidad */}
        <div className="col-12 col-md-6">
          <label className="form-label">Capacidad</label>
          <input type="number" name="capacidad" className="form-control" value={formulario.capacidad} onChange={manejarCambio} required min={1} />
        </div>
        {/* Campo ubicación referencial */}
        <div className="col-12 col-md-6">
          <label className="form-label">Ubicacion Referencial</label>
          <input type="text" name="ubicacion_referencia" className="form-control" value={formulario.ubicacion_referencia} onChange={manejarCambio} required />
        </div>
        {/* Campo descripción */}
        <div className="col-12">
          <label className="form-label">Descripcion</label>
          <textarea name="descripcion" className="form-control" value={formulario.descripcion} onChange={manejarCambio} rows={2} />
        </div>
        {/* Selector de estado de la cancha */}
        <div className="col-12 col-md-6">
          <label className="form-label">Estado</label>
          <select name="estado_id" className="form-select" value={formulario.estado_id} onChange={manejarCambio} required>
            <option value="">Seleccione...</option>
            {estadosCancha.map((e) => <option key={e.id} value={e.id}>{e.nombre}</option>)}
          </select>
        </div>
        {/* Campo para subir imagen y vista previa */}
        <div className="col-12 col-md-6">
          <label className="form-label">Imagen</label>
          <input type="file" name="imagen" className="form-control" accept="image/*" onChange={manejarArchivo} ref={inputArchivo} />
          {vistaPrevia && (
            <img src={vistaPrevia} alt="preview" className="img-fluid rounded mt-2 border" style={{ maxHeight: 120 }} />
          )}
        </div>
        {/* Mensaje de error si ocurre algún problema al guardar */}
        <div className="col-12">
          {mensajeError && <div className="alert alert-danger text-center py-2">{typeof mensajeError === 'string' ? mensajeError : 'Ocurrio un error al guardar la cancha. Por favor, revisa los campos e intentalo de nuevo.'}</div>}
        </div>
        {/* Botones de acción: cancelar y guardar */}
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