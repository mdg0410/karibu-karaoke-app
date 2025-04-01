import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// Importar componentes
import ClienteNavbar from './ClienteNavbar';
import Bebidas from './Secciones/Bebidas';
import Comida from './Secciones/Comida';
import Canciones from './Secciones/Canciones';
import Perfil from './Secciones/Perfil';
import Carrito from './Carrito';

// Importar contexto de autenticación
import { useAuth } from '../../context/AuthContext';

const ClienteDashboard = () => {
  const { t } = useTranslation();
  const { currentUser, logout } = useAuth();
  const [carritoVisible, setCarritoVisible] = useState(false);
  const [seccionActiva, setSeccionActiva] = useState('bebidas');

  // Verificar si el usuario está autenticado
  if (!currentUser || currentUser.role !== 'cliente') {
    return <Navigate to="/" replace />;
  }

  const toggleCarrito = () => {
    setCarritoVisible(!carritoVisible);
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-dark">
      <ClienteNavbar 
        onSeccionChange={setSeccionActiva} 
        seccionActiva={seccionActiva}
        onToggleCarrito={toggleCarrito}
        onLogout={handleLogout}
      />
      
      <main className="p-6 max-w-7xl mx-auto">
        {seccionActiva === 'bebidas' && <Bebidas />}
        {seccionActiva === 'comida' && <Comida />}
        {seccionActiva === 'canciones' && <Canciones />}
        {seccionActiva === 'perfil' && <Perfil onLogout={handleLogout} />}
      </main>
      
      <Carrito visible={carritoVisible} onClose={() => setCarritoVisible(false)} />
    </div>
  );
};

export default ClienteDashboard;
