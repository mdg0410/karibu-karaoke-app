import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Obtener todos los usuarios (para admin)
export const getUsuarios = async () => {
  try {
    const response = await axios.get(`${API_URL}/usuarios`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error en el servidor' };
  }
};

// Obtener un usuario específico por ID
export const getUsuarioById = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/usuarios/${userId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error en el servidor' };
  }
};

// Actualizar datos de usuario
export const updateUsuario = async (userId, userData) => {
  try {
    const response = await axios.put(`${API_URL}/usuarios/${userId}`, userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error en el servidor' };
  }
};

// Cambiar contraseña
export const cambiarPassword = async (userId, passwords) => {
  try {
    const response = await axios.post(`${API_URL}/usuarios/${userId}/cambiar-password`, passwords);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error en el servidor' };
  }
};

// Crear un nuevo usuario (para admin)
export const crearUsuario = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/usuarios`, userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error en el servidor' };
  }
};