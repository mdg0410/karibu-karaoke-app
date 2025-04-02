import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';

// Custom hook para manejar el formulario
const useClienteForm = (mesaId, onSubmitSuccess) => {
  const { registrarCliente } = useAuth();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [formData, setFormData] = React.useState({
    nombre: '',
    email: '',
    telefono: ''
  });

  const validateForm = () => {
    if (!formData.nombre.trim() || !formData.email.trim() || !formData.telefono.trim()) {
      setError('Todos los campos son obligatorios');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Correo electrónico inválido');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setError('');

    try {
      const response = await registrarCliente(formData, mesaId);
      
      if (response.success) {
        const clienteData = response.data || response.cliente;
        onSubmitSuccess({
          cliente: {
            id: clienteData.id,
            nombre: clienteData.nombre || formData.nombre,
            email: clienteData.email || formData.email,
            telefono: clienteData.telefono || formData.telefono
          },
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(''); // Limpiar error al modificar campos
  };

  return {
    formData,
    loading,
    error,
    handleChange,
    handleSubmit
  };
};

const FormInput = ({ id, label, type = 'text', ...props }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-300 mb-1">
      {label}
    </label>
    <input
      type={type}
      id={id}
      className="w-full p-3 bg-dark border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary"
      {...props}
    />
  </div>
);

const ClienteInfoModal = ({ isOpen, onClose, onSubmitSuccess, mesaId }) => {
  const { t } = useTranslation();
  const {
    formData,
    loading,
    error,
    handleChange,
    handleSubmit
  } = useClienteForm(mesaId, onSubmitSuccess);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-dark-secondary rounded-lg shadow-xl max-w-md w-full p-6">
        <h2 className="text-2xl font-bold mb-4 text-center text-white">
          Información Personal
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormInput
            id="nombre"
            name="nombre"
            label="Nombre"
            value={formData.nombre}
            onChange={handleChange}
            placeholder="Ingresa tu nombre"
            disabled={loading}
          />
          
          <FormInput
            id="email"
            name="email"
            type="email"
            label="Email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Ingresa tu correo electrónico"
            disabled={loading}
          />
          
          <FormInput
            id="telefono"
            name="telefono"
            type="tel"
            label="Teléfono"
            value={formData.telefono}
            onChange={handleChange}
            placeholder="Ingresa tu número de teléfono"
            disabled={loading}
          />
          
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
              Registrar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClienteInfoModal; 