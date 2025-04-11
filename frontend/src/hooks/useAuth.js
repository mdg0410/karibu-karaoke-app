import { useSelector, useDispatch } from 'react-redux';
import { 
  loginThunk, 
  logoutThunk, 
  registerThunk, 
  checkAuthStatusThunk,
  clearError 
} from '../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';

/**
 * Hook personalizado para manejar la autenticación
 * @returns {Object} Funciones y estados relacionados con autenticación
 */
export const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated, loading, error, role } = useSelector((state) => state.auth);
  
  /**
   * Iniciar sesión de usuario
   * @param {Object} credentials - Credenciales de inicio de sesión
   * @returns {Promise} Promesa que se resuelve con el usuario autenticado
   */
  const login = async (credentials) => {
    try {
      const resultAction = await dispatch(loginThunk(credentials));
      if (loginThunk.fulfilled.match(resultAction)) {
        const userRole = resultAction.payload.user.role;
        
        // Redirigir según el rol
        if (userRole === 'admin') {
          navigate('/admin/panel');
        } else if (userRole === 'trabajador') {
          navigate('/staff/panel');
        } else {
          navigate('/cliente/panel');
        }
        
        return resultAction.payload;
      }
      throw new Error(resultAction.payload || 'Error al iniciar sesión');
    } catch (error) {
      console.error("Error en login:", error);
      throw error;
    }
  };
  
  /**
   * Cerrar sesión de usuario
   * @returns {Promise} Promesa que se resuelve cuando se cierra la sesión
   */
  const logout = async () => {
    try {
      await dispatch(logoutThunk());
      navigate('/');
    } catch (error) {
      console.error("Error en logout:", error);
    }
  };
  
  /**
   * Registrar un nuevo usuario cliente
   * @param {Object} userData - Datos del usuario a registrar
   * @returns {Promise} Promesa que se resuelve con el usuario registrado
   */
  const register = async (userData) => {
    try {
      // Añadir contraseña por defecto para clientes si no está incluida
      const userDataWithPassword = {
        ...userData,
        password: userData.password || 'password123',
        role: 'cliente'
      };
      
      const resultAction = await dispatch(registerThunk(userDataWithPassword));
      if (registerThunk.fulfilled.match(resultAction)) {
        navigate('/cliente/panel');
        return resultAction.payload;
      }
      throw new Error(resultAction.payload || 'Error al registrar');
    } catch (error) {
      console.error("Error en register:", error);
      throw error;
    }
  };
  
  /**
   * Verificar el estado de autenticación actual
   * @returns {Promise} Promesa que se resuelve con el resultado de la verificación
   */
  const checkAuth = async () => {
    try {
      const resultAction = await dispatch(checkAuthStatusThunk());
      return resultAction.payload;
    } catch (error) {
      console.error("Error en checkAuth:", error);
      throw error;
    }
  };
  
  /**
   * Limpiar errores de autenticación
   */
  const limpiarError = () => {
    dispatch(clearError());
  };
  
  return {
    user,
    isAuthenticated,
    loading,
    error,
    role,
    login,
    logout,
    register,
    checkAuth,
    limpiarError
  };
};

export default useAuth;