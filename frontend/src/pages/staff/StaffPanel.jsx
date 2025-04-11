import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StaffLayout from '../../layouts/StaffLayout';

const StaffPanel = () => {
  const navigate = useNavigate();
  
  // Verificar si hay un usuario y token en localStorage
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const token = localStorage.getItem('token');
  
  useEffect(() => {
    // Si no hay usuario o token, o el rol no es trabajador, redirigir al login
    if (!user || !token || user.rol !== 'trabajador') {
      navigate('/staff/login');
    }
  }, [user, token, navigate]);

  // Si no hay usuario, mostramos un loader mientras se completa la redirección
  if (!user || !token || user.rol !== 'trabajador') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-karaoke-black">
        <div className="bg-karaoke-darkgray p-6 rounded-xl shadow-neumorph">
          <p className="text-primary text-xl">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <StaffLayout>
      <div className="space-y-6 md:space-y-8 animate-fade-in">
        <div className="bg-karaoke-gray p-5 md:p-6 rounded-xl shadow-neumorph-inset">
          <h2 className="text-xl md:text-2xl font-bold mb-3 md:mb-4 text-primary">Panel de Staff</h2>
          <p className="text-white">Bienvenido, {user.nombre}. Gestiona las mesas y pedidos del local.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          <div className="bg-karaoke-navy p-5 rounded-xl shadow-neumorph hover:shadow-neumorph-inset transition-all duration-300 cursor-pointer group">
            <h3 className="text-lg md:text-xl font-bold mb-2 text-primary-light group-hover:text-primary">Estado de Mesas</h3>
            <p className="text-white text-sm md:text-base mb-4">Visualiza y gestiona las mesas activas.</p>
            <div className="bg-karaoke-navyLight p-3 rounded-lg text-center shadow-neumorph-inset">
              <span className="font-bold text-xl text-primary">12</span>
              <p className="text-sm text-white">Mesas activas</p>
            </div>
          </div>
          
          <div className="bg-karaoke-darkgray p-5 rounded-xl shadow-neumorph hover:shadow-neumorph-inset transition-all duration-300 cursor-pointer group">
            <h3 className="text-lg md:text-xl font-bold mb-2 text-primary-light group-hover:text-primary">Pedidos Pendientes</h3>
            <p className="text-white text-sm md:text-base mb-4">Revisa los pedidos que necesitan atención.</p>
            <div className="bg-karaoke-gray p-3 rounded-lg text-center shadow-neumorph-inset">
              <span className="font-bold text-xl text-primary">5</span>
              <p className="text-sm text-white">Pedidos por entregar</p>
            </div>
          </div>
          
          <div className="bg-karaoke-navy p-5 rounded-xl shadow-neumorph hover:shadow-neumorph-inset transition-all duration-300 cursor-pointer group">
            <h3 className="text-lg md:text-xl font-bold mb-2 text-primary-light group-hover:text-primary">Cola de Karaoke</h3>
            <p className="text-white text-sm md:text-base mb-4">Administra la lista de reproduccción.</p>
            <div className="bg-karaoke-navyLight p-3 rounded-lg text-center shadow-neumorph-inset">
              <span className="font-bold text-xl text-primary">8</span>
              <p className="text-sm text-white">Canciones en cola</p>
            </div>
          </div>
        </div>
        
        <div className="bg-karaoke-gray p-5 md:p-6 rounded-xl shadow-neumorph">
          <h3 className="text-lg md:text-xl font-bold mb-4 text-primary">Actividad Reciente</h3>
          
          <div className="space-y-4">
            <div className="border-l-4 border-primary pl-4 py-2 bg-karaoke-darkgray rounded-r-lg shadow-neumorph-inset">
              <p className="font-medium text-white">Mesa 5 ha solicitado atención</p>
              <p className="text-sm text-gray-400">Hace 2 minutos</p>
            </div>
            
            <div className="border-l-4 border-green-500 pl-4 py-2 bg-karaoke-darkgray rounded-r-lg shadow-neumorph-inset">
              <p className="font-medium text-white">Nuevo pedido en Mesa 3</p>
              <p className="text-sm text-gray-400">Hace 15 minutos</p>
            </div>
            
            <div className="border-l-4 border-blue-500 pl-4 py-2 bg-karaoke-darkgray rounded-r-lg shadow-neumorph-inset">
              <p className="font-medium text-white">Mesa 8 ha añadido una canción</p>
              <p className="text-sm text-gray-400">Hace 20 minutos</p>
            </div>
          </div>
        </div>
      </div>
    </StaffLayout>
  );
};

export default StaffPanel;