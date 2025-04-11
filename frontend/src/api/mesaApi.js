import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Obtener todas las mesas
export const getMesas = async () => {
  try {
    const response = await axios.get(`${API_URL}/mesas`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error en el servidor' };
  }
};

// Obtener mesa por ID
export const getMesaById = async (mesaId) => {
  try {
    const response = await axios.get(`${API_URL}/mesas/${mesaId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error en el servidor' };
  }
};

// Validar disponibilidad de mesa
export const validarMesa = async (mesaId) => {
  try {
    const response = await axios.get(`${API_URL}/mesas/${mesaId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error en el servidor' };
  }
};

// Actualizar estado de mesa
export const updateMesa = async (mesaId, mesaData) => {
  try {
    const response = await axios.put(`${API_URL}/mesas/${mesaId}`, mesaData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error en el servidor' };
  }
};

// Crear nueva mesa (solo admin)
export const crearMesa = async (mesaData) => {
  try {
    const response = await axios.post(`${API_URL}/mesas`, mesaData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error en el servidor' };
  }
};