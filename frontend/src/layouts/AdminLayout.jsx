import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

/**
 * Layout para las páginas de administración
 * 
 * @param {Object} props - Propiedades del componente
 * @param {ReactNode} props.children - Contenido del layout
 * @returns {JSX.Element} Layout del panel de administración
 */
const AdminLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="flex h-screen bg-karaoke-black">
      {/* Sidebar - Desktop */}
      <aside 
        className={`${sidebarOpen ? 'w-64' : 'w-20'} hidden lg:block bg-karaoke-darkgray transition-all duration-300 ease-in-out fixed h-full z-30`}
      >
        <div className="h-16 flex items-center justify-between px-4 border-b border-karaoke-gray/30">
          <Link to="/admin/panel" className="flex items-center justify-center h-16">
            {sidebarOpen ? (
              <span className="text-xl font-bold text-primary">Karibu Admin</span>
            ) : (
              <span className="text-xl font-bold text-primary">KA</span>
            )}
          </Link>
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)} 
            className="rounded-md p-1 text-white hover:bg-karaoke-gray transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              {sidebarOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
              )}
            </svg>
          </button>
        </div>
        <nav className="flex flex-col py-4">
          <div className="px-4 py-2">
            <div className={`${sidebarOpen ? 'flex items-center' : 'flex flex-col items-center'} mb-4`}>
              <div className="bg-purple-800/60 p-2 rounded-full">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              {sidebarOpen && (
                <div className="ml-4">
                  <p className="text-sm font-medium text-white">{user?.nombre || 'Admin'}</p>
                  <p className="text-xs text-primary-light">Administrador</p>
                </div>
              )}
            </div>
          </div>
          <div className="space-y-1 px-2">
            <Link 
              to="/admin/panel" 
              className={`${sidebarOpen ? 'flex items-center' : 'flex flex-col items-center'} px-4 py-3 text-white hover:bg-karaoke-gray rounded-lg transition-colors`}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              {sidebarOpen && <span className="ml-3">Panel Principal</span>}
            </Link>
            <Link 
              to="/admin/mesas" 
              className={`${sidebarOpen ? 'flex items-center' : 'flex flex-col items-center'} px-4 py-3 text-white hover:bg-karaoke-gray rounded-lg transition-colors`}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              {sidebarOpen && <span className="ml-3">Mesas</span>}
            </Link>
            <Link 
              to="/admin/usuarios" 
              className={`${sidebarOpen ? 'flex items-center' : 'flex flex-col items-center'} px-4 py-3 text-white hover:bg-karaoke-gray rounded-lg transition-colors`}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              {sidebarOpen && <span className="ml-3">Usuarios</span>}
            </Link>
            <Link 
              to="/admin/canciones" 
              className={`${sidebarOpen ? 'flex items-center' : 'flex flex-col items-center'} px-4 py-3 text-white hover:bg-karaoke-gray rounded-lg transition-colors`}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
              </svg>
              {sidebarOpen && <span className="ml-3">Canciones</span>}
            </Link>
            <Link 
              to="/admin/productos" 
              className={`${sidebarOpen ? 'flex items-center' : 'flex flex-col items-center'} px-4 py-3 text-white hover:bg-karaoke-gray rounded-lg transition-colors`}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {sidebarOpen && <span className="ml-3">Productos</span>}
            </Link>
            <Link 
              to="/admin/reportes" 
              className={`${sidebarOpen ? 'flex items-center' : 'flex flex-col items-center'} px-4 py-3 text-white hover:bg-karaoke-gray rounded-lg transition-colors`}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              {sidebarOpen && <span className="ml-3">Reportes</span>}
            </Link>
            <button 
              onClick={handleLogout}
              className={`${sidebarOpen ? 'flex items-center' : 'flex flex-col items-center'} w-full px-4 py-3 text-white hover:bg-karaoke-gray rounded-lg transition-colors`}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              {sidebarOpen && <span className="ml-3">Cerrar Sesión</span>}
            </button>
          </div>
        </nav>
      </aside>

      <div className={`lg:ml-${sidebarOpen ? '64' : '20'} transition-all duration-300 ease-in-out w-full`}>
        {/* Header - Mobile */}
        <header className="bg-karaoke-darkgray py-3 px-4 lg:hidden">
          <div className="flex justify-between items-center">
            <Link to="/admin/panel" className="text-xl font-bold text-primary">
              Karibu Admin
            </Link>

            {/* Hamburger menu button - Solo para móvil */}
            <button 
              className="text-white focus:outline-none" 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            </button>
          </div>

          {/* Mobile navigation - Visible solo cuando está abierto */}
          {mobileMenuOpen && (
            <nav className="pt-2 pb-2 border-t border-karaoke-gray/30 mt-3">
              <ul className="space-y-2">
                <li>
                  <Link 
                    to="/admin/panel" 
                    className="flex items-center py-2 text-white hover:text-primary transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    Panel Principal
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/admin/mesas" 
                    className="flex items-center py-2 text-white hover:text-primary transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    Mesas
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/admin/usuarios" 
                    className="flex items-center py-2 text-white hover:text-primary transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    Usuarios
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/admin/canciones" 
                    className="flex items-center py-2 text-white hover:text-primary transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                    </svg>
                    Canciones
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/admin/productos" 
                    className="flex items-center py-2 text-white hover:text-primary transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    Productos
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/admin/reportes" 
                    className="flex items-center py-2 text-white hover:text-primary transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Reportes
                  </Link>
                </li>
                <li>
                  <button 
                    onClick={handleLogout}
                    className="flex items-center w-full py-2 text-white hover:text-primary transition-colors"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Cerrar Sesión
                  </button>
                </li>
              </ul>
            </nav>
          )}
        </header>

        {/* Admin info bar */}
        <div className="bg-karaoke-gray/50 py-2 border-b border-karaoke-gray shadow-sm">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center">
              <div className="text-white hidden md:block">
                <span className="text-primary-light">Usuario: </span>
                <span className="font-medium">{user?.nombre || 'Administrador'}</span>
              </div>
              <div className="text-white text-sm">
                <span className="text-primary-light">Fecha: </span>
                <span>{new Date().toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main className="p-4 lg:p-6">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-karaoke-darkgray py-3 text-white">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="text-xs text-gray-400">
                &copy; {new Date().toLocaleDateString()} Karibu Karaoke. Panel de Administración
              </div>
              <div className="text-xs text-gray-400 mt-1 md:mt-0">
                Versión 1.0.0
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default AdminLayout;