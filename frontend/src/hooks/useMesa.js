import { useSelector, useDispatch } from 'react-redux';
import { 
  fetchMesas, 
  fetchMesaById, 
  validarMesaThunk, 
  actualizarMesa,
  actualizarEstadoMesa,
  setMesaId,
  clearMesaError,
  resetMesaValidacion,
  clearMesaActual
} from '../features/mesas/mesaSlice';
import { useNavigate } from 'react-router-dom';
import { saveSession, getSession } from '../utils/localStorage';

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
    try {
      const resultAction = await dispatch(fetchMesas());
      if (fetchMesas.fulfilled.match(resultAction)) {
        return resultAction.payload;
      }
      throw new Error(resultAction.payload || 'Error al obtener las mesas');
    } catch (error) {
      console.error('Error en obtenerMesas:', error);
      throw error;
    }
  };
  
  /**
   * Obtener una mesa por ID
   * @param {string} id - ID de la mesa a obtener
   * @returns {Promise} Promesa que se resuelve con los datos de la mesa
   */
  const obtenerMesaPorId = async (id) => {
    try {
      const resultAction = await dispatch(fetchMesaById(id));
      if (fetchMesaById.fulfilled.match(resultAction)) {
        return resultAction.payload;
      }
      throw new Error(resultAction.payload || 'Error al obtener la mesa');
    } catch (error) {
      console.error('Error en obtenerMesaPorId:', error);
      throw error;
    }
  };
  
  /**
   * Validar disponibilidad de una mesa
   * @param {string} identificador - ID o número de la mesa a validar
   * @returns {Promise} Promesa que se resuelve con el resultado de la validación
   */
  const validarMesaDisponible = async (identificador) => {
    try {
      console.log('Validando mesa con identificador:', identificador);
      // Limpiamos errores previos antes de iniciar la validación
      dispatch(clearMesaError());
      
      const resultAction = await dispatch(validarMesaThunk(identificador));
      
      if (validarMesaThunk.fulfilled.match(resultAction)) {
        console.log('Resultado validación (fulfilled):', resultAction.payload);
        return resultAction.payload;
      } else if (validarMesaThunk.rejected.match(resultAction)) {
        console.log('Resultado validación (rejected):', resultAction.error);
        throw new Error(resultAction.payload || 'No se pudo validar la mesa. Intenta con otra mesa.');
      }
      
      throw new Error('Error desconocido al validar la mesa');
    } catch (error) {
      console.error('Error en validarMesaDisponible:', error);
      throw error;
    }
  };
  
  /**
   * Actualizar datos de una mesa
   * @param {string} id - ID de la mesa a actualizar
   * @param {Object} data - Datos a actualizar
   * @returns {Promise} Promesa que se resuelve cuando la mesa se actualiza
   */
  const actualizarDatosMesa = async (id, data) => {
    try {
      const resultAction = await dispatch(actualizarMesa({ mesaId: id, mesaData: data }));
      if (actualizarMesa.fulfilled.match(resultAction)) {
        return resultAction.payload;
      }
      throw new Error(resultAction.payload || 'Error al actualizar la mesa');
    } catch (error) {
      console.error('Error en actualizarDatosMesa:', error);
      throw error;
    }
  };
  
  /**
   * Actualizar el estado de una mesa
   * @param {string} id - ID de la mesa
   * @param {string} estado - Nuevo estado ('disponible', 'ocupada', etc)
   * @returns {Promise} Promesa que se resuelve cuando el estado se actualiza
   */
  const cambiarEstadoDeMesa = async (id, estado) => {
    try {
      const resultAction = await dispatch(actualizarEstadoMesa({ mesaId: id, estado }));
      if (actualizarEstadoMesa.fulfilled.match(resultAction)) {
        return resultAction.payload;
      }
      throw new Error(resultAction.payload || 'Error al cambiar el estado de la mesa');
    } catch (error) {
      console.error('Error en cambiarEstadoDeMesa:', error);
      throw error;
    }
  };
  
  /**
   * Seleccionar una mesa y guardarla en localStorage
   * @param {string} id - ID de la mesa a seleccionar
   */
  const seleccionarMesa = (id) => {
    console.log('Seleccionando mesa con ID:', id);
    
    // Si no hay ID, no hacemos nada
    if (!id) {
      console.error('Error: No se proporcionó un ID de mesa válido');
      return;
    }
    
    // Guardamos el ID de la mesa y redirigimos
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
  
  /**
   * Limpiar la mesa actual y su ID
   */
  const limpiarMesaActual = () => {
    dispatch(clearMesaActual());
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
    cambiarEstadoDeMesa,
    seleccionarMesa,
    limpiarError,
    reiniciarValidacion,
    limpiarMesaActual
  };
};

export default useMesa;