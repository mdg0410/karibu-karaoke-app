import React from 'react';

/**
 * Componente de carga para mostrar durante operaciones asíncronas
 * 
 * @param {Object} props - Propiedades del componente
 * @param {string} props.text - Texto a mostrar junto al spinner
 * @param {string} props.size - Tamaño del spinner ('sm', 'md', 'lg')
 * @param {string} props.className - Clases adicionales
 * @returns {JSX.Element} Componente de carga
 */
const Loader = ({ text = 'Cargando...', size = 'md', className = '' }) => {
  // Tamaños del spinner
  const spinnerSizes = {
    sm: 'w-5 h-5',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  // Tamaños del texto
  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className={`animate-spin rounded-full border-4 border-karaoke-darkgray border-t-primary ${spinnerSizes[size]}`}></div>
      {text && (
        <p className={`mt-2 text-primary-light ${textSizes[size]}`}>
          {text}
        </p>
      )}
    </div>
  );
};

export default Loader;