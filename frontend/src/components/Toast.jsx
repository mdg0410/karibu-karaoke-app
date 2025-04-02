import React, { useEffect } from 'react';

const Toast = ({ message, type = 'success', onClose, duration = 5000 }) => {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [message, onClose, duration]);

  if (!message) return null;

  const bgColor = type === 'success' ? 'bg-green-500' : 'bg-red-500';

  return (
    <div className={`fixed bottom-5 sm:right-5 ${bgColor} text-white px-4 sm:px-6 py-3 sm:py-4 rounded-none shadow-brutal z-50 flex items-center animate-slideInUp max-w-full sm:max-w-xs md:max-w-md mx-4 sm:mx-0`}>
      <span className="mr-3 font-mono text-sm sm:text-base line-clamp-2">{message}</span>
      <button 
        onClick={onClose} 
        className="ml-auto text-white hover:text-gray-200 shrink-0"
        aria-label="Cerrar"
      >
        ✕
      </button>
    </div>
  );
};

export default Toast;
