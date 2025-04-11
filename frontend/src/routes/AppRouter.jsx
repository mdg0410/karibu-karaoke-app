import React, { useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setupAuthInterceptor } from '../api/authApi';
import { checkAuthStatusThunk } from '../features/auth/authSlice';

// Componentes de rutas protegidas
import ProtectedRoute from './ProtectedRoute';
import RoleBasedRoute from './RoleBasedRoute';

// Páginas públicas
import Home from '../pages/Home';
import SeleccionMesa from '../pages/cliente/SeleccionMesa';
import RegistroCliente from '../pages/cliente/RegistroCliente';
import StaffLogin from '../pages/staff/StaffLogin';
import AdminLogin from '../pages/admin/AdminLogin';

// Páginas protegidas
import ClientePanel from '../pages/cliente/ClientePanel';
import StaffPanel from '../pages/staff/StaffPanel';
import AdminPanel from '../pages/admin/AdminPanel';

const AppRouter = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Configurar el interceptor para incluir el token en las peticiones
    setupAuthInterceptor();

    // Verificar el estado de autenticación al cargar la aplicación
    dispatch(checkAuthStatusThunk()).catch(() => {
      // Si hay un error, no hacer nada aquí, ya que el slice maneja la limpieza del estado
    });
  }, [dispatch]);

  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/" element={<Home />} />
      <Route path="/mesa/seleccion" element={<SeleccionMesa />} />
      <Route path="/mesa/:id" element={<SeleccionMesa />} />
      <Route path="/registro" element={<RegistroCliente />} />
      <Route path="/staff/login" element={<StaffLogin />} />
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* Rutas protegidas para clientes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<RoleBasedRoute requiredRole="cliente" redirectPath="/" />}>
          <Route path="/cliente/panel" element={<ClientePanel />} />
        </Route>
      </Route>

      {/* Rutas protegidas para staff */}
      <Route element={<ProtectedRoute />}>
        <Route element={<RoleBasedRoute requiredRole="trabajador" redirectPath="/staff/login" />}>
          <Route path="/staff/panel" element={<StaffPanel />} />
        </Route>
      </Route>

      {/* Rutas protegidas para administradores */}
      <Route element={<ProtectedRoute />}>
        <Route element={<RoleBasedRoute requiredRole="admin" redirectPath="/admin/login" />}>
          <Route path="/admin/panel" element={<AdminPanel />} />
        </Route>
      </Route>

      {/* Ruta para páginas no encontradas */}
      <Route path="*" element={<Home />} />
    </Routes>
  );
};

export default AppRouter;