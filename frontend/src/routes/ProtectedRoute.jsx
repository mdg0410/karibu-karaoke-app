import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { hasActiveSession } from '../utils/localStorage';

/**
 * Componente para proteger rutas que requieren autenticación
 * Verifica si existe un token válido en localStorage
 * 
 * @returns {JSX.Element} El componente hijo (Outlet) o redirección a inicio
 */
const ProtectedRoute = () => {
  const isAuthenticated = hasActiveSession();

  // Si no está autenticado, redirigir a la página principal
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Si está autenticado, renderizar los componentes hijos
  return <Outlet />;
};

export default ProtectedRoute;