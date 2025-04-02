import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';

const ClienteInfoModal = ({ isOpen, onClose, onSubmitSuccess, mesaId }) => {
  const { t } = useTranslation();
  const { registrarCliente } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validación básica
    if (!formData.nombre.trim() || !formData.email.trim() || !formData.telefono.trim()) {
      setError('Todos los campos son obligatorios');
      return;
    }

    // Validación de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Correo electrónico inválido');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Usar la función del contexto para registrar el cliente
      const response = await registrarCliente(formData, mesaId);
      
      if (response.success) {
        // La respuesta ahora contiene los datos directamente como los devuelve el backend
        onSubmitSuccess({
          cliente: response.data || response.cliente,
          token: response.token
        });
      } else {
        setError(response.message || 'Error al registrar cliente');
      }
    } catch (error) {
      console.error('Error al registrar cliente:', error);
      setError('Error al registrar cliente. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-dark-secondary rounded-lg shadow-xl max-w-md w-full p-6">
        <h2 className="text-2xl font-bold mb-4 text-center text-white">
          Información Personal
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="nombre" className="block text-sm font-medium text-gray-300 mb-1">
              Nombre
            </label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              className="w-full p-3 bg-dark border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Ingresa tu nombre"
              disabled={loading}
            />
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 bg-dark border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Ingresa tu correo electrónico"
              disabled={loading}
            />
          </div>
          
          <div>
            <label htmlFor="telefono" className="block text-sm font-medium text-gray-300 mb-1">
              Teléfono
            </label>
            <input
              type="tel"
              id="telefono"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              className="w-full p-3 bg-dark border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Ingresa tu número de teléfono"
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
              {loading ? (
                <span className="animate-spin mr-2">⟳</span>
              ) : null}
              Registrar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClienteInfoModal; 