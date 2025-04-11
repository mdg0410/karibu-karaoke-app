import React from 'react';

/**
 * Botón principal con estilo neumórfico
 */
const Button = ({ 
  children, 
  type = 'button', 
  variant = 'primary', 
  size = 'md', 
  isFullWidth = false,
  isDisabled = false,
  onClick,
  className = '',
  ariaLabel
}) => {
  // Configuración de tamaños
  const sizeClasses = {
    sm: 'px-3 py-1 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg'
  };

  // Configuración de variantes
  const variantClasses = {
    primary: 'bg-karaoke-darkgray text-primary hover:shadow-neumorph-inset',
    secondary: 'bg-karaoke-navy text-white hover:text-primary-light hover:shadow-neumorph-inset',
    danger: 'bg-red-800 text-white hover:shadow-neumorph-inset',
    success: 'bg-green-800 text-white hover:shadow-neumorph-inset',
    ghost: 'bg-transparent text-primary hover:bg-karaoke-darkgray hover:shadow-neumorph-inset'
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      className={`
        ${sizeClasses[size]} 
        ${variantClasses[variant]} 
        ${isFullWidth ? 'w-full' : ''} 
        rounded-lg font-medium shadow-neumorph 
        transition-all duration-300 
        focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50
        ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer transform hover:scale-[1.02]'}
        ${className}
      `}
      aria-label={ariaLabel || children}
    >
      {children}
    </button>
  );
};

export default Button;