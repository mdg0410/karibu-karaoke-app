import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

// Importar componentes
import AdminNavbar from './AdminNavbar';
import Mesas from './Secciones/Mesas';
import Pedidos from './Secciones/Pedidos';
import Canciones from './Secciones/Canciones';
import Inventario from './Secciones/Inventario';
import Reporte from './Secciones/Reporte';

// Importar contexto de autenticación
import { useAuth } from '../../context/AuthContext';

const AdminDashboard = () => {
  const { t } = useTranslation();
  const { currentUser, logout } = useAuth();
  const [seccionActiva, setSeccionActiva] = useState('mesas');

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-dark">
      <AdminNavbar 
        onSeccionChange={setSeccionActiva} 
        seccionActiva={seccionActiva}
        onLogout={handleLogout}
      />
      
      <main className="p-6 max-w-7xl mx-auto">
        {seccionActiva === 'mesas' && <Mesas />}
        {seccionActiva === 'pedidos' && <Pedidos />}
        {seccionActiva === 'canciones' && <Canciones />}
        {seccionActiva === 'inventario' && <Inventario />}
        {seccionActiva === 'reporte' && <Reporte />}
      </main>
    </div>
  );
};

export default AdminDashboard;
