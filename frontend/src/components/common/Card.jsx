import React from 'react';

/**
 * Card personalizada con estilo neumórfico
 */
const Card = ({
  children,
  title,
  variant = 'primary', // primary, secondary, inset, gold
  className = '',
  titleClassName = '',
  contentClassName = ''
}) => {
  // Configuración de variantes
  const variantClasses = {
    primary: 'bg-karaoke-darkgray shadow-neumorph',
    secondary: 'bg-karaoke-navy shadow-neumorph',
    inset: 'bg-karaoke-gray shadow-neumorph-inset',
    gold: 'bg-karaoke-darkgray shadow-neumorph-gold'
  };

  return (
    <div className={`rounded-xl p-5 ${variantClasses[variant]} ${className}`}>
      {title && (
        <h3 className={`text-lg md:text-xl font-bold mb-4 text-primary ${titleClassName}`}>
          {title}
        </h3>
      )}
      <div className={contentClassName}>
        {children}
      </div>
    </div>
  );
};

export default Card;