/**
 * Funciones para manipular el localStorage y gestionar la sesión de usuario
 */

// Claves para localStorage
export const STORAGE_KEYS = {
  AUTH: 'karibu_auth',
  MESA: 'karibu_mesa',
  TOKEN: 'karibu_token'
};

/**
 * Guarda los datos de la sesión en localStorage
 * @param {Object} sessionData - Objeto con datos de sesión
 * @param {Object} sessionData.user - Datos del usuario
 * @param {string} sessionData.token - Token JWT
 * @param {string} sessionData.mesaId - ID de la mesa (opcional)
 */
export const saveSession = (data) => {
  try {
    const currentData = getSession();
    const updatedData = { ...currentData, ...data };
    localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify(updatedData));
  } catch (error) {
    console.error('Error guardando sesión:', error);
  }
};

/**
 * Obtiene todos los datos de la sesión del localStorage
 * @returns {Object} Objeto con user, token y mesaId
 */
export const getSession = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.AUTH);
    return data ? JSON.parse(data) : {};
  } catch (error) {
    console.error('Error obteniendo sesión:', error);
    return {};
  }
};

/**
 * Obtiene solo el objeto usuario del localStorage
 * @returns {Object|null} Objeto usuario o null si no existe
 */
export const getUser = () => {
  const session = getSession();
  return session.user || null;
};

/**
 * Obtiene solo el token del localStorage
 * @returns {string|null} Token o null si no existe
 */
export const getToken = () => {
  const session = getSession();
  return session.token;
};

/**
 * Obtiene solo el ID de la mesa del localStorage
 * @returns {string|null} ID de la mesa o null si no existe
 */
export const getMesaId = () => {
  const session = getSession();
  return session.mesaId || null;
};

/**
 * Verifica si el usuario está autenticado
 * @returns {boolean} true si está autenticado, false si no
 */
export const isAuthenticated = () => {
  return !!getToken();
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
export const clearSession = (clearAll = true) => {
  try {
    if (clearAll) {
      // Limpiar todo el almacenamiento local relacionado con la aplicación
      Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
    } else {
      // Solo limpiar los datos de autenticación pero mantener otras preferencias
      const session = getSession();
      const cleanedSession = {};
      // Mantener solo las preferencias que no sean de autenticación o mesa
      Object.entries(session).forEach(([key, value]) => {
        if (!['user', 'token', 'mesaId'].includes(key)) {
          cleanedSession[key] = value;
        }
      });
      localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify(cleanedSession));
    }
  } catch (error) {
    console.error('Error limpiando sesión:', error);
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

// Eliminamos el export default ya que todas las funciones ya están siendo exportadas individualmente
// Esto evita confusiones al importar