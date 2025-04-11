import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import useMesa from '../../hooks/useMesa';
import HomeLayout from '../../layouts/HomeLayout';
import Alert from '../../components/common/Alert';
import Loader from '../../components/common/Loader';

const RegistroCliente = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    celular: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  
  const navigate = useNavigate();
  const { register, loading, error: authError } = useAuth();
  const { mesaId, mesaActual, obtenerMesaPorId, loading: mesaLoading } = useMesa();

  useEffect(() => {
    // Verificar si hay un ID de mesa seleccionado
    if (!mesaId) {
      navigate('/mesa/seleccion');
      return;
    }

    // Si tenemos el ID pero no los detalles, cargar los detalles
    if (mesaId && !mesaActual) {
      obtenerMesaPorId(mesaId).catch(() => {
        setError('No se pudo obtener los detalles de la mesa. Por favor, selecciona otra.');
        navigate('/mesa/seleccion');
      });
    }
  }, [mesaId, mesaActual, navigate]);

  useEffect(() => {
    if (authError) {
      setError(authError);
      setSubmitting(false);
    }
  }, [authError]);

  const validateForm = () => {
    const errors = {};
    
    if (!formData.nombre.trim()) {
      errors.nombre = 'El nombre es obligatorio';
    }
    
    if (!formData.email.trim()) {
      errors.email = 'El email es obligatorio';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'El email no es válido';
    }
    
    if (!formData.celular.trim()) {
      errors.celular = 'El número de celular es obligatorio';
    } else if (!/^\d{9}$/.test(formData.celular)) {
      errors.celular = 'El celular debe tener 9 dígitos';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar error específico cuando el usuario empieza a corregir
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setSubmitting(true);
    setError('');
    
    try {
      await register(formData, mesaId);
      // El hook useAuth redirige automáticamente al panel del cliente
    } catch (err) {
      setError(err.message || 'Error al registrar. Inténtalo nuevamente.');
      setSubmitting(false);
    }
  };

  if (mesaLoading) {
    return (
      <HomeLayout>
        <div className="flex justify-center items-center h-[60vh]">
          <Loader text="Cargando información de la mesa..." />
        </div>
      </HomeLayout>
    );
  }

  return (
    <HomeLayout>
      <div className="max-w-md mx-auto bg-karaoke-gray p-5 md:p-6 rounded-xl shadow-neumorph animate-fade-in">
        <h2 className="text-xl md:text-2xl font-bold mb-6 text-center text-primary">Registro de Cliente</h2>
        
        {mesaActual && (
          <div className="mb-6 p-3 bg-karaoke-darkgray rounded-lg shadow-neumorph-inset">
            <p className="text-primary text-center">
              Mesa seleccionada: <span className="font-bold">{mesaActual.numero || mesaId}</span>
            </p>
          </div>
        )}
        
        {error && (
          <Alert 
            type="error" 
            message={error} 
            className="mb-4"
            onClose={() => setError('')}
          />
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="nombre" className="block mb-1 font-medium text-primary-light">
              Nombre
            </label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              disabled={loading || submitting}
              className="w-full px-4 py-2 bg-karaoke-darkgray text-white rounded-lg shadow-neumorph-inset focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 disabled:opacity-50"
              placeholder="Ingresa tu nombre completo"
            />
            {formErrors.nombre && (
              <p className="mt-1 text-red-400 text-sm">{formErrors.nombre}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="email" className="block mb-1 font-medium text-primary-light">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled={loading || submitting}
              className="w-full px-4 py-2 bg-karaoke-darkgray text-white rounded-lg shadow-neumorph-inset focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 disabled:opacity-50"
              placeholder="ejemplo@correo.com"
            />
            {formErrors.email && (
              <p className="mt-1 text-red-400 text-sm">{formErrors.email}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="celular" className="block mb-1 font-medium text-primary-light">
              Celular
            </label>
            <input
              type="tel"
              id="celular"
              name="celular"
              value={formData.celular}
              onChange={handleChange}
              disabled={loading || submitting}
              className="w-full px-4 py-2 bg-karaoke-darkgray text-white rounded-lg shadow-neumorph-inset focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 disabled:opacity-50"
              placeholder="Ingresa 9 dígitos"
              maxLength={9}
            />
            {formErrors.celular && (
              <p className="mt-1 text-red-400 text-sm">{formErrors.celular}</p>
            )}
          </div>
          
          <button 
            type="submit"
            disabled={loading || submitting}
            className="w-full mt-2 px-4 py-3 bg-karaoke-darkgray text-primary font-semibold rounded-lg shadow-neumorph hover:shadow-neumorph-inset transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 disabled:opacity-50"
          >
            {loading || submitting ? 'Registrando...' : 'Registrarme'}
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-primary-light text-sm">
            Tus datos sólo serán utilizados para mejorar tu experiencia en Karibu Karaoke.
          </p>
        </div>
      </div>
    </HomeLayout>
  );
};

export default RegistroCliente;