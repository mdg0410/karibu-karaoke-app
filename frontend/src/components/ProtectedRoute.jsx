import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function ProtectedRoute({ children, allowedRoles }) {
  const { currentUser, loading } = useAuth();
  const location = useLocation();
  
  // Si está cargando, mostrar un spinner o mensaje
  if (loading) {
    return <div className="flex justify-center items-center h-screen">Cargando...</div>;
  }
  
  // Si no hay usuario, redirigir a la página de login correspondiente
  if (!currentUser) {
    // Determinar la ruta de login basada en el path actual
    let loginPath = '/';
    if (location.pathname.startsWith('/admin')) {
      loginPath = '/admin-login';
    } else if (location.pathname.startsWith('/staff')) {
      loginPath = '/staff-login';
    } else if (location.pathname.startsWith('/client')) {
      loginPath = '/mesa-selection';
    }

    return <Navigate to={loginPath} state={{ from: location }} replace />;
  }

  // Verificar el rol
  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    return <Navigate to="/" replace />;
  }
  
  // Si hay usuario y tiene el rol permitido, mostrar el contenido
  return children;
}

export default ProtectedRoute;
