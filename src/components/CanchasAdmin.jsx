// Componente principal de administración de canchas
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
<<<<<<< HEAD:src/componentes/canchas/CanchasAdmin.jsx
import { fetchCanchas, addCancha, editCancha, removeCancha } from '../../servicios/canchas/canchasSlice';
import { getTiposEspacio, getEstadosCancha } from '../../servicios/canchas/canchasService';
=======
import CanchasList from './CanchasList';
import CanchaForm from './CanchaForm';
import { fetchCanchas, addCancha, editCancha, removeCancha } from '../features/canchas/canchasSlice';
import { getTiposEspacio, getEstadosCancha } from '../features/canchas/canchasService';
>>>>>>> parent of 9e760a9 (faltoa modulos de admin):src/components/CanchasAdmin.jsx
import Swal from 'sweetalert2';
import useFiltroCanchas from './useFiltroCanchas';
import CanchasAdminHeader from './CanchasAdminHeader';
import CanchasFiltros from './CanchasFiltros';
import CanchasContador from './CanchasContador';
import CanchasAdminLista from './CanchasAdminLista';
import CanchasAdminModal from './CanchasAdminModal';

/**
 * Componente principal de administración de canchas.
 * Este componente orquesta toda la gestión CRUD de canchas, incluyendo:
 * - Carga de datos desde el store de Redux y servicios externos.
 * - Uso de hooks personalizados para filtrar la lista de canchas.
 * - Renderizado de subcomponentes modulares para header, filtros, contador, lista y modal de formulario.
 * - Manejo de estado local para mostrar formularios y editar datos.
 *
 * Props:
 *   - rol: string que indica el rol del usuario (para permisos en la UI).
 *
 * Uso:
 *   <CanchasAdmin rol={rolUsuario} />
 */
const CanchasAdmin = ({ rol }) => {
  /**
   * Redux: obtener canchas y loading del store global.
   * Se usa useDispatch para disparar acciones y useSelector para leer el estado.
   * El slice de canchas contiene la lista y el estado de carga.
   */
  const dispatch = useDispatch();
  const { items: canchas, loading } = useSelector((estado) => estado.canchas);

  /**
   * Estado local para controlar la visibilidad del formulario modal (mostrarFormulario)
   * y para almacenar la cancha que se está editando (datoEditar).
   * Además, se almacenan los catálogos de tipos de espacio y estados de cancha,
   * que se obtienen desde servicios externos al montar el componente.
   */
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [datoEditar, setDatoEditar] = useState(null);
  const [tiposEspacio, setTiposEspacio] = useState([]);
  const [estadosCancha, setEstadosCancha] = useState([]);

  /**
   * useEffect para cargar los datos iniciales al montar el componente.
   * - Dispara la acción fetchCanchas para obtener la lista de canchas desde el backend (vía Redux).
   * - Llama a los servicios getTiposEspacio y getEstadosCancha para obtener los catálogos necesarios para los filtros y formularios.
   *
   * Este efecto solo se ejecuta una vez al montar el componente.
   */
  useEffect(() => {
    dispatch(fetchCanchas());
    getTiposEspacio().then(setTiposEspacio);
    getEstadosCancha().then(setEstadosCancha);
  }, [dispatch]);

  /**
   * Hook personalizado useFiltroCanchas:
   * Este hook encapsula toda la lógica de filtrado de canchas según nombre, tipo y estado.
   * Devuelve los estados y setters de los filtros, una función para limpiar filtros,
   * y la lista de canchas ya filtrada lista para mostrar.
   *
   * Uso:
   *   const { filtroNombre, setFiltroNombre, ... , canchasFiltradas } = useFiltroCanchas(...)
   *
   * Esto permite separar la lógica de filtrado del componente principal y reutilizarla si es necesario.
   */
  const {
    filtroNombre,
    setFiltroNombre,
    filtroTipo,
    setFiltroTipo,
    filtroEstado,
    setFiltroEstado,
    limpiarFiltros,
    canchasFiltradas
  } = useFiltroCanchas(canchas, tiposEspacio, estadosCancha);

  /**
   * Handler para abrir el formulario de nueva cancha.
   * Limpia el datoEditar (null) y muestra el modal de formulario.
   * Se usa cuando el usuario hace clic en "Nueva Cancha".
   */
  const manejarAgregar = () => {
    setDatoEditar(null);
    setMostrarFormulario(true);
  };

  /**
   * Handler para abrir el formulario de edición de una cancha existente.
   * Recibe la cancha seleccionada, la almacena en datoEditar y muestra el modal de formulario.
   * Se usa cuando el usuario hace clic en el botón de editar de una cancha.
   */
  const manejarEditar = (cancha) => {
    setDatoEditar(cancha);
    setMostrarFormulario(true);
  };

  /**
   * Handler para eliminar una cancha.
   * Muestra un diálogo de confirmación usando SweetAlert2.
   * Si el usuario confirma, dispara la acción removeCancha (Redux) y muestra feedback según el resultado.
   * Si la cancha está asociada a reservas, muestra un error personalizado.
   *
   * Uso:
   *   manejarEliminar(canchaSeleccionada)
   */
  const manejarEliminar = (cancha) => {
    Swal.fire({
      title: '¿Estas seguro?',
      text: `¿Deseas eliminar la cancha "${cancha.nombre}"? Esta accion no se puede deshacer.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Si, eliminar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true,
    }).then((resultado) => {
      if (resultado.isConfirmed) {
        dispatch(removeCancha(cancha.id)).then((res) => {
          if (!res.error) {
            Swal.fire({
              icon: 'success',
              title: 'Eliminada',
              text: 'La cancha fue eliminada correctamente',
              confirmButtonColor: '#3085d6',
            });
          } else {
            Swal.fire({
              icon: 'error',
              title: 'No se puede eliminar',
              html: '<br><span style="font-size:1.1em">Puede estar asociada a reservas </span>',
              background: '#d32f2f',
              color: '#fff',
              iconColor: '#fff',
              confirmButtonColor: '#fff',
              confirmButtonText: '<span style="color:#d32f2f;font-weight:bold">Entendido</span>',
              customClass: {
                popup: 'swal2-border-radius',
                title: 'swal2-title-bold',
              },
            });
          }
        });
      }
    });
  };

  /**
   * Handler para crear o editar una cancha.
   * Si hay datoEditar, se trata de una edición; si no, es una creación.
   * Dispara la acción correspondiente de Redux (addCancha o editCancha).
   * Si la operación es exitosa, recarga la lista y cierra el formulario.
   * Si hay error, muestra el mensaje de error en el formulario.
   *
   * Uso:
   *   manejarSubmitFormulario(datosFormulario, setMensajeError)
   */
  const manejarSubmitFormulario = (datos, setMensajeError) => {
    if (datoEditar) {
      dispatch(editCancha({ id: datoEditar.id, data: datos })).then((res) => {
        if (!res.error) {
          dispatch(fetchCanchas());
          setMostrarFormulario(false);
        } else if (setMensajeError) {
          setMensajeError(typeof res.error === 'object' && res.error.message ? res.error.message : String(res.error));
        }
      });
    } else {
      dispatch(addCancha(datos)).then((res) => {
        if (!res.error) {
          dispatch(fetchCanchas());
          setMostrarFormulario(false);
        } else if (setMensajeError) {
          setMensajeError(typeof res.error === 'object' && res.error.message ? res.error.message : String(res.error));
        }
      });
    }
  };

  /**
   * Render principal del componente.
   * Orquesta todos los subcomponentes modulares:
   * - CanchasAdminHeader: muestra el título y el botón "Nueva Cancha".
   * - CanchasFiltros: permite filtrar la lista por nombre, tipo y estado.
   * - CanchasContador: muestra el total y el número de resultados filtrados.
   * - CanchasAdminLista: muestra la lista de canchas y permite editar/eliminar.
   * - CanchasAdminModal: muestra el formulario para crear/editar una cancha.
   *
   * Todos los datos y handlers se pasan como props a los subcomponentes.
   */
  return (
    <div className="container py-4">
      {/* Header con título y botón para agregar nueva cancha */}
      <CanchasAdminHeader onNuevo={manejarAgregar} />
      {/* Filtros de búsqueda y filtrado de canchas */}
      <CanchasFiltros
        filtroNombre={filtroNombre}
        setFiltroNombre={setFiltroNombre}
        filtroTipo={filtroTipo}
        setFiltroTipo={setFiltroTipo}
        filtroEstado={filtroEstado}
        setFiltroEstado={setFiltroEstado}
        limpiarFiltros={limpiarFiltros}
        tiposEspacio={tiposEspacio}
        estadosCancha={estadosCancha}
      />
      {/* Contador de resultados totales y filtrados */}
      <CanchasContador total={canchas.length} filtradas={canchasFiltradas.length} />
      {/* Lista de canchas filtradas, con opciones de editar y eliminar */}
      <CanchasAdminLista
        loading={canchas.length === 0 && !mostrarFormulario}
        canchas={canchasFiltradas}
        onEdit={manejarEditar}
        onDelete={manejarEliminar}
        rol={rol}
      />
      {/* Modal de formulario para crear o editar una cancha */}
      <CanchasAdminModal
        show={mostrarFormulario}
        initialData={datoEditar}
        onSubmit={manejarSubmitFormulario}
        onCancel={() => setMostrarFormulario(false)}
        loading={loading}
      />
    </div>
  );
};

export default CanchasAdmin; 