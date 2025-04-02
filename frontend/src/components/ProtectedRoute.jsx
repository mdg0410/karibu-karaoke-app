import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function ProtectedRoute({ children, allowedRoles }) {
  const { currentUser, loading } = useAuth();
  const location = useLocation();
  
  // Si está cargando, mostrar un spinner
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-dark">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  // Verificar si hay datos en localStorage aunque currentUser sea null
  if (!currentUser && allowedRoles.includes('cliente')) {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      if (userData.role === 'cliente') {
        // Si hay datos válidos en localStorage, mostrar el contenido
        return children;
      }
    }
  }
  
  // Si no hay usuario autenticado
  if (!currentUser) {
    // Para rutas de cliente, redirigir al inicio
    if (allowedRoles.includes('cliente')) {
      return <Navigate to="/" replace />;
    }
    
    // Para otras rutas, redirigir a su login correspondiente
    if (location.pathname.startsWith('/admin')) {
      return <Navigate to="/admin-login" replace />;
    } else if (location.pathname.startsWith('/staff')) {
      return <Navigate to="/staff-login" replace />;
    }
    
    return <Navigate to="/" replace />;
  }

  // Verificar el rol
  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    return <Navigate to="/" replace />;
  }
  
  // Si hay usuario y tiene el rol permitido, mostrar el contenido
  return children;
}

export default ProtectedRoute;
