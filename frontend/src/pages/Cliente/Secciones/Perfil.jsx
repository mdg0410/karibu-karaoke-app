import React from 'react';
import { useAuth } from '../../../context/AuthContext';

const Perfil = ({ onLogout }) => {
  const { currentUser } = useAuth();
  
  return (
    <div className="bg-dark-card p-6 rounded-lg border border-white/10">
      <h2 className="text-2xl font-bold mb-6 text-white">Perfil</h2>
      
      <div className="mb-6">
        <p className="text-white/70 mb-1">Nombre:</p>
        <p className="text-white">{currentUser?.nombre || 'Usuario'}</p>
      </div>
      
      <div className="mb-6">
        <p className="text-white/70 mb-1">Email:</p>
        <p className="text-white">{currentUser?.email || 'usuario@example.com'}</p>
      </div>
      
      <button 
        onClick={onLogout}
        className="bg-primary text-white py-2 px-4 font-bold mt-4"
      >
        Cerrar sesión
      </button>
    </div>
  );
};

export default Perfil;
