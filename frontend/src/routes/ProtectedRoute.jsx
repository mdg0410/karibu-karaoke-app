import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import useMesa from '../hooks/useMesa';

const ProtectedRoute = () => {
  const { isAuthenticated, user } = useAuth();
  const { mesaId } = useMesa();
  const location = useLocation();

  // Si no está autenticado, redirigir a registro
  if (!isAuthenticated) {
    return <Navigate to="/registro" />;
  }

  // Si es un cliente y está intentando acceder al panel sin mesa seleccionada
  if (user?.rol === 'cliente' && 
      location.pathname === '/cliente/panel' && 
      !mesaId) {
    return <Navigate to="/mesa/seleccion" />;
  }

  // Si todo está bien, mostrar la ruta protegida
  return <Outlet />;
};

export default ProtectedRoute;