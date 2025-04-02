/**
 * Servicio para manejar las solicitudes a la API
 */

const API_URL = import.meta.env.VITE_API_URL || 'https://localhost:5000/api';

// Obtener el token de autenticación del localStorage
const getAuthToken = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user).token : null;
};

// Configurar headers comunes para todas las peticiones
const getHeaders = () => {
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  };
  
  const token = getAuthToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};

// Configuración común para todas las peticiones fetch
const fetchConfig = (method, body = null) => {
  const config = {
    method,
    headers: getHeaders(),
    mode: 'cors',
    credentials: 'include',
  };
  
  if (body) {
    config.body = JSON.stringify(body);
  }
  
  return config;
};

// GET: Obtener datos
export const getApi = async (endpoint) => {
  try {
    const response = await fetch(`${API_URL}/${endpoint}`, fetchConfig('GET'));
    
    // Si el servidor responde pero no es JSON válido (ej. error 500, 404)
    if (!response.ok) {
      const errorText = await response.text();
      try {
        const errorData = JSON.parse(errorText);
        throw new Error(errorData.message || 'Error en la solicitud');
      } catch (e) {
        throw new Error(`Error ${response.status}: ${errorText || response.statusText}`);
      }
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error en GET ${endpoint}:`, error);
    throw error;
  }
};

// POST: Crear datos
export const postApi = async (endpoint, body) => {
  try {
    const response = await fetch(`${API_URL}/${endpoint}`, fetchConfig('POST', body));
    
    // Si el servidor responde pero no es JSON válido
    if (!response.ok) {
      const errorText = await response.text();
      try {
        const errorData = JSON.parse(errorText);
        throw new Error(errorData.message || 'Error en la solicitud');
      } catch (e) {
        throw new Error(`Error ${response.status}: ${errorText || response.statusText}`);
      }
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error en POST ${endpoint}:`, error);
    throw error;
  }
};

// PUT: Actualizar datos
export const putApi = async (endpoint, body) => {
  try {
    const response = await fetch(`${API_URL}/${endpoint}`, fetchConfig('PUT', body));
    
    // Si el servidor responde pero no es JSON válido
    if (!response.ok) {
      const errorText = await response.text();
      try {
        const errorData = JSON.parse(errorText);
        throw new Error(errorData.message || 'Error en la solicitud');
      } catch (e) {
        throw new Error(`Error ${response.status}: ${errorText || response.statusText}`);
      }
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error en PUT ${endpoint}:`, error);
    throw error;
  }
};

// DELETE: Eliminar datos
export const deleteApi = async (endpoint) => {
  try {
    const response = await fetch(`${API_URL}/${endpoint}`, fetchConfig('DELETE'));
    
    // Si el servidor responde pero no es JSON válido
    if (!response.ok) {
      const errorText = await response.text();
      try {
        const errorData = JSON.parse(errorText);
        throw new Error(errorData.message || 'Error en la solicitud');
      } catch (e) {
        throw new Error(`Error ${response.status}: ${errorText || response.statusText}`);
      }
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error en DELETE ${endpoint}:`, error);
    throw error;
  }
};

export default { getApi, postApi, putApi, deleteApi };
