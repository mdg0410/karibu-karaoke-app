import axios from 'axios';
import { getToken, clearSession, STORAGE_KEYS } from '../utils/localStorage';

const API_URL = 'http://localhost:5000/api';

// Configuración de Axios para incluir el token en todas las peticiones
export const setupAuthInterceptor = () => {
  axios.interceptors.request.use(
    (config) => {
      const token = getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );
};

// Registro de usuario (rol cliente)
export const registrarCliente = async (userData) => {
  try {
    // Normalizar los datos para que coincidan con el formato del backend
    const datosNormalizados = {
      nombre: userData.nombre,
      email: userData.email,
      password: userData.password || 'password123',
      telefono: userData.celular,  // Mapear celular a telefono
      rol: 'cliente',              // Usar rol en lugar de role
      mesaId: userData.mesaId      // Mantener mesaId para la asociación
    };
    
    const response = await axios.post(`${API_URL}/usuarios/registro`, datosNormalizados);
    
    // Normalizar los datos para mantener la consistencia en la aplicación
    const result = {
      ...response.data,
      usuario: response.data.user || response.data.usuario
    };
    
    return result;
  } catch (error) {
    throw error.response?.data || { message: 'Error en el servidor' };
  }
};

// Login para cualquier tipo de usuario
export const login = async (credentials) => {
  try {
    const response = await axios.post(`${API_URL}/usuarios/login`, credentials);
    
    // Normalizar los datos para mantener la consistencia en la aplicación
    const result = {
      ...response.data,
      usuario: response.data.user || response.data.usuario
    };
    
    return result;
  } catch (error) {
    throw error.response?.data || { message: 'Error en el servidor' };
  }
};

// Verificar token (útil para mantener la sesión activa)
export const verificarToken = async () => {
  try {
    const response = await axios.get(`${API_URL}/usuarios/perfil`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error en el servidor' };
  }
};

// Cerrar sesión (utilizando la función clearSession de localStorage.js)
export const logout = () => {
  clearSession(true);
};