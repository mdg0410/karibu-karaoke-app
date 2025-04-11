import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ClienteLayout from '../../layouts/ClienteLayout';

const ClientePanel = () => {
  const navigate = useNavigate();
  
  // Verificar si hay un usuario y mesa en localStorage
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const token = localStorage.getItem('token');
  const mesaId = localStorage.getItem('mesaId');
  
  useEffect(() => {
    // Si no hay usuario, token o mesaId, redirigir a la página de inicio
    if (!user || !token || !mesaId) {
      navigate('/');
    }
  }, [user, token, mesaId, navigate]);

  // Si no hay usuario, mostramos un loader mientras se completa la redirección
  if (!user || !token || !mesaId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-karaoke-black">
        <div className="bg-karaoke-darkgray p-6 rounded-xl shadow-neumorph">
          <p className="text-primary text-xl">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <ClienteLayout>
      <div className="space-y-6 md:space-y-8 animate-fade-in">
        <div className="bg-karaoke-gray p-5 md:p-6 rounded-xl shadow-neumorph-inset">
          <h2 className="text-xl md:text-2xl font-bold mb-3 md:mb-4 text-primary">Bienvenido, {user.nombre}</h2>
          <p className="text-white">¿Qué te gustaría hacer hoy?</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <div className="bg-karaoke-navy p-5 rounded-xl shadow-neumorph hover:shadow-neumorph-inset transition-all duration-300 cursor-pointer group">
            <h3 className="text-lg md:text-xl font-bold mb-2 text-primary-light group-hover:text-primary">Buscar Canciones</h3>
            <p className="text-white text-sm md:text-base">Explora nuestro catálogo y elige tus canciones favoritas.</p>
          </div>
          
          <div className="bg-karaoke-darkgray p-5 rounded-xl shadow-neumorph hover:shadow-neumorph-inset transition-all duration-300 cursor-pointer group">
            <h3 className="text-lg md:text-xl font-bold mb-2 text-primary-light group-hover:text-primary">Ver Pedidos</h3>
            <p className="text-white text-sm md:text-base">Realiza pedidos de comida y bebida desde tu mesa.</p>
          </div>
          
          <div className="bg-karaoke-darkgray p-5 rounded-xl shadow-neumorph hover:shadow-neumorph-inset transition-all duration-300 cursor-pointer group">
            <h3 className="text-lg md:text-xl font-bold mb-2 text-primary-light group-hover:text-primary">Mi Lista de Reproducción</h3>
            <p className="text-white text-sm md:text-base">Revisa el estado de tus canciones en la cola.</p>
          </div>
          
          <div className="bg-karaoke-navy p-5 rounded-xl shadow-neumorph hover:shadow-neumorph-inset transition-all duration-300 cursor-pointer group">
            <h3 className="text-lg md:text-xl font-bold mb-2 text-primary-light group-hover:text-primary">Solicitar Asistencia</h3>
            <p className="text-white text-sm md:text-base">¿Necesitas ayuda? Contacta a nuestro personal.</p>
          </div>
        </div>
      </div>
    </ClienteLayout>
  );
};

export default ClientePanel;