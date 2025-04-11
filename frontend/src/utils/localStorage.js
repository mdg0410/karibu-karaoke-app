/**
 * Funciones para manipular el localStorage y gestionar la sesión de usuario
 */

// Constantes para las keys de localStorage
export const STORAGE_KEYS = {
  USER: 'user',
  TOKEN: 'token',
  MESA_ID: 'mesaId'
};

/**
 * Guarda los datos de la sesión en localStorage
 * @param {Object} sessionData - Objeto con datos de sesión
 * @param {Object} sessionData.user - Datos del usuario
 * @param {string} sessionData.token - Token JWT
 * @param {string} sessionData.mesaId - ID de la mesa (opcional)
 */
export const saveSession = ({ user, token, mesaId }) => {
  if (user) localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  if (token) localStorage.setItem(STORAGE_KEYS.TOKEN, token);
  if (mesaId) localStorage.setItem(STORAGE_KEYS.MESA_ID, mesaId);
};

/**
 * Obtiene todos los datos de la sesión del localStorage
 * @returns {Object} Objeto con user, token y mesaId
 */
export const getSession = () => {
  return {
    user: JSON.parse(localStorage.getItem(STORAGE_KEYS.USER) || 'null'),
    token: localStorage.getItem(STORAGE_KEYS.TOKEN),
    mesaId: localStorage.getItem(STORAGE_KEYS.MESA_ID)
  };
};

/**
 * Obtiene solo el objeto usuario del localStorage
 * @returns {Object|null} Objeto usuario o null si no existe
 */
export const getUser = () => {
  const userData = localStorage.getItem(STORAGE_KEYS.USER);
  return userData ? JSON.parse(userData) : null;
};

/**
 * Obtiene solo el token del localStorage
 * @returns {string|null} Token o null si no existe
 */
export const getToken = () => {
  return localStorage.getItem(STORAGE_KEYS.TOKEN);
};

/**
 * Obtiene solo el ID de la mesa del localStorage
 * @returns {string|null} ID de la mesa o null si no existe
 */
export const getMesaId = () => {
  return localStorage.getItem(STORAGE_KEYS.MESA_ID);
};

/**
 * Verifica si el usuario está autenticado
 * @returns {boolean} true si está autenticado, false si no
 */
export const isAuthenticated = () => {
  return !!localStorage.getItem(STORAGE_KEYS.TOKEN);
};

/**
 * Verifica si el usuario tiene un rol específico
 * @param {string} rol - Rol a verificar ('cliente', 'trabajador', 'admin')
 * @returns {boolean} true si tiene el rol, false si no
 */
export const hasRole = (rol) => {
  const user = getUser();
  return user && user.rol === rol;
};

/**
 * Elimina los datos de sesión del localStorage
 * @param {boolean} includeMesa - Si debe eliminar también el ID de mesa
 */
export const clearSession = (includeMesa = true) => {
  localStorage.removeItem(STORAGE_KEYS.USER);
  localStorage.removeItem(STORAGE_KEYS.TOKEN);
  
  if (includeMesa) {
    localStorage.removeItem(STORAGE_KEYS.MESA_ID);
  }
};

/**
 * Verificar si hay una sesión activa
 * @returns {boolean} true si hay una sesión activa, false si no
 */
export const hasActiveSession = () => {
  const { token, user } = getSession();
  return !!token && !!user;
};

/**
 * Verificar rol de usuario
 * @param {string} requiredRole - Rol requerido
 * @returns {boolean} true si el usuario tiene el rol requerido, false si no
 */
export const checkUserRole = (requiredRole) => {
  const { user } = getSession();
  return user && user.rol === requiredRole;
};

export default {
  saveSession,
  getSession,
  getUser,
  getToken,
  getMesaId,
  isAuthenticated,
  hasRole,
  clearSession,
  hasActiveSession,
  checkUserRole,
  STORAGE_KEYS
};