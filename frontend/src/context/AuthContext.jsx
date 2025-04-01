import React, { createContext, useState, useEffect, useContext } from 'react';
import { postApi } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar si hay un usuario autenticado almacenado en localStorage
    const user = localStorage.getItem('user');
    if (user) {
      setCurrentUser(JSON.parse(user));
    }
    setLoading(false);
  }, []);

  // Función para iniciar sesión
  const login = async (email, role) => {
    try {
      const response = await postApi(`auth/login/${role}`, { email });
      
      if (response.success) {
        const userData = {
          ...response.user,
          token: response.token
        };
        
        setCurrentUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        return { success: true, data: userData };
      }
      
      return { success: false, message: 'Error en autenticación' };
    } catch (error) {
      console.error('Error en login:', error);
      return { success: false, message: error.message };
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
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
