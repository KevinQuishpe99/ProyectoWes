import { useState, useCallback, useEffect } from 'react';
import TiposEspacioService from '../../servicios/tiposEspacio/tiposEspacioService';

export default function useTiposEspacioAdminData() {
  const [tipos, setTipos] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTipos = useCallback(async () => {
    setLoading(true);
    try {
      const data = await TiposEspacioService.getAll();
      setTipos(data);
    } catch (error) {
      console.error('Error fetching tipos:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchTipos(); }, [fetchTipos]);

  return { tipos, setTipos, loading, fetchTipos };
} 