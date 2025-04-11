import axios from 'axios';
import { getSession } from '../utils/localStorage';

const API_URL = 'http://localhost:5000/api';

// Función auxiliar para configurar headers con token
const getAuthConfig = () => {
  const session = getSession();
  return {
    headers: {
      'Authorization': session.token ? `Bearer ${session.token}` : ''
    }
  };
};

// Obtener todas las mesas
export const getMesas = async () => {
  try {
    const response = await axios.get(`${API_URL}/mesas`, getAuthConfig());
    return response.data.mesas;
  } catch (error) {
    throw error.response?.data || { message: 'Error en el servidor' };
  }
};

// Obtener mesa por ID
export const getMesaById = async (mesaId) => {
  try {
    const response = await axios.get(`${API_URL}/mesas/${mesaId}`, getAuthConfig());
    return response.data.mesa;
  } catch (error) {
    throw error.response?.data || { message: 'Error en el servidor' };
  }
};

// Buscar mesa por número - Esta petición debe funcionar sin token (acceso público)
export const getMesaByNumero = async (numero) => {
  try {
    // Para la búsqueda pública, usamos un endpoint específico para mesas disponibles
    const response = await axios.get(`${API_URL}/mesas/disponibles`);
    // Buscamos la mesa con el número proporcionado
    const mesaEncontrada = response.data.mesas.find(mesa => mesa.numero.toString() === numero.toString());
    
    if (mesaEncontrada) {
      return mesaEncontrada;
    } else {
      throw { message: 'Mesa no encontrada' };
    }
  } catch (error) {
    throw error.response?.data || error || { message: 'Error al buscar la mesa por número' };
  }
};

// Validar disponibilidad de mesa - Esta función debería ser accesible públicamente sin token
export const validarMesa = async (mesaIdentificador) => {
  try {
    let mesa;
    // Verificar si el identificador es un número o un ID
    if (/^\d+$/.test(mesaIdentificador)) {
      // Si es un número, primero obtenemos todas las mesas disponibles (endpoint público)
      const response = await axios.get(`${API_URL}/mesas/disponibles`);
      
      // Buscamos la mesa con el número proporcionado
      mesa = response.data.mesas.find(m => m.numero.toString() === mesaIdentificador.toString());
      
      if (!mesa) {
        throw { message: 'Mesa no encontrada o no disponible' };
      }
    } else {
      // Si es un ID, obtenemos directamente la mesa
      const response = await axios.get(`${API_URL}/mesas/${mesaIdentificador}`);
      mesa = response.data.mesa;
    }
    
    // Verificamos si la mesa existe y su estado es "disponible"
    if (mesa) {
      return {
        disponible: mesa.estado === 'disponible',
        mesa: mesa
      };
    } else {
      throw { message: 'Mesa no encontrada' };
    }
  } catch (error) {
    console.error("Error en validarMesa:", error);
    throw error.response?.data || error || { message: 'Error al validar la mesa' };
  }
};

// Actualizar estado de mesa
export const updateMesa = async (mesaId, mesaData) => {
  try {
    const response = await axios.put(`${API_URL}/mesas/${mesaId}`, mesaData, getAuthConfig());
    return response.data.mesa;
  } catch (error) {
    throw error.response?.data || { message: 'Error en el servidor' };
  }
};

// Cambiar solo el estado de una mesa
export const cambiarEstadoMesa = async (mesaId, estado) => {
  try {
    const response = await axios.put(`${API_URL}/mesas/${mesaId}/estado`, { estado }, getAuthConfig());
    return response.data.mesa;
  } catch (error) {
    throw error.response?.data || { message: 'Error en el servidor' };
  }
};

// Crear nueva mesa (solo admin)
export const crearMesa = async (mesaData) => {
  try {
    const response = await axios.post(`${API_URL}/mesas`, mesaData, getAuthConfig());
    return response.data.mesa;
  } catch (error) {
    throw error.response?.data || { message: 'Error en el servidor' };
  }
};