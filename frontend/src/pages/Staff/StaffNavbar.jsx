import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';

const StaffNavbar = ({ onSeccionChange, seccionActiva, onLogout }) => {
  const { t } = useTranslation();
  const { currentUser } = useAuth();
  const [perfilMenuVisible, setPerfilMenuVisible] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const secciones = [
    { id: 'mesas', nombre: 'Mesas' },
    { id: 'pedidos', nombre: 'Pedidos' },
    { id: 'canciones', nombre: 'Canciones' }
  ];
  
  const togglePerfilMenu = () => {
    setPerfilMenuVisible(!perfilMenuVisible);
  };
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleSeccionChange = (seccionId) => {
    onSeccionChange(seccionId);
    setMobileMenuOpen(false); // Cerrar menú móvil al cambiar de sección
  };
  
  return (
    <nav className="bg-dark-card border-b border-primary/20 py-4 px-4 sm:px-6">
      <div className="flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center">
          <div className="text-primary text-2xl font-bold mr-4">Karibu Staff</div>
          
          {/* Menú desktop - visible en pantallas md y superiores */}
          <ul className="hidden md:flex space-x-6">
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
        
        {/* Botones de perfil */}
        <div className="flex items-center space-x-4">
          {/* Botón de menú hamburguesa - visible solo en pantallas pequeñas */}
          <button 
            className="md:hidden text-white p-2 focus:outline-none"
            onClick={toggleMobileMenu}
          >
            {mobileMenuOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
          
          <div className="relative">
            <button 
              onClick={togglePerfilMenu}
              className="flex items-center space-x-2 text-white/90 hover:text-white"
            >
              <div className="w-8 h-8 bg-secondary/20 rounded-full flex items-center justify-center">
                {currentUser?.nombre?.charAt(0).toUpperCase() || 'S'}
              </div>
              <span className="hidden sm:inline">{currentUser?.nombre || 'Staff'}</span>
            </button>
            
            {perfilMenuVisible && (
              <div className="absolute right-0 mt-2 w-48 bg-dark-card border border-white/20 shadow-lg z-50">
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

      {/* Menú móvil - solo visible cuando está abierto y en pantallas pequeñas */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-4 border-t border-white/10 pt-4">
          <ul className="flex flex-col space-y-2">
            {secciones.map(seccion => (
              <li key={seccion.id}>
                <button 
                  onClick={() => handleSeccionChange(seccion.id)}
                  className={`block w-full text-left px-3 py-2 ${
                    seccionActiva === seccion.id 
                      ? 'text-white bg-primary/10 border-l-4 border-primary' 
                      : 'text-white/70 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {seccion.nombre}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default StaffNavbar;
