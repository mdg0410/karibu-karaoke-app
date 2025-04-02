import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

// Importar contexto de autenticación
import { useAuth } from '../../context/AuthContext';

// Placeholder para componentes que aún no están implementados
const StaffNavbar = ({ onSeccionChange, seccionActiva, onLogout }) => (
  <nav className="bg-dark-card p-4 shadow-md">
    <div className="container mx-auto flex justify-between items-center">
      <div className="text-white text-xl font-bold">Karibu Karaoke - Staff</div>
      <div className="flex space-x-4">
        <button 
          onClick={() => onSeccionChange('pedidos')} 
          className={`px-4 py-2 ${seccionActiva === 'pedidos' ? 'text-primary' : 'text-white'}`}
        >
          Pedidos
        </button>
        <button 
          onClick={() => onSeccionChange('mesas')} 
          className={`px-4 py-2 ${seccionActiva === 'mesas' ? 'text-primary' : 'text-white'}`}
        >
          Mesas
        </button>
        <button 
          onClick={onLogout} 
          className="px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded"
        >
          Cerrar sesión
        </button>
      </div>
    </div>
  </nav>
);

const Pedidos = () => (
  <div className="bg-dark-card p-6 rounded shadow-md">
    <h2 className="text-2xl font-bold mb-4 text-white">Pedidos pendientes</h2>
    <p className="text-white">Aquí se mostrarán los pedidos pendientes.</p>
  </div>
);

const Mesas = () => (
  <div className="bg-dark-card p-6 rounded shadow-md">
    <h2 className="text-2xl font-bold mb-4 text-white">Estado de mesas</h2>
    <p className="text-white">Aquí se mostrará el estado de las mesas.</p>
  </div>
);

const StaffDashboard = () => {
  const { t } = useTranslation();
  const { currentUser, logout } = useAuth();
  const [seccionActiva, setSeccionActiva] = useState('pedidos');

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
        {seccionActiva === 'pedidos' && <Pedidos />}
        {seccionActiva === 'mesas' && <Mesas />}
      </main>
    </div>
  );
};

export default StaffDashboard;
