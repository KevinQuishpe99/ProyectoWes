import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CanchasList from './CanchasList';
import CanchaForm from './CanchaForm';
import { fetchCanchas, addCancha, editCancha, removeCancha } from '../../servicios/canchas/canchasSlice';
import { getTiposEspacio, getEstadosCancha } from '../../servicios/canchas/canchasService';
import Swal from 'sweetalert2';


const CanchasAdmin = ({ rol }) => {
  const dispatch = useDispatch();
  const { items: canchas, loading } = useSelector((state) => state.canchas);
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState(null);
  const [tiposEspacio, setTiposEspacio] = useState([]);
  const [estadosCancha, setEstadosCancha] = useState([]);
  const [filtroNombre, setFiltroNombre] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('');

  useEffect(() => {
    dispatch(fetchCanchas());
    getTiposEspacio().then(setTiposEspacio);
    getEstadosCancha().then(setEstadosCancha);
  }, [dispatch]);

  const handleAdd = () => {
    setEditData(null);
    setShowForm(true);
  };

  const handleEdit = (cancha) => {
    setEditData(cancha);
    setShowForm(true);
  };

  const handleDelete = (cancha) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Deseas eliminar la cancha "${cancha.nombre}"? Esta acción no se puede deshacer.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        // Intentar eliminar
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

  const handleFormSubmit = (data, setErrorMsg) => {
    if (editData) {
      dispatch(editCancha({ id: editData.id, data })).then((res) => {
        if (!res.error) {
          dispatch(fetchCanchas());
          setShowForm(false);
        } else if (setErrorMsg) {
          setErrorMsg(typeof res.error === 'object' && res.error.message ? res.error.message : String(res.error));
        }
      });
    } else {
      dispatch(addCancha(data)).then((res) => {
        if (!res.error) {
          dispatch(fetchCanchas());
          setShowForm(false);
        } else if (setErrorMsg) {
          setErrorMsg(typeof res.error === 'object' && res.error.message ? res.error.message : String(res.error));
        }
      });
    }
  };

  const limpiarFiltros = () => {
    setFiltroNombre('');
    setFiltroTipo('');
    setFiltroEstado('');
  };

  // Filtrado de canchas
  const canchasFiltradas = canchas.filter((c) => {
    const nombreOk = !filtroNombre || c.nombre.toLowerCase().includes(filtroNombre.toLowerCase());
    const tipoOk = !filtroTipo || c.tipoEspacioNombre === tiposEspacio.find(t => t.id === Number(filtroTipo))?.nombre;
    const estadoOk = !filtroEstado || c.estadoCanchaNombre === estadosCancha.find(e => e.id === Number(filtroEstado))?.nombre;
    return nombreOk && tipoOk && estadoOk;
  });

  return (
    <div className="container py-4">
    
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="panel-title mb-0">Canchas</h2>
        <button className="btn btn-success" onClick={handleAdd}>
          <i className="bi bi-plus-lg me-1"></i> Nueva Cancha
        </button>
      </div>

      {/* Filtros */}
      <div className="row g-2 mb-3">
        {/* Filtro por nombre */}
        <div className="col-12 col-md-3">
          <label className="form-label">Buscar por nombre</label>
          <div className="input-group">
            <span className="input-group-text">
              <i className="bi bi-search"></i>
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Buscar cancha..."
              value={filtroNombre}
              onChange={(e) => setFiltroNombre(e.target.value)}
            />
          </div>
        </div>

        {/* Filtro por tipo */}
        <div className="col-12 col-md-3">
          <label className="form-label">Filtrar por tipo</label>
          <select className="form-select" value={filtroTipo} onChange={e => setFiltroTipo(e.target.value)}>
            <option value="">Todos</option>
            {tiposEspacio.map(t => <option key={t.id} value={t.id}>{t.nombre}</option>)}
          </select>
        </div>

        {/* Filtro por estado */}
        <div className="col-12 col-md-3">
          <label className="form-label">Filtrar por estado</label>
          <select className="form-select" value={filtroEstado} onChange={e => setFiltroEstado(e.target.value)}>
            <option value="">Todos</option>
            {estadosCancha.map(e => <option key={e.id} value={e.id}>{e.nombre}</option>)}
          </select>
        </div>

        {/* Botón limpiar filtros */}
        <div className="col-12 col-md-3 d-flex justify-content-end align-items-end">
          <button
            className="btn btn-outline-secondary px-4"
            style={{ minWidth: 180 }}
            onClick={limpiarFiltros}
          >
            <i className="bi bi-arrow-clockwise me-1"></i> Limpiar Filtros
          </button>
        </div>
      </div>

      {/* Contador de resultados */}
      <div className="row mb-3">
        <div className="col-12">
          <div className="d-flex justify-content-end">
            <small className="text-muted">
              {canchasFiltradas.length} de {canchas.length} canchas encontradas
            </small>
          </div>
        </div>
      </div>
   
      {loading && <div className="text-center my-4"><span className="spinner-border"></span></div>}
      {!loading && !showForm && (
        <CanchasList canchas={canchasFiltradas} onEdit={handleEdit} onDelete={handleDelete} rol={rol} />
      )}
      {showForm && (
        <div className="card p-4 shadow-sm mb-4">
          <CanchaForm
            initialData={editData}
            onSubmit={handleFormSubmit}
            onCancel={() => setShowForm(false)}
            loading={loading}
          />
        </div>
      )}
    </div>
  );
};

export default CanchasAdmin; 
