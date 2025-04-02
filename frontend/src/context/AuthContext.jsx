import React, { createContext, useState, useEffect, useContext } from 'react';
import { postApi } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Verificar si hay un usuario autenticado almacenado en localStorage
    const user = localStorage.getItem('user');
    if (user) {
      setCurrentUser(JSON.parse(user));
    }
    setLoading(false);
  }, []);

  // Función para iniciar sesión
  const login = async (email, role, password = null, adminToken = null) => {
    try {
      setError('');
      setLoading(true);
      
      const loginData = {
        email,
        password,
        adminToken
      };
      
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
    } catch (error) {
      console.error('Error en login:', error);
      setError(error.message || 'Error desconocido en autenticación');
      return { success: false, message: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Función para cerrar sesión
  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('user');
  };

  const value = {
    currentUser,
    login,
    logout,
    loading,
    error
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
