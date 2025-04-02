import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function OptionCard({ title, description, buttonText, path, onApiResponse }) {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const handleClick = async (e) => {
    e.preventDefault(); // Prevenir comportamiento por defecto
    console.log(`Navegando a ${path}`);
    
    try {
      switch (path) {
        case '/client':
          navigate('/mesa-selection', { replace: false });
          break;

        case '/admin':
          navigate('/admin-login', { replace: false });
          break;

        case '/staff':
          navigate('/staff-login', { replace: false });
          break;

        default:
          throw new Error('Ruta no válida');
      }
    } catch (error) {
      onApiResponse({
        message: `Error en la navegación: ${error.message}`,
        type: 'error'
      });
    }
  };

  return (
    <div className="bg-dark-card border-3 border-white rounded-none p-6 sm:p-8 md:p-10 text-center flex flex-col h-full shadow-brutal-lg relative overflow-hidden transition-transform hover:translate-y-[-5px] hover:border-primary
      before:content-[''] before:absolute before:w-[100px] before:h-[100px] before:bg-primary before:top-[-50px] before:right-[-50px] before:rotate-45 before:opacity-20 before:transition-transform
      hover:before:scale-150 hover:before:opacity-10">
      <h2 className="text-3xl sm:text-4xl mb-4 sm:mb-6 text-white font-extrabold uppercase -tracking-tight relative inline-block self-center
        after:content-[''] after:absolute after:h-2 after:w-full after:bg-secondary after:bottom-0 after:left-0 after:-z-10 after:translate-y-0.5">
        {title}
      </h2>
      <p className="flex-grow mb-6 sm:mb-8 text-white/70 text-base sm:text-lg relative">
        {description}
      </p>
      <button 
        onClick={handleClick} 
        type="button" // Especificar tipo de botón
        className="bg-white text-dark border-3 border-white px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base rounded-none font-bold uppercase shadow-brutal self-center w-full sm:w-auto sm:min-w-[200px]
        hover:bg-dark hover:text-white hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[3px_3px_0_rgba(0,0,0,0.5)]">
        {buttonText}
      </button>
    </div>
  );
}

export default OptionCard;
