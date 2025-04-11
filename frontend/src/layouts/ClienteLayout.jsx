import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import useMesa from '../hooks/useMesa';

/**
 * Layout para las páginas del cliente
 * 
 * @param {Object} props - Propiedades del componente
 * @param {ReactNode} props.children - Contenido del layout
 * @returns {JSX.Element} Layout del panel de cliente
 */
const ClienteLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const { mesaActual } = useMesa();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="flex flex-col min-h-screen bg-karaoke-black">
      {/* Header */}
      <header className="bg-karaoke-darkgray py-3 shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <Link to="/cliente/panel" className="text-2xl font-bold text-primary">
              Karibu <span className="text-white">Karaoke</span>
            </Link>

            {/* Mesa Info - Visible en móvil y desktop */}
            <div className="bg-karaoke-gray px-3 py-1 rounded-full shadow-neumorph-inset">
              <span className="text-sm text-primary-light">Mesa: </span>
              <span className="text-sm font-medium text-primary">{mesaActual?.numero || 'N/A'}</span>
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
              <Link to="/cliente/canciones" className="text-white hover:text-primary transition-colors">
                Canciones
              </Link>
              <Link to="/cliente/pedidos" className="text-white hover:text-primary transition-colors">
                Pedidos
              </Link>
              <Link to="/cliente/perfil" className="text-white hover:text-primary transition-colors">
                Mi Perfil
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
                    to="/cliente/canciones" 
                    className="block py-2 text-white hover:text-primary transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Canciones
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/cliente/pedidos" 
                    className="block py-2 text-white hover:text-primary transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Pedidos
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/cliente/perfil" 
                    className="block py-2 text-white hover:text-primary transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Mi Perfil
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
              <span className="text-primary-light">Bienvenido: </span>
              <span className="font-medium">{user?.nombre || 'Cliente'}</span>
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
              <h3 className="text-lg font-bold text-primary">Karibu Karaoke</h3>
            </div>
            <div className="flex space-x-4 mb-2 md:mb-0">
              <Link to="/cliente/canciones" className="text-sm text-white hover:text-primary transition-colors">
                Canciones
              </Link>
              <Link to="/cliente/pedidos" className="text-sm text-white hover:text-primary transition-colors">
                Pedidos
              </Link>
              <Link to="/cliente/ayuda" className="text-sm text-white hover:text-primary transition-colors">
                Ayuda
              </Link>
            </div>
            <div className="text-xs text-gray-400">
              &copy; {new Date().getFullYear()} Karibu Karaoke
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ClienteLayout;