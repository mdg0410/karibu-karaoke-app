import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import HomeLayout from '../../layouts/HomeLayout';
import useMesa from '../../hooks/useMesa';
import Alert from '../../components/common/Alert';
import Loader from '../../components/common/Loader';

const SeleccionMesa = () => {
  const [mesaId, setMesaId] = useState('');
  const [error, setError] = useState('');
  const [validando, setValidando] = useState(false);
  const navigate = useNavigate();
  const params = useParams();
  const { validarMesaDisponible, seleccionarMesa, loading, error: mesaError } = useMesa();

  useEffect(() => {
    // Si hay un error en el estado de Redux, mostrarlo
    if (mesaError) {
      setError(mesaError);
    }
  }, [mesaError]);

  useEffect(() => {
    // Si hay un ID de mesa en los parámetros de la URL, lo validamos automáticamente
    if (params.id && !validando) {
      setMesaId(params.id);
      setValidando(true);
      handleValidarMesa(params.id);
    }
  }, [params.id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!mesaId.trim()) {
      setError('Por favor, ingresa el número de mesa');
      return;
    }
    
    handleValidarMesa(mesaId);
  };

  const handleValidarMesa = async (id) => {
    setError('');
    setValidando(true);
    
    try {
      await validarMesaDisponible(id);
      seleccionarMesa(id);
    } catch (err) {
      setError(err.message || 'No se pudo validar la mesa. Intenta con otra mesa.');
      setValidando(false);
    }
  };

  return (
    <HomeLayout>
      <div className="max-w-md mx-auto bg-karaoke-gray p-5 md:p-6 rounded-xl shadow-neumorph animate-fade-in">
        <h2 className="text-xl md:text-2xl font-bold mb-6 text-center text-primary">Selección de Mesa</h2>
        
        {loading && (
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
        
        {params.id ? (
          <div className="text-center mb-6 animate-fade-in">
            <p className="mb-4 bg-karaoke-darkgray p-3 rounded-lg shadow-neumorph-inset text-primary">
              Mesa seleccionada: <span className="font-bold">{params.id}</span>
            </p>
            <button 
              onClick={handleSubmit}
              disabled={loading}
              className="w-full px-4 py-3 bg-karaoke-darkgray text-primary font-semibold rounded-lg shadow-neumorph hover:shadow-neumorph-inset transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 disabled:opacity-50"
              aria-label="Continuar con la mesa seleccionada"
            >
              {loading ? 'Validando...' : 'Continuar'}
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="mesaId" className="block mb-2 font-medium text-primary-light">
                Número de Mesa
              </label>
              <input
                type="text"
                id="mesaId"
                value={mesaId}
                onChange={(e) => setMesaId(e.target.value)}
                disabled={loading}
                className="w-full px-4 py-2 bg-karaoke-darkgray text-white rounded-lg shadow-neumorph-inset focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 disabled:opacity-50"
                placeholder="Ej. M001"
                aria-label="Ingresa el número de mesa"
              />
            </div>
            
            <button 
              type="submit"
              disabled={loading}
              className="w-full px-4 py-3 bg-karaoke-darkgray text-primary font-semibold rounded-lg shadow-neumorph hover:shadow-neumorph-inset transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 disabled:opacity-50"
              aria-label="Validar y continuar con la mesa seleccionada"
            >
              {loading ? 'Validando...' : 'Validar Mesa'}
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