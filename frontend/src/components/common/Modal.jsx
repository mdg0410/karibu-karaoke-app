import React, { useEffect } from 'react';
import Button from './Button';

/**
 * Componente Modal con estilo neumórfico
 */
const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'md',
  closeOnEsc = true,
  closeOnOverlayClick = true,
  showCloseButton = true,
  className = ''
}) => {
  // Configuración de tamaños
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-full mx-4'
  };

  // Efecto para bloquear el scroll del body cuando el modal está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Limpiar al desmontar
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Handler para la tecla Escape
  useEffect(() => {
    const handleEsc = (event) => {
      if (closeOnEsc && isOpen && event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [closeOnEsc, isOpen, onClose]);

  if (!isOpen) return null;

  // Handler para clicks en el overlay
  const handleOverlayClick = (e) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 animate-fade-in overflow-y-auto p-4"
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className={`w-full ${sizeClasses[size]} bg-karaoke-darkgray rounded-xl shadow-neumorph-lg transform transition-all ${className}`}
      >
        {/* Encabezado del modal */}
        <div className="flex justify-between items-center p-4 md:p-6 border-b border-karaoke-gray">
          <h3 id="modal-title" className="text-lg md:text-xl font-bold text-primary">
            {title}
          </h3>
          {showCloseButton && (
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-primary transition-colors rounded-full p-1 focus:outline-none focus:ring-2 focus:ring-primary"
              aria-label="Cerrar modal"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Contenido del modal */}
        <div className="p-4 md:p-6 overflow-y-auto max-h-[calc(100vh-200px)]">
          {children}
        </div>

        {/* Pie del modal (opcional) */}
        {footer && (
          <div className="p-4 md:p-6 border-t border-karaoke-gray">
            {footer}
          </div>
        )}

        {/* Si no hay pie personalizado, mostrar botón de cerrar por defecto */}
        {!footer && (
          <div className="p-4 md:p-6 border-t border-karaoke-gray flex justify-end">
            <Button onClick={onClose} size="md" variant="primary">
              Cerrar
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;