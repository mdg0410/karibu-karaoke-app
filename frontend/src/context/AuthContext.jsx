import React, { createContext, useState, useEffect, useContext } from 'react';
import { postApi, getApi } from '../services/api';
import * as mockFallback from '../services/mockFallback';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [useFallback, setUseFallback] = useState(false);

  useEffect(() => {
    // Verificar si hay un usuario autenticado almacenado en localStorage
    const user = localStorage.getItem('user');
    if (user) {
      setCurrentUser(JSON.parse(user));
    }
    setLoading(false);
  }, []);

  // Función para determinar si se debe usar el fallback
  const shouldUseFallback = (error) => {
    return error.message.includes('NetworkError') || 
           error.message.includes('Failed to fetch');
  };

  // Función para iniciar sesión (admin/staff)
  const login = async (email, role, password = null) => {
    try {
      setError('');
      setLoading(true);
      
      const loginData = {
        email,
        password
      };
      
      try {
        const response = await postApi(`auth/login/${role}`, loginData);
        
        if (response.success) {
          const userData = {
            ...response.user,
            token: response.token,
            role: response.user.role || role
          };
          
          setCurrentUser(userData);
          localStorage.setItem('user', JSON.stringify(userData));
          return { success: true, data: userData };
        }
        
        throw new Error(response.message || 'Error en autenticación');
      } catch (apiError) {
        // Si hay error de red o certificado, usar respaldo
        if (shouldUseFallback(apiError)) {
          setUseFallback(true);
          console.warn('Usando servicio de respaldo para login debido a error de conexión:', apiError.message);
          
          // Simular respuesta de login exitoso
          const mockUserData = {
            id: Math.floor(Math.random() * 1000),
            name: email.split('@')[0],
            email,
            role,
            token: Math.random().toString(36).substring(2)
          };
          
          setCurrentUser(mockUserData);
          localStorage.setItem('user', JSON.stringify(mockUserData));
          return { success: true, data: mockUserData };
        }
        
        throw apiError;
      }
    } catch (error) {
      console.error('Error en login:', error);
      setError(error.message || 'Error desconocido en autenticación');
      return { success: false, message: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Función para verificar una mesa
  const verificarMesa = async (mesaId) => {
    try {
      setError('');
      
      try {
        // Usar la nueva ruta GET para verificar mesas
        const response = await getApi(`mesas/verificar/${mesaId}`);
        return response;
      } catch (apiError) {
        // Intento con POST como fallback por compatibilidad
        try {
          console.log('Intentando con método POST como fallback...');
          const responseFallback = await postApi('mesas/verificar', { mesaId });
          return responseFallback;
        } catch (postError) {
          // Si hay error de red o certificado, usar mock fallback
          if (shouldUseFallback(apiError)) {
            setUseFallback(true);
            console.warn('Usando servicio de respaldo para verificación de mesa debido a error de conexión:', apiError.message);
            return mockFallback.verificarMesa(mesaId);
          }
          
          throw apiError;
        }
      }
    } catch (error) {
      console.error('Error al verificar mesa:', error);
      setError(error.message || 'Error al verificar la mesa');
      return { success: false, message: error.message };
    }
  };

  // Función para registrar cliente en mesa
  const registrarCliente = async (clienteData, mesaId) => {
    try {
      setError('');
      setLoading(true);
      
      try {
        const response = await postApi('clientes/registrar', {
          ...clienteData,
          mesaId
        });
        
        if (response.success) {
          const userData = {
            id: response.cliente.id,
            nombre: clienteData.nombre,
            email: clienteData.email,
            telefono: clienteData.telefono,
            role: 'cliente',
            token: response.token,
            mesaId
          };
          
          // Establecer el usuario actual en el contexto
          setCurrentUser(userData);
          
          // Guardar datos en localStorage
          localStorage.setItem('user', JSON.stringify(userData));
          localStorage.setItem('clienteToken', response.token);
          localStorage.setItem('mesaId', mesaId);
          
          return { 
            success: true, 
            cliente: userData,
            token: response.token 
          };
        }
        
        throw new Error(response.message || 'Error al registrar cliente');
      } catch (apiError) {
        // Si hay error de red o certificado, usar respaldo
        if (shouldUseFallback(apiError)) {
          setUseFallback(true);
          console.warn('Usando servicio de respaldo para registro de cliente debido a error de conexión:', apiError.message);
          
          const mockResponse = await mockFallback.registrarCliente({
            ...clienteData,
            mesaId
          });
          
          const userData = {
            id: mockResponse.cliente.id,
            nombre: clienteData.nombre,
            email: clienteData.email,
            telefono: clienteData.telefono,
            role: 'cliente',
            token: mockResponse.token,
            mesaId
          };
          
          // Establecer el usuario actual en el contexto
          setCurrentUser(userData);
          
          // Guardar datos en localStorage
          localStorage.setItem('user', JSON.stringify(userData));
          localStorage.setItem('clienteToken', mockResponse.token);
          localStorage.setItem('mesaId', mesaId);
          
          return { 
            success: true, 
            cliente: userData,
            token: mockResponse.token 
          };
        }
        
        throw apiError;
      }
    } catch (error) {
      console.error('Error al registrar cliente:', error);
      setError(error.message || 'Error desconocido al registrar cliente');
      return { success: false, message: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Función para cerrar sesión
  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('mesaId');
    localStorage.removeItem('clienteToken');
  };

  const value = {
    currentUser,
    setCurrentUser,
    login,
    logout,
    loading,
    error,
    verificarMesa,
    registrarCliente,
    useFallback
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
