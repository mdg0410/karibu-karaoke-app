import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  // Obtener el token del localStorage
  const token = localStorage.getItem('token');
  
  // Si no hay token, redirigir a la página de inicio
  if (!token) {
    return <Navigate to="/" replace />;
  }
  
  // Si hay token, renderizar los componentes hijos
  return children;
};

export default ProtectedRoute;