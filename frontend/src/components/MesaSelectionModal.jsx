import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';

// Custom hook para manejar la selección de mesa
const useMesaSelection = (onMesaSelected) => {
  const { verificarMesa } = useAuth();
  const [mesaId, setMesaId] = React.useState('');
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!mesaId.trim()) {
      setError('Por favor, ingresa un número de mesa');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await verificarMesa(mesaId);
      
      if (response.success && response.disponible) {
        onMesaSelected(mesaId);
      } else {
        setError(response.message || 'Mesa no disponible');
      }
    } catch (error) {
      console.error('Error al verificar mesa:', error);
      setError('Error al verificar la mesa. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setMesaId(e.target.value);
    setError(''); // Limpiar error al modificar el campo
  };

  return {
    mesaId,
    error,
    loading,
    handleSubmit,
    handleChange
  };
};

const MesaSelectionModal = ({ isOpen, onClose, onMesaSelected }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const {
    mesaId,
    error,
    loading,
    handleSubmit,
    handleChange
  } = useMesaSelection(onMesaSelected);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-dark-secondary rounded-lg shadow-xl max-w-md w-full p-6">
        <h2 className="text-2xl font-bold mb-4 text-center text-white">
          Selección de Mesa
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="mesaId" className="block text-sm font-medium text-gray-300 mb-1">
              Número de Mesa
            </label>
            <input
              type="text"
              id="mesaId"
              value={mesaId}
              onChange={handleChange}
              className="w-full p-3 bg-dark border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Ingresa el número de mesa"
              disabled={loading}
            />
          </div>
          
          {error && (
            <div className="bg-red-900/40 border border-red-800 text-red-300 p-3 rounded">
              {error}
            </div>
          )}
          
          <div className="flex justify-between pt-2 space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 px-4 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 py-2 px-4 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors flex items-center justify-center"
              disabled={loading}
            >
              {loading && <span className="animate-spin mr-2">⟳</span>}
              Continuar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MesaSelectionModal; 