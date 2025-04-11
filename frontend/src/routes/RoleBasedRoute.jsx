import React from 'react';
import { Navigate } from 'react-router-dom';

const RoleBasedRoute = ({ children, rol }) => {
  // Obtener el usuario del localStorage
  const user = JSON.parse(localStorage.getItem('user'));
  
  // Si no hay usuario o el rol no coincide, redirigir a la página de inicio
  if (!user || user.rol !== rol) {
    return <Navigate to="/" replace />;
  }
  
  // Si el rol coincide, renderizar los componentes hijos
  return children;
};

export default RoleBasedRoute;