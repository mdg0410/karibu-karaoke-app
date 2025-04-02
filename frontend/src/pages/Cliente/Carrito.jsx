import React from 'react';

const Carrito = ({ visible, onClose }) => {
  if (!visible) return null;
  
  return (
    <>
      {/* Overlay para cerrar el carrito en dispositivos móviles */}
      <div 
        className="fixed inset-0 bg-black/50 z-40 md:hidden"
        onClick={onClose}
      ></div>
      
      <div className="fixed inset-y-0 right-0 w-[85%] sm:w-80 bg-dark-card border-l border-white/20 shadow-lg z-50 animate-slideInUp">
        <div className="p-4 border-b border-white/10 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">Carrito</h2>
          <button 
            onClick={onClose}
            className="text-white/70 hover:text-white"
          >
            ✕
          </button>
        </div>
        
        <div className="p-4 overflow-y-auto max-h-[calc(100vh-136px)]">
          <p className="text-white/50 text-center py-8">El carrito está vacío</p>
        </div>
        
        <div className="border-t border-white/10 p-4 absolute bottom-0 left-0 right-0 bg-dark-card">
          <div className="flex justify-between mb-4">
            <span className="text-white/70">Total:</span>
            <span className="text-white font-bold">$0.00</span>
          </div>
          <button className="w-full bg-primary text-white py-2 px-4 font-bold disabled:opacity-50 disabled:cursor-not-allowed">
            Realizar Pedido
          </button>
        </div>
      </div>
    </>
  );
};

export default Carrito;
