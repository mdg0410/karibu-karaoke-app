import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();
  const [carritoVisible, setCarritoVisible] = useState(false);
  const [seccionActiva, setSeccionActiva] = useState('bebidas');

  useEffect(() => {
    if (currentUser && currentUser.id) {
      navigate(`/client/${currentUser.id}`);
    } else {
      // Mostrar un diálogo para elegir una mesa si no hay ID
      console.log('Mostrar diálogo para elegir una mesa');
    }
  }, [currentUser, navigate]);

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
