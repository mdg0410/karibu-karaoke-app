import { useSelector, useDispatch } from 'react-redux';
import { 
  fetchMesas, 
  fetchMesaById, 
  validarMesaThunk, 
  actualizarMesa,
  setMesaId,
  clearMesaError,
  resetMesaValidacion
} from '../features/mesas/mesaSlice';
import { useNavigate } from 'react-router-dom';
import { saveSession } from '../utils/localStorage';

/**
 * Hook personalizado para manejar operaciones con mesas
 * @returns {Object} Funciones y estados relacionados con mesas
 */
export const useMesa = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { mesas, mesaActual, mesaId, loading, error, mesaValidada } = useSelector((state) => state.mesa);
  
  /**
   * Obtener todas las mesas
   * @returns {Promise} Promesa que se resuelve con la lista de mesas
   */
  const obtenerMesas = async () => {
    const resultAction = await dispatch(fetchMesas());
    if (fetchMesas.fulfilled.match(resultAction)) {
      return resultAction.payload;
    }
    return Promise.reject(resultAction.payload);
  };
  
  /**
   * Obtener una mesa por ID
   * @param {string} id - ID de la mesa a obtener
   * @returns {Promise} Promesa que se resuelve con los datos de la mesa
   */
  const obtenerMesaPorId = async (id) => {
    const resultAction = await dispatch(fetchMesaById(id));
    if (fetchMesaById.fulfilled.match(resultAction)) {
      return resultAction.payload;
    }
    return Promise.reject(resultAction.payload);
  };
  
  /**
   * Validar disponibilidad de una mesa
   * @param {string} id - ID de la mesa a validar
   * @returns {Promise} Promesa que se resuelve con el resultado de la validación
   */
  const validarMesaDisponible = async (id) => {
    const resultAction = await dispatch(validarMesaThunk(id));
    if (validarMesaThunk.fulfilled.match(resultAction)) {
      if (resultAction.payload.disponible) {
        saveSession({ mesaId: id });
        dispatch(setMesaId(id));
        return resultAction.payload;
      }
    }
    return Promise.reject(resultAction.payload || { message: 'Mesa no disponible' });
  };
  
  /**
   * Actualizar datos de una mesa
   * @param {string} id - ID de la mesa a actualizar
   * @param {Object} data - Datos a actualizar
   * @returns {Promise} Promesa que se resuelve cuando la mesa se actualiza
   */
  const actualizarDatosMesa = async (id, data) => {
    const resultAction = await dispatch(actualizarMesa({ mesaId: id, mesaData: data }));
    if (actualizarMesa.fulfilled.match(resultAction)) {
      return resultAction.payload;
    }
    return Promise.reject(resultAction.payload);
  };
  
  /**
   * Seleccionar una mesa y guardarla en localStorage
   * @param {string} id - ID de la mesa a seleccionar
   */
  const seleccionarMesa = (id) => {
    dispatch(setMesaId(id));
    saveSession({ mesaId: id });
    navigate('/registro');
  };
  
  /**
   * Limpiar errores de mesa
   */
  const limpiarError = () => {
    dispatch(clearMesaError());
  };
  
  /**
   * Reiniciar el estado de validación de mesa
   */
  const reiniciarValidacion = () => {
    dispatch(resetMesaValidacion());
  };
  
  return {
    mesas,
    mesaActual,
    mesaId,
    loading,
    error,
    mesaValidada,
    obtenerMesas,
    obtenerMesaPorId,
    validarMesaDisponible,
    actualizarDatosMesa,
    seleccionarMesa,
    limpiarError,
    reiniciarValidacion
  };
};

export default useMesa;