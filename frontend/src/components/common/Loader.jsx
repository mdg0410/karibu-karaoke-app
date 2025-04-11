import React from 'react';

/**
 * Componente de carga con estilo neumórfico
 */
const Loader = ({
  size = 'md',
  color = 'primary', // primary, white
  fullScreen = false,
  text = 'Cargando...',
  className = ''
}) => {
  // Configuración de tamaños
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  // Configuración de colores
  const colorClasses = {
    primary: 'text-primary',
    white: 'text-white'
  };

  const spinner = (
    <div className={`inline-block ${sizeClasses[size]}`}>
      <svg
        className={`animate-spin ${colorClasses[color]}`}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-karaoke-black bg-opacity-80">
        {spinner}
        {text && <p className={`mt-4 ${colorClasses[color]}`}>{text}</p>}
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      {spinner}
      {text && <p className={`mt-2 ${colorClasses[color]}`}>{text}</p>}
    </div>
  );
};

export default Loader;