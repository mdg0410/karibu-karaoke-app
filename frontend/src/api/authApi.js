import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Configuración de Axios para incluir el token en todas las peticiones
export const setupAuthInterceptor = () => {
  axios.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token');
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
    const response = await axios.post(`${API_URL}/usuarios/registro`, {
      ...userData,
      rol: 'cliente'
    });
    
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

// Cerrar sesión (sólo limpia localStorage, no hay endpoint específico)
export const logout = () => {
  localStorage.removeItem('user');
  localStorage.removeItem('token');
  localStorage.removeItem('mesaId');
};