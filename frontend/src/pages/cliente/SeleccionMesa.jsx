import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import HomeLayout from '../../layouts/HomeLayout';
import useMesa from '../../hooks/useMesa';
import useAuth from '../../hooks/useAuth';
import Alert from '../../components/common/Alert';
import Loader from '../../components/common/Loader';

const SeleccionMesa = () => {
  const [mesaInput, setMesaInput] = useState('');
  const [error, setError] = useState('');
  const [validando, setValidando] = useState(false);
  const navigate = useNavigate();
  const { mesaId: mesaIdParam } = useParams();
  const { validarMesaDisponible, seleccionarMesa, loading, error: mesaError, limpiarError } = useMesa();
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    if (!isAuthenticated || !user) {
      navigate('/registro');
      return;
    }

    // Limpiar errores al montar el componente
    limpiarError();
    
    // Si hay un error en el estado de Redux, mostrarlo
    if (mesaError) {
      setError(mesaError);
    }

    // Si hay un ID de mesa en los parámetros, intentar validarla automáticamente
    if (mesaIdParam && !validando) {
      setMesaInput(mesaIdParam);
      handleValidarMesa(mesaIdParam);
    }
  }, [isAuthenticated, user, navigate, limpiarError, mesaError, mesaIdParam]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!mesaInput.trim()) {
      setError('Por favor, ingresa el número o ID de mesa');
      return;
    }
    
    handleValidarMesa(mesaInput);
  };

  const handleValidarMesa = async (mesaIdentificador) => {
    setError('');
    setValidando(true);
    
    try {
      const resultado = await validarMesaDisponible(mesaIdentificador);
      
      if (resultado && resultado.disponible) {
        await seleccionarMesa(resultado.mesa.id);
        navigate('/cliente/panel');
      } else {
        setError('Esta mesa no está disponible. Por favor, selecciona otra.');
        setValidando(false);
        // Solo limpiamos el input si no venía de la URL
        if (!mesaIdParam) {
          setMesaInput('');
        }
      }
    } catch (err) {
      console.error("Error al validar mesa:", err);
      setError(err.message || 'No se pudo validar la mesa. Intenta con otra mesa.');
      setValidando(false);
      // Solo limpiamos el input si no venía de la URL
      if (!mesaIdParam) {
        setMesaInput('');
      }
    }
  };

  return (
    <HomeLayout>
      <div className="max-w-md mx-auto bg-karaoke-gray p-5 md:p-6 rounded-xl shadow-neumorph animate-fade-in">
        <h2 className="text-xl md:text-2xl font-bold mb-6 text-center text-primary">
          {validando ? 'Validando Mesa' : 'Selección de Mesa'}
        </h2>
        
        {(loading || validando) && (
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
        
        {mesaIdParam ? (
          <>
            <div className="text-center mb-6 animate-fade-in">
              <p className="mb-4 bg-karaoke-darkgray p-3 rounded-lg shadow-neumorph-inset text-primary">
                Validando mesa: <span className="font-bold">{mesaIdParam}</span>
              </p>
              {error && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-primary-light mb-3">
                    Seleccionar otra mesa
                  </h3>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label htmlFor="mesaInput" className="block mb-2 font-medium text-primary-light">
                        Número de Mesa
                      </label>
                      <input
                        type="text"
                        id="mesaInput"
                        value={mesaInput}
                        onChange={(e) => setMesaInput(e.target.value)}
                        disabled={loading || validando}
                        className="w-full px-4 py-2 bg-karaoke-darkgray text-white rounded-lg shadow-neumorph-inset focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 disabled:opacity-50"
                        placeholder="Ej. 3 o M001"
                      />
                    </div>
                    <button 
                      type="submit"
                      disabled={loading || validando}
                      className="w-full px-4 py-3 bg-karaoke-darkgray text-primary font-semibold rounded-lg shadow-neumorph hover:shadow-neumorph-inset transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 disabled:opacity-50"
                    >
                      {loading || validando ? 'Validando...' : 'Validar Mesa'}
                    </button>
                  </form>
                </div>
              )}
            </div>
          </>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="mesaInput" className="block mb-2 font-medium text-primary-light">
                Número de Mesa
              </label>
              <input
                type="text"
                id="mesaInput"
                value={mesaInput}
                onChange={(e) => setMesaInput(e.target.value)}
                disabled={loading || validando}
                className="w-full px-4 py-2 bg-karaoke-darkgray text-white rounded-lg shadow-neumorph-inset focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 disabled:opacity-50"
                placeholder="Ej. 3 o M001"
              />
            </div>
            <button 
              type="submit"
              disabled={loading || validando}
              className="w-full px-4 py-3 bg-karaoke-darkgray text-primary font-semibold rounded-lg shadow-neumorph hover:shadow-neumorph-inset transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 disabled:opacity-50"
            >
              {loading || validando ? 'Validando...' : 'Validar Mesa'}
            </button>
          </form>
        )}
        
        <div className="mt-6 text-center">
          <p className="mb-2 text-primary-light">¿Tienes un código QR?</p>
          <p className="text-white text-sm md:text-base">Escanéalo con la cámara de tu dispositivo para seleccionar automáticamente tu mesa.</p>
        </div>
      </div>
    </HomeLayout>
  );
};

export default SeleccionMesa;