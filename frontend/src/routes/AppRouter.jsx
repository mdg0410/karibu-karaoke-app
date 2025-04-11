import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from '../pages/Home';
import SeleccionMesa from '../pages/cliente/SeleccionMesa';
import RegistroCliente from '../pages/cliente/RegistroCliente';
import ClientePanel from '../pages/cliente/ClientePanel';
import StaffLogin from '../pages/staff/StaffLogin';
import StaffPanel from '../pages/staff/StaffPanel';
import AdminLogin from '../pages/admin/AdminLogin';
import AdminPanel from '../pages/admin/AdminPanel';
import ProtectedRoute from './ProtectedRoute';
import RoleBasedRoute from './RoleBasedRoute';

const AppRouter = () => {
  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/" element={<Home />} />
      <Route path="/mesa/seleccion" element={<SeleccionMesa />} />
      <Route path="/mesa/:id" element={<SeleccionMesa />} />
      <Route path="/registro" element={<RegistroCliente />} />
      
      {/* Rutas de autenticación para staff y admin */}
      <Route path="/staff/login" element={<StaffLogin />} />
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* Rutas protegidas por rol */}
      <Route 
        path="/cliente/panel" 
        element={
          <ProtectedRoute>
            <RoleBasedRoute rol="cliente">
              <ClientePanel />
            </RoleBasedRoute>
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/staff/panel" 
        element={
          <ProtectedRoute>
            <RoleBasedRoute rol="trabajador">
              <StaffPanel />
            </RoleBasedRoute>
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/admin/panel" 
        element={
          <ProtectedRoute>
            <RoleBasedRoute rol="admin">
              <AdminPanel />
            </RoleBasedRoute>
          </ProtectedRoute>
        } 
      />
      
      {/* Ruta para cualquier otra dirección no definida */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRouter;