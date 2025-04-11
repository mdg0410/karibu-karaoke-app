import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

/**
 * Layout para las páginas del personal de staff
 * 
 * @param {Object} props - Propiedades del componente
 * @param {ReactNode} props.children - Contenido del layout
 * @returns {JSX.Element} Layout del panel de staff
 */
const StaffLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/staff/login');
  };

  return (
    <div className="flex flex-col min-h-screen bg-karaoke-black">
      {/* Header */}
      <header className="bg-karaoke-darkgray py-3 shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <Link to="/staff/panel" className="text-2xl font-bold text-primary">
              Karibu <span className="text-white">Staff</span>
            </Link>

            {/* Role badge - Visible en móvil y desktop */}
            <div className="bg-blue-800/60 px-3 py-1 rounded-full shadow-neumorph-inset">
              <span className="text-sm font-medium text-blue-100">Trabajador</span>
            </div>

            {/* Hamburger menu button - Solo visible en móvil */}
            <button 
              className="lg:hidden text-white focus:outline-none" 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            </button>

            {/* Desktop navigation - Oculto en móvil */}
            <nav className="hidden lg:flex items-center space-x-6">
              <Link to="/staff/mesas" className="text-white hover:text-primary transition-colors">
                Gestión Mesas
              </Link>
              <Link to="/staff/clientes" className="text-white hover:text-primary transition-colors">
                Clientes
              </Link>
              <Link to="/staff/canciones" className="text-white hover:text-primary transition-colors">
                Canciones
              </Link>
              <button 
                onClick={handleLogout}
                className="px-4 py-2 bg-karaoke-darkgray text-primary font-semibold rounded-lg shadow-neumorph hover:shadow-neumorph-inset transition-all duration-300"
              >
                Cerrar Sesión
              </button>
            </nav>
          </div>

          {/* Mobile navigation - Visible solo cuando está abierto */}
          {mobileMenuOpen && (
            <nav className="lg:hidden mt-4 pb-2 pt-1 border-t border-karaoke-gray/30">
              <ul className="space-y-2">
                <li>
                  <Link 
                    to="/staff/mesas" 
                    className="block py-2 text-white hover:text-primary transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Gestión Mesas
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/staff/clientes" 
                    className="block py-2 text-white hover:text-primary transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Clientes
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/staff/canciones" 
                    className="block py-2 text-white hover:text-primary transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Canciones
                  </Link>
                </li>
                <li>
                  <button 
                    onClick={handleLogout}
                    className="w-full text-left block py-2 text-primary hover:text-primary-light transition-colors"
                  >
                    Cerrar Sesión
                  </button>
                </li>
              </ul>
            </nav>
          )}
        </div>
      </header>

      {/* User info bar */}
      <div className="bg-karaoke-gray/50 py-2 border-b border-karaoke-gray shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <div className="text-white">
              <span className="text-primary-light">Usuario: </span>
              <span className="font-medium">{user?.nombre || 'Staff'}</span>
            </div>
            <div className="text-white text-sm">
              <span className="text-primary-light">Última actividad: </span>
              <span>{new Date().toLocaleTimeString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-6">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-karaoke-darkgray py-4 text-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-2 md:mb-0">
              <h3 className="text-lg font-bold text-primary">Karibu Karaoke Staff</h3>
            </div>
            <div className="text-xs text-gray-400">
              &copy; {new Date().getFullYear()} Karibu Karaoke. Panel de Staff
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default StaffLayout;