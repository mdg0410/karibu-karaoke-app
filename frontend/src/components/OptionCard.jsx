import React from 'react';
import { useNavigate } from 'react-router-dom';
import { postApi } from '../services/api';
import { useAuth } from '../context/AuthContext';

function OptionCard({ title, description, buttonText, path, onApiResponse }) {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const handleClick = async () => {
    console.log(`Navegando a ${path}`);
    
    try {
      let userRole = '';
      let userData = {};
      
      // Determinar el tipo de usuario según la ruta
      if (path === '/client') {
        userRole = 'cliente';
        userData = {
          nombre: 'Cliente de Prueba',
          email: `cliente_${Date.now()}@example.com`
        };
      } else if (path === '/admin') {
        userRole = 'admin';
        userData = {
          nombre: 'Admin de Prueba',
          email: `admin_${Date.now()}@example.com`,
          password: 'admin123'
        };
      } else if (path === '/staff') {
        userRole = 'staff';
        userData = {
          nombre: 'Staff de Prueba',
          email: `staff_${Date.now()}@example.com`,
          password: 'staff123'
        };
      }
      
      // Crear usuario si es necesario
      const response = await postApi(userRole, userData);
      
      if (response.success || response.data) {
        // Iniciar sesión con el usuario creado
        const result = await login(userData.email, userRole);
        
        if (result.success) {
          // Mostrar mensaje de éxito
          onApiResponse({
            message: `¡Integración exitosa! ${title} creado y autenticado`,
            type: 'success'
          });
          
          // Navegar a la ruta correspondiente
          navigate(path);
        } else {
          throw new Error(result.message);
        }
      } else {
        throw new Error('Error al crear usuario');
      }
    } catch (error) {
      // Mostrar mensaje de error
      onApiResponse({
        message: `Error en la integración: ${error.message}`,
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
        className="bg-white text-dark border-3 border-white px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base rounded-none font-bold uppercase shadow-brutal self-center w-full sm:w-auto sm:min-w-[200px]
        hover:bg-dark hover:text-white hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[3px_3px_0_rgba(0,0,0,0.5)]">
        {buttonText}
      </button>
    </div>
  );
}

export default OptionCard;
