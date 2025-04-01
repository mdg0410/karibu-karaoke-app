import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// Importar componentes
import StaffNavbar from './StaffNavbar';
import Mesas from './Secciones/Mesas';
import Pedidos from './Secciones/Pedidos';
import Canciones from './Secciones/Canciones';

// Importar contexto de autenticación
import { useAuth } from '../../context/AuthContext';

const StaffDashboard = () => {
  const { t } = useTranslation();
  const { currentUser, logout } = useAuth();
  const [seccionActiva, setSeccionActiva] = useState('mesas');

  // Verificar si el usuario está autenticado como staff
  if (!currentUser || currentUser.role !== 'staff') {
    return <Navigate to="/" replace />;
  }

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-dark">
      <StaffNavbar 
        onSeccionChange={setSeccionActiva} 
        seccionActiva={seccionActiva}
        onLogout={handleLogout}
      />
      
      <main className="p-6 max-w-7xl mx-auto">
        {seccionActiva === 'mesas' && <Mesas />}
        {seccionActiva === 'pedidos' && <Pedidos />}
        {seccionActiva === 'canciones' && <Canciones />}
      </main>
    </div>
  );
};

export default StaffDashboard;
