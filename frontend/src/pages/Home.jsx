import React from 'react';
import { useNavigate } from 'react-router-dom';
import HomeLayout from '../layouts/HomeLayout';

const Home = () => {
  const navigate = useNavigate();

  const handleComenzar = () => {
    navigate('/mesa/seleccion');
  };

  return (
    <HomeLayout>
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <h2 className="text-2xl md:text-4xl font-bold mb-6 md:mb-8 text-primary animate-fade-in">
          ¡Bienvenido a Karibu Karaoke!
        </h2>
        
        <div className="max-w-2xl mb-8 md:mb-12 bg-karaoke-gray p-4 md:p-8 rounded-xl shadow-neumorph animate-fade-in">
          <h3 className="text-xl md:text-2xl font-semibold mb-4 text-primary-light">Guía Rápida</h3>
          <ol className="text-left list-decimal ml-4 md:ml-6 space-y-2 text-sm md:text-base">
            <li className="text-white">Selecciona tu mesa o escanea el código QR de tu mesa</li>
            <li className="text-white">Registra tus datos personales</li>
            <li className="text-white">Explora nuestro catálogo de canciones</li>
            <li className="text-white">Realiza tus pedidos de alimentos y bebidas</li>
            <li className="text-white">¡Disfruta de tu experiencia en Karibu Karaoke!</li>
          </ol>
        </div>
        
        <button 
          onClick={handleComenzar}
          className="px-6 md:px-8 py-3 bg-karaoke-gray text-primary font-bold rounded-xl shadow-neumorph hover:shadow-neumorph-inset transition-all duration-300 transform hover:scale-[1.02] text-base md:text-xl focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
          aria-label="Comenzar experiencia de karaoke"
        >
          Comenzar
        </button>
      </div>
    </HomeLayout>
  );
};

export default Home;