import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../layouts/AdminLayout';

const AdminPanel = () => {
  const navigate = useNavigate();
  
  // Verificar si hay un usuario y token en localStorage
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const token = localStorage.getItem('token');
  
  useEffect(() => {
    // Si no hay usuario o token, o el rol no es admin, redirigir al login
    if (!user || !token || user.rol !== 'admin') {
      navigate('/admin/login');
    }
  }, [user, token, navigate]);

  // Si no hay usuario, mostramos un loader mientras se completa la redirección
  if (!user || !token || user.rol !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-karaoke-black">
        <div className="bg-karaoke-darkgray p-6 rounded-xl shadow-neumorph">
          <p className="text-primary text-xl">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6 md:space-y-8 animate-fade-in">
        <div className="bg-karaoke-gray p-5 md:p-6 rounded-xl shadow-neumorph-inset">
          <h2 className="text-xl md:text-2xl font-bold mb-3 md:mb-4 text-primary">Panel de Administración</h2>
          <p className="text-white">Bienvenido, {user.nombre}. Administra todos los aspectos del negocio desde aquí.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
          <div className="bg-karaoke-navy p-5 rounded-xl shadow-neumorph hover:shadow-neumorph-inset transition-all duration-300 cursor-pointer group">
            <h3 className="text-lg md:text-xl font-bold mb-2 text-primary-light group-hover:text-primary">Usuarios</h3>
            <p className="text-white text-sm md:text-base mb-4">Administra usuarios y permisos.</p>
            <div className="bg-karaoke-navyLight p-3 rounded-lg text-center shadow-neumorph-inset">
              <span className="font-bold text-xl text-primary">24</span>
              <p className="text-sm text-white">Usuarios activos</p>
            </div>
          </div>
          
          <div className="bg-karaoke-darkgray p-5 rounded-xl shadow-neumorph hover:shadow-neumorph-inset transition-all duration-300 cursor-pointer group">
            <h3 className="text-lg md:text-xl font-bold mb-2 text-primary-light group-hover:text-primary">Mesas</h3>
            <p className="text-white text-sm md:text-base mb-4">Configura y administra las mesas.</p>
            <div className="bg-karaoke-gray p-3 rounded-lg text-center shadow-neumorph-inset">
              <span className="font-bold text-xl text-primary">15</span>
              <p className="text-sm text-white">Mesas totales</p>
            </div>
          </div>
          
          <div className="bg-karaoke-navy p-5 rounded-xl shadow-neumorph hover:shadow-neumorph-inset transition-all duration-300 cursor-pointer group">
            <h3 className="text-lg md:text-xl font-bold mb-2 text-primary-light group-hover:text-primary">Productos</h3>
            <p className="text-white text-sm md:text-base mb-4">Gestiona inventario y precios.</p>
            <div className="bg-karaoke-navyLight p-3 rounded-lg text-center shadow-neumorph-inset">
              <span className="font-bold text-xl text-primary">42</span>
              <p className="text-sm text-white">Productos en stock</p>
            </div>
          </div>
          
          <div className="bg-karaoke-darkgray p-5 rounded-xl shadow-neumorph hover:shadow-neumorph-inset transition-all duration-300 cursor-pointer group">
            <h3 className="text-lg md:text-xl font-bold mb-2 text-primary-light group-hover:text-primary">Canciones</h3>
            <p className="text-white text-sm md:text-base mb-4">Actualiza el catálogo musical.</p>
            <div className="bg-karaoke-gray p-3 rounded-lg text-center shadow-neumorph-inset">
              <span className="font-bold text-xl text-primary">230</span>
              <p className="text-sm text-white">Canciones disponibles</p>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-karaoke-gray p-5 md:p-6 rounded-xl shadow-neumorph">
            <h3 className="text-lg md:text-xl font-bold mb-4 text-primary">Resumen de Ventas</h3>
            <div className="space-y-4">
              <div className="bg-karaoke-darkgray p-4 rounded-lg shadow-neumorph-inset">
                <div className="flex justify-between items-center">
                  <span className="text-white">Hoy</span>
                  <span className="text-primary font-bold">S/ 1,250.00</span>
                </div>
              </div>
              <div className="bg-karaoke-darkgray p-4 rounded-lg shadow-neumorph-inset">
                <div className="flex justify-between items-center">
                  <span className="text-white">Esta semana</span>
                  <span className="text-primary font-bold">S/ 8,745.00</span>
                </div>
              </div>
              <div className="bg-karaoke-darkgray p-4 rounded-lg shadow-neumorph-inset">
                <div className="flex justify-between items-center">
                  <span className="text-white">Este mes</span>
                  <span className="text-primary font-bold">S/ 32,150.00</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-karaoke-gray p-5 md:p-6 rounded-xl shadow-neumorph">
            <h3 className="text-lg md:text-xl font-bold mb-4 text-primary">Eventos Recientes</h3>
            <div className="space-y-4">
              <div className="border-l-4 border-primary pl-4 py-2 bg-karaoke-darkgray rounded-r-lg shadow-neumorph-inset">
                <p className="font-medium text-white">Nuevo usuario registrado</p>
                <p className="text-sm text-gray-400">Hace 35 minutos</p>
              </div>
              <div className="border-l-4 border-green-500 pl-4 py-2 bg-karaoke-darkgray rounded-r-lg shadow-neumorph-inset">
                <p className="font-medium text-white">Cierre de caja completado</p>
                <p className="text-sm text-gray-400">Hoy, 6:00 AM</p>
              </div>
              <div className="border-l-4 border-blue-500 pl-4 py-2 bg-karaoke-darkgray rounded-r-lg shadow-neumorph-inset">
                <p className="font-medium text-white">5 canciones nuevas añadidas</p>
                <p className="text-sm text-gray-400">Ayer, 2:15 PM</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminPanel;