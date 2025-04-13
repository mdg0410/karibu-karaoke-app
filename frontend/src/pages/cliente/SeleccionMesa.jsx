import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HomeLayout from '../../layouts/HomeLayout';
import useMesa from '../../hooks/useMesa';
import useAuth from '../../hooks/useAuth';
import Alert from '../../components/common/Alert';
import Loader from '../../components/common/Loader';

const SeleccionMesa = () => {
  const [mesaInput, setMesaInput] = useState('');
  const [error, setError] = useState('');
  const [validando, setValidando] = useState(false);
  const [mesaPreseleccionada, setMesaPreseleccionada] = useState(null);
  
  const navigate = useNavigate();
  const { ocuparMesa, loading, error: mesaError, limpiarError } = useMesa();
  const { isAuthenticated, user } = useAuth();

  // Verificar autenticación
  useEffect(() => {
    if (!isAuthenticated || !user) {
      navigate('/registro');
    }
  }, [isAuthenticated, user, navigate]);

  // Obtener el ID de mesa del localStorage al montar el componente
  useEffect(() => {
    const mesaIdGuardada = localStorage.getItem('mesaIdPreseleccionada');
    if (mesaIdGuardada) {
      console.log('Mesa ID obtenida de localStorage:', mesaIdGuardada);
      setMesaPreseleccionada(mesaIdGuardada);
      
      // También podemos intentar obtener la información completa de la mesa
      try {
        const mesaInfoGuardada = JSON.parse(localStorage.getItem('mesaInfoPreseleccionada'));
        if (mesaInfoGuardada) {
          console.log('Información de mesa encontrada en localStorage:', mesaInfoGuardada);
        }
      } catch (err) {
        console.error('Error al analizar información de mesa guardada:', err);
      }
    } else {
      console.log('No se encontró mesaId en localStorage');
    }
  }, []);

  // Validación automática (una sola vez al montar)
  useEffect(() => {
    const validarMesaAutomaticamente = async () => {
      // Solo proceder si hay una mesa preseleccionada y el usuario está autenticado
      if (mesaPreseleccionada && isAuthenticated && user) {
        console.log('Validando mesa automáticamente con ID:', mesaPreseleccionada);
        setValidando(true);
        limpiarError();
        
        try {
          // Llamar directamente a ocuparMesa con el ID que ya tenemos
          await ocuparMesa(mesaPreseleccionada, user.id);
          
          // Limpiar localStorage después de ocupar la mesa exitosamente
          localStorage.removeItem('mesaIdPreseleccionada');
          localStorage.removeItem('mesaInfoPreseleccionada');
          
          // Redirigir al panel del cliente
          navigate('/cliente/panel');
        } catch (err) {
          console.error("Error al ocupar mesa automáticamente:", err);
          setError(err.message || 'Esta mesa no está disponible. Por favor, selecciona otra.');
          setMesaInput('');
          setValidando(false);
          
          // Si hay un error, también limpiar localStorage
          localStorage.removeItem('mesaIdPreseleccionada');
          localStorage.removeItem('mesaInfoPreseleccionada');
        }
      }
    };

    validarMesaAutomaticamente();
  }, [mesaPreseleccionada, isAuthenticated, user, ocuparMesa, navigate, limpiarError]);

  // Manejar errores del estado global
  useEffect(() => {
    if (mesaError) {
      setError(mesaError);
      setValidando(false);
    }
  }, [mesaError]);

  // Función para validar mesa manualmente
  const handleValidarMesa = async (e) => {
    e.preventDefault();
    
    if (!mesaInput.trim()) {
      setError('Por favor, ingresa el número o ID de mesa');
      return;
    }
    
    setValidando(true);
    setError('');
    
    try {
      // Llamar directamente a ocuparMesa con el input del usuario
      await ocuparMesa(mesaInput, user.id);
      // Si no hay error, redirigir al panel
      navigate('/cliente/panel');
    } catch (err) {
      console.error("Error al ocupar mesa:", err);
      setError(err.message || 'Esta mesa no está disponible. Por favor, selecciona otra.');
      setValidando(false);
    }
  };

  // Mostrar pantalla de carga mientras se valida
  if (loading || (validando && mesaPreseleccionada)) {
    return (
      <HomeLayout>
        <div className="flex flex-col justify-center items-center h-[60vh]">
          <Loader text="Validando mesa..." />
          {mesaPreseleccionada && (
            <p className="mt-4 text-center text-white">
              Mesa preseleccionada: <span className="font-bold text-primary">{mesaPreseleccionada}</span>
            </p>
          )}
        </div>
      </HomeLayout>
    );
  }

  return (
    <HomeLayout>
      <div className="max-w-md mx-auto bg-karaoke-gray p-5 md:p-6 rounded-xl shadow-neumorph animate-fade-in">
        <h2 className="text-xl md:text-2xl font-bold mb-6 text-center text-primary">
          {validando ? 'Validando Mesa' : 'Selección de Mesa'}
        </h2>
        
        {validando && (
          <div className="text-center mb-6">
            <Loader text="Validando mesa..." />
          </div>
        )}
        
        {error && (
          <Alert 
            type="error" 
            message={error} 
            className="mb-4"
            onClose={() => setError('')}
          />
        )}
        
        <form onSubmit={handleValidarMesa} className="space-y-4">
          <div>
            <label htmlFor="mesaInput" className="block mb-2 font-medium text-primary-light">
              Número de Mesa
            </label>
            <input
              type="text"
              id="mesaInput"
              value={mesaInput}
              onChange={(e) => setMesaInput(e.target.value)}
              disabled={validando}
              className="w-full px-4 py-2 bg-karaoke-darkgray text-white rounded-lg shadow-neumorph-inset focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 disabled:opacity-50"
              placeholder="Ej. 3 o M001"
            />
          </div>
          <button 
            type="submit"
            disabled={validando}
            className="w-full px-4 py-3 bg-karaoke-darkgray text-primary font-semibold rounded-lg shadow-neumorph hover:shadow-neumorph-inset transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 disabled:opacity-50"
          >
            {validando ? 'Validando...' : 'Validar Mesa'}
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="mb-2 text-primary-light">¿Tienes un código QR?</p>
          <p className="text-white text-sm md:text-base">Escanéalo con la cámara de tu dispositivo para seleccionar automáticamente tu mesa.</p>
        </div>
      </div>
    </HomeLayout>
  );
};

export default SeleccionMesa;