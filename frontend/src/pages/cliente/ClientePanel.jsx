import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ClienteLayout from '../../layouts/ClienteLayout';
import useAuth from '../../hooks/useAuth';
import useMesa from '../../hooks/useMesa';
import Alert from '../../components/common/Alert';
import Loader from '../../components/common/Loader';

const ClientePanel = () => {
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const { mesaId, mesaActual, obtenerMesaPorId, loading: mesaLoading } = useMesa();

  useEffect(() => {
    // Verificar si el usuario está autenticado
    if (!isAuthenticated || !user) {
      navigate('/');
      return;
    }

    // Verificar si hay un ID de mesa
    if (!mesaId) {
      navigate('/mesa/seleccion');
      return;
    }

    // Cargar detalles de la mesa si no están disponibles
    if (mesaId && !mesaActual) {
      obtenerMesaPorId(mesaId).catch(err => {
        setError('No se pudo obtener los detalles de la mesa. Inténtalo nuevamente.');
      });
    }
  }, [isAuthenticated, user, mesaId, mesaActual, navigate]);

  if (authLoading || mesaLoading) {
    return (
      <ClienteLayout>
        <div className="flex justify-center items-center h-[60vh]">
          <Loader text="Cargando tu información..." />
        </div>
      </ClienteLayout>
    );
  }

  return (
    <ClienteLayout>
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-6 bg-karaoke-gray p-5 rounded-xl shadow-neumorph">
          <div className="flex flex-wrap justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-primary">¡Bienvenido, {user?.nombre || 'Cliente'}!</h2>
              <p className="text-primary-light mt-1">
                Mesa: <span className="font-semibold">{mesaActual?.numero || mesaId}</span>
              </p>
            </div>
            
            {mesaActual && (
              <div className="bg-karaoke-darkgray p-3 rounded-lg shadow-neumorph-inset mt-2 sm:mt-0">
                <p className="text-primary text-center">
                  Estado: <span className="font-bold">{mesaActual.estado}</span>
                </p>
              </div>
            )}
          </div>
        </div>

        {error && (
          <Alert 
            type="error" 
            message={error} 
            className="mb-4"
            onClose={() => setError('')}
          />
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-karaoke-gray p-5 rounded-xl shadow-neumorph">
            <h3 className="text-xl font-bold mb-4 text-primary">Información de Usuario</h3>
            <div className="space-y-2">
              <p className="text-white">
                <span className="text-primary-light font-medium">Nombre:</span> {user?.nombre}
              </p>
              <p className="text-white">
                <span className="text-primary-light font-medium">Email:</span> {user?.email}
              </p>
              <p className="text-white">
                <span className="text-primary-light font-medium">Celular:</span> {user?.celular}
              </p>
            </div>
          </div>
          
          <div className="bg-karaoke-gray p-5 rounded-xl shadow-neumorph">
            <h3 className="text-xl font-bold mb-4 text-primary">Información de Mesa</h3>
            {mesaActual ? (
              <div className="space-y-2">
                <p className="text-white">
                  <span className="text-primary-light font-medium">Número:</span> {mesaActual.numero}
                </p>
                <p className="text-white">
                  <span className="text-primary-light font-medium">Estado:</span> {mesaActual.estado}
                </p>
                <p className="text-white">
                  <span className="text-primary-light font-medium">Capacidad:</span> {mesaActual.capacidad} personas
                </p>
              </div>
            ) : (
              <p className="text-white italic">Cargando información...</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <button className="bg-karaoke-gray p-5 rounded-xl shadow-neumorph hover:shadow-neumorph-inset transition-all duration-300 text-center">
            <h3 className="text-lg font-bold mb-2 text-primary">Catálogo de Canciones</h3>
            <p className="text-white text-sm">Explora nuestro catálogo y añade canciones a tu lista</p>
          </button>
          
          <button className="bg-karaoke-gray p-5 rounded-xl shadow-neumorph hover:shadow-neumorph-inset transition-all duration-300 text-center">
            <h3 className="text-lg font-bold mb-2 text-primary">Menú de Productos</h3>
            <p className="text-white text-sm">Bebidas, comidas y más para disfrutar durante tu experiencia</p>
          </button>
          
          <button className="bg-karaoke-gray p-5 rounded-xl shadow-neumorph hover:shadow-neumorph-inset transition-all duration-300 text-center">
            <h3 className="text-lg font-bold mb-2 text-primary">Mi Lista de Canciones</h3>
            <p className="text-white text-sm">Revisa y gestiona tu lista de canciones seleccionadas</p>
          </button>
        </div>
      </div>
    </ClienteLayout>
  );
};

export default ClientePanel;