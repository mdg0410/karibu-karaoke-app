import React from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

/**
 * Layout para la página principal y páginas públicas
 * 
 * @param {Object} props - Propiedades del componente
 * @param {ReactNode} props.children - Contenido del layout
 * @returns {JSX.Element} Layout de la página de inicio
 */
const HomeLayout = ({ children }) => {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <div className="flex flex-col min-h-screen bg-karaoke-black">
      {/* Header */}
      <header className="bg-karaoke-darkgray py-4 shadow-lg">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-primary">
            Karibu <span className="text-white">Karaoke</span>
          </Link>

          <nav className="flex items-center space-x-4">
            {!isAuthenticated ? (
              <>
                <Link to="/mesa/seleccion" className="text-white hover:text-primary transition-colors">
                  Iniciar Experiencia
                </Link>
                <Link to="/staff/login" className="text-white hover:text-primary transition-colors">
                  Acceso Staff
                </Link>
                <Link to="/admin/login" className="text-white hover:text-primary transition-colors">
                  Administración
                </Link>
              </>
            ) : (
              <>
                {user?.rol === 'cliente' && (
                  <Link to="/cliente/panel" className="text-white hover:text-primary transition-colors">
                    Mi Panel
                  </Link>
                )}
                {user?.rol === 'trabajador' && (
                  <Link to="/staff/panel" className="text-white hover:text-primary transition-colors">
                    Panel Staff
                  </Link>
                )}
                {user?.rol === 'admin' && (
                  <Link to="/admin/panel" className="text-white hover:text-primary transition-colors">
                    Panel Admin
                  </Link>
                )}
                <button 
                  onClick={logout}
                  className="text-white hover:text-primary transition-colors"
                >
                  Cerrar Sesión
                </button>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-karaoke-darkgray py-6 text-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h3 className="text-xl font-bold text-primary">Karibu Karaoke</h3>
              <p className="text-sm mt-1">La mejor experiencia de karaoke</p>
            </div>
            <div className="text-sm text-gray-400">
              &copy; {new Date().getFullYear()} Karibu Karaoke. Todos los derechos reservados.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomeLayout;