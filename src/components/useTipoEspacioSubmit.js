export default function useTipoEspacioSubmit({ editTipo, form, fetchTipos, closeModal, setMsg }) {
  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('nombre', form.nombre);
      formData.append('descripcion', form.descripcion || '');
      if (form.imagen && typeof form.imagen !== 'string') {
        formData.append('imagen', form.imagen);
      }
      if (editTipo) {
        await import('../../servicios/tiposEspacio/tiposEspacioService').then(({ default: TiposEspacioService }) =>
          TiposEspacioService.update(editTipo.id, formData)
        );
        setMsg({ type: 'success', text: 'Tipo de espacio actualizado' });
      } else {
        await import('../../servicios/tiposEspacio/tiposEspacioService').then(({ default: TiposEspacioService }) =>
          TiposEspacioService.create(formData)
        );
        setMsg({ type: 'success', text: 'Tipo de espacio creado' });
      }
      fetchTipos();
      setTimeout(closeModal, 1000);
    } catch (err) {
      setMsg({ type: 'danger', text: err.response?.data?.message || 'Error' });
    }
  };
  return handleSubmit;
} 