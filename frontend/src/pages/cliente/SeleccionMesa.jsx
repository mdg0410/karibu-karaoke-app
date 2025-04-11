import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import HomeLayout from '../../layouts/HomeLayout';

const SeleccionMesa = () => {
  const [mesaId, setMesaId] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const params = useParams();

  useEffect(() => {
    // Si hay un ID de mesa en los parámetros de la URL, lo usamos
    if (params.id) {
      setMesaId(params.id);
      // Aquí normalmente validaríamos la mesa con una llamada a la API
      // Por ahora, simplemente pasamos al siguiente paso
    }
  }, [params.id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!mesaId.trim()) {
      setError('Por favor, ingresa el número de mesa');
      return;
    }
    
    // Aquí iría la validación con la API para verificar la disponibilidad de la mesa
    // Por ahora, simularemos que la mesa está disponible
    
    // Guardamos el ID de la mesa en localStorage
    localStorage.setItem('mesaId', mesaId);
    
    // Redirigimos al formulario de registro
    navigate('/registro');
  };

  return (
    <HomeLayout>
      <div className="max-w-md mx-auto bg-karaoke-gray p-5 md:p-6 rounded-xl shadow-neumorph animate-fade-in">
        <h2 className="text-xl md:text-2xl font-bold mb-6 text-center text-primary">Selección de Mesa</h2>
        
        {params.id ? (
          <div className="text-center mb-6 animate-fade-in">
            <p className="mb-4 bg-karaoke-darkgray p-3 rounded-lg shadow-neumorph-inset text-primary">
              Mesa seleccionada: <span className="font-bold">{params.id}</span>
            </p>
            <button 
              onClick={handleSubmit}
              className="w-full px-4 py-3 bg-karaoke-darkgray text-primary font-semibold rounded-lg shadow-neumorph hover:shadow-neumorph-inset transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
              aria-label="Continuar con la mesa seleccionada"
            >
              Continuar
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
                className="w-full px-4 py-2 bg-karaoke-darkgray text-white rounded-lg shadow-neumorph-inset focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
                placeholder="Ej. M001"
                aria-label="Ingresa el número de mesa"
              />
              {error && <p className="mt-2 text-red-400 text-sm">{error}</p>}
            </div>
            
            <button 
              type="submit"
              className="w-full px-4 py-3 bg-karaoke-darkgray text-primary font-semibold rounded-lg shadow-neumorph hover:shadow-neumorph-inset transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
              aria-label="Validar y continuar con la mesa seleccionada"
            >
              Validar Mesa
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