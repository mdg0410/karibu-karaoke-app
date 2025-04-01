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
    <div className={`fixed bottom-5 right-5 ${bgColor} text-white px-6 py-4 rounded-none shadow-brutal z-50 flex items-center animate-slideInUp`}>
      <span className="mr-3 font-mono">{message}</span>
      <button 
        onClick={onClose} 
        className="ml-auto text-white hover:text-gray-200"
      >
        ✕
      </button>
    </div>
  );
};

export default Toast;
