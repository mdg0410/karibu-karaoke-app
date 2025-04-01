import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';

const ClienteNavbar = ({ onSeccionChange, seccionActiva, onToggleCarrito, onLogout }) => {
  const { t } = useTranslation();
  const { currentUser } = useAuth();
  const [perfilMenuVisible, setPerfilMenuVisible] = useState(false);
  
  const secciones = [
    { id: 'bebidas', nombre: 'Bebidas' },
    { id: 'comida', nombre: 'Comida' },
    { id: 'canciones', nombre: 'Canciones' }
  ];
  
  const togglePerfilMenu = () => {
    setPerfilMenuVisible(!perfilMenuVisible);
  };
  
  return (
    <nav className="bg-dark-card border-b border-primary/20 py-4 px-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <div className="text-primary text-2xl font-bold mr-4">Karibu</div>
          <ul className="flex space-x-6">
            {secciones.map(seccion => (
              <li key={seccion.id}>
                <button 
                  onClick={() => onSeccionChange(seccion.id)}
                  className={`px-3 py-2 transition-colors duration-200 ${
                    seccionActiva === seccion.id 
                      ? 'text-white border-b-2 border-primary' 
                      : 'text-white/70 hover:text-white'
                  }`}
                >
                  {seccion.nombre}
                </button>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="flex items-center space-x-4">
          <button 
            onClick={onToggleCarrito}
            className="bg-primary/20 text-white p-2 rounded-full relative"
          >
            🛒
            <span className="absolute -top-1 -right-1 bg-primary text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
              0
            </span>
          </button>
          
          <div className="relative">
            <button 
              onClick={togglePerfilMenu}
              className="flex items-center space-x-2 text-white/90 hover:text-white"
            >
              <div className="w-8 h-8 bg-secondary/20 rounded-full flex items-center justify-center">
                {currentUser?.nombre?.charAt(0).toUpperCase() || 'U'}
              </div>
              <span>{currentUser?.nombre || 'Usuario'}</span>
            </button>
            
            {perfilMenuVisible && (
              <div className="absolute right-0 mt-2 w-48 bg-dark-card border border-white/20 shadow-lg z-10">
                <button 
                  onClick={() => {
                    onSeccionChange('perfil');
                    setPerfilMenuVisible(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-white/70 hover:bg-white/10 hover:text-white"
                >
                  Perfil
                </button>
                <button 
                  onClick={onLogout}
                  className="block w-full text-left px-4 py-2 text-white/70 hover:bg-white/10 hover:text-white"
                >
                  Cerrar sesión
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default ClienteNavbar;
