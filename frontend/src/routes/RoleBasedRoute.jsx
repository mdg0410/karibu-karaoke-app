import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { checkUserRole } from '../utils/localStorage';

/**
 * Componente para proteger rutas basadas en roles
 * Verifica si el usuario tiene el rol requerido
 * 
 * @param {Object} props - Propiedades del componente
 * @param {string} props.requiredRole - Rol requerido ('admin', 'trabajador', 'cliente')
 * @param {string} props.redirectPath - Ruta a la que redirigir si no tiene permiso
 * @returns {JSX.Element} El componente hijo (Outlet) o redirección a la ruta especificada
 */
const RoleBasedRoute = ({ requiredRole, redirectPath = '/' }) => {
  const location = useLocation();
  const hasPermission = checkUserRole(requiredRole);

  // Si no tiene el rol requerido, redirigir a la ruta especificada
  if (!hasPermission) {
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }

  // Si tiene el rol requerido, renderizar los componentes hijos
  return <Outlet />;
};

export default RoleBasedRoute;