import { useSelector, useDispatch } from 'react-redux';
import { loginUser, registerUser, logoutUser, checkAuthStatus } from '../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import { clearMesaActual } from '../features/mesas/mesaSlice';

/**
 * Hook personalizado para manejar la autenticación
 * @returns {Object} Funciones y estados relacionados con la autenticación
 */
export const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, token, isAuthenticated, loading, error } = useSelector((state) => state.auth);

  /**
   * Iniciar sesión
   * @param {Object} credentials - Credenciales de usuario (email, password)
   * @returns {Promise} Promesa que se resuelve cuando la sesión se inicia correctamente
   */
  const login = async (credentials) => {
    const resultAction = await dispatch(loginUser(credentials));
    
    if (loginUser.fulfilled.match(resultAction)) {
      const user = resultAction.payload.usuario;
      
      // Redireccionar según el rol del usuario
      if (user.rol === 'admin') {
        navigate('/admin/panel');
      } else if (user.rol === 'trabajador') {
        navigate('/staff/panel');
      }
      
      return resultAction.payload;
    }
    
    // Si hay un error, devuelve el error para manejarlo en el componente
    return Promise.reject(resultAction.payload);
  };

  /**
   * Registrar un nuevo usuario cliente
   * @param {Object} userData - Datos del usuario (nombre, email, celular)
   * @param {string} mesaId - ID de la mesa seleccionada
   * @returns {Promise} Promesa que se resuelve cuando el registro es exitoso
   */
  const register = async (userData, mesaId) => {
    const resultAction = await dispatch(registerUser({
      ...userData,
      mesaId
    }));
    
    if (registerUser.fulfilled.match(resultAction)) {
      // Después del registro exitoso, redirigir al panel de cliente
      navigate('/cliente/panel');
      return resultAction.payload;
    }
    
    return Promise.reject(resultAction.payload);
  };

  /**
   * Cerrar sesión
   */
  const logout = () => {
    dispatch(logoutUser());
    dispatch(clearMesaActual());
    navigate('/');
  };

  /**
   * Verificar estado de autenticación
   * @returns {Promise} Promesa que se resuelve cuando se verifica el token
   */
  const checkAuth = async () => {
    const resultAction = await dispatch(checkAuthStatus());
    return checkAuthStatus.fulfilled.match(resultAction);
  };

  return {
    user,
    token,
    isAuthenticated,
    loading,
    error,
    login,
    register,
    logout,
    checkAuth
  };
};

export default useAuth;