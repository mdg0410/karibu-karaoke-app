import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const StaffLayout = ({ children }) => {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    // Eliminar datos de sesión
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    
    // Redirigir a la página de login de staff
    navigate('/staff/login');
  };

  return (
    <div className="min-h-screen bg-karaoke-black text-white">
      <header className="bg-karaoke-black py-4 px-4 md:px-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <h1 className="text-xl md:text-2xl font-bold text-primary bg-karaoke-navy px-4 py-2 rounded-xl shadow-neumorph transition-all duration-300">
          Karibu Karaoke - Panel de Staff
        </h1>
        <div className="flex items-center flex-wrap gap-3 md:gap-4">
          <span className="text-sm md:text-base bg-karaoke-darkgray px-3 py-1 rounded-lg shadow-neumorph-inset" aria-label="Nombre de usuario">
            Usuario: {localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).nombre : ''}
          </span>
          <button 
            onClick={handleLogout}
            className="px-3 md:px-4 py-2 bg-karaoke-darkgray text-primary rounded-lg shadow-neumorph hover:shadow-neumorph-inset transition-all duration-300 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
            aria-label="Cerrar sesión"
          >
            Cerrar Sesión
          </button>
        </div>
      </header>
      <nav className="bg-karaoke-navy py-2 px-4 md:px-6 shadow-neumorph overflow-x-auto">
        <ul className="flex space-x-4 md:space-x-6 min-w-max">
          <li>
            <Link 
              to="/staff/panel" 
              className="text-white hover:text-primary py-2 px-3 rounded-lg hover:bg-karaoke-navyLight hover:shadow-neumorph-inset transition-all duration-300 inline-block focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
              aria-label="Ir al dashboard"
            >
              Dashboard
            </Link>
          </li>
          <li>
            <Link 
              to="/staff/panel" 
              className="text-white hover:text-primary py-2 px-3 rounded-lg hover:bg-karaoke-navyLight hover:shadow-neumorph-inset transition-all duration-300 inline-block focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
              aria-label="Ver mesas"
            >
              Mesas
            </Link>
          </li>
          <li>
            <Link 
              to="/staff/panel" 
              className="text-white hover:text-primary py-2 px-3 rounded-lg hover:bg-karaoke-navyLight hover:shadow-neumorph-inset transition-all duration-300 inline-block focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
              aria-label="Ver pedidos"
            >
              Pedidos
            </Link>
          </li>
        </ul>
      </nav>
      <main className="container mx-auto px-4 py-6 md:py-8 animate-fade-in">
        <div className="bg-karaoke-darkgray p-4 md:p-6 rounded-2xl shadow-neumorph">
          {children}
        </div>
      </main>
      <footer className="bg-karaoke-black py-4 px-4 md:px-6 text-center">
        <p className="text-primary-light text-sm md:text-base">© 2025 Karibu Karaoke - Panel de Staff</p>
      </footer>
    </div>
  );
};

export default StaffLayout;