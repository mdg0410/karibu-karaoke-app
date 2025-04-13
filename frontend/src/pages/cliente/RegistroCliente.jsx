import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
  const [mesaInfo, setMesaInfo] = useState(null);
  const [cargandoMesa, setCargandoMesa] = useState(false);
  
  const navigate = useNavigate();
  const { mesaId } = useParams();
  const { register, isAuthenticated, loading: authLoading, error: authError } = useAuth();
  const { validarMesaDisponible } = useMesa();

  // Guardar mesaId en localStorage cuando se carga el componente
  useEffect(() => {
    if (mesaId) {
      // Guardar el mesaId en localStorage con una clave específica
      localStorage.setItem('mesaIdPreseleccionada', mesaId);
      console.log('Mesa ID guardada en localStorage:', mesaId);
    }
  }, [mesaId]);

  // Cargar información de la mesa solo al montar el componente
  useEffect(() => {
    // Función para obtener información de la mesa
    const obtenerInfoMesa = async () => {
      if (mesaId) {
        setCargandoMesa(true);
        try {
          const resultado = await validarMesaDisponible(mesaId);
          if (resultado && resultado.disponible) {
            setMesaInfo(resultado.mesa);
            // También guardamos la información completa de la mesa
            localStorage.setItem('mesaInfoPreseleccionada', JSON.stringify(resultado.mesa));
          }
        } catch (err) {
          console.error("Error al obtener información de la mesa:", err);
        } finally {
          setCargandoMesa(false);
        }
      }
    };

    // Solo ejecutar la función al montar el componente
    obtenerInfoMesa();
    
    // Array de dependencias vacío para asegurar que solo se ejecute una vez al montar
  }, []); // ⬅️ Array de dependencias vacío

  // Verificar autenticación y redirigir
  useEffect(() => {
    if (isAuthenticated) {
      // Ahora que estamos usando localStorage, podemos simplificar esta redirección
      navigate('/mesa/seleccion');
    }
  }, [isAuthenticated, navigate]);

  // Gestionar errores
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
      await register(formData);
      // La redirección la maneja el efecto de autenticación
    } catch (err) {
      console.error("Error en registro:", err);
      setError(err.message || 'Error al registrar. Inténtalo nuevamente.');
      setSubmitting(false);
    }
  };

  // Solo mostrar el loader cuando estamos enviando el formulario o cargando el auth
  // No mostrar el loader cuando solo estamos cargando la información de la mesa
  if (authLoading || submitting) {
    return (
      <HomeLayout>
        <div className="flex justify-center items-center h-[60vh]">
          <Loader text="Procesando información..." />
        </div>
      </HomeLayout>
    );
  }

  return (
    <HomeLayout>
      <div className="max-w-md mx-auto bg-karaoke-gray p-5 md:p-6 rounded-xl shadow-neumorph animate-fade-in">
        <h2 className="text-xl md:text-2xl font-bold mb-6 text-center text-primary">Registro de Cliente</h2>
        
        {/* Mostrar indicador de carga de mesa dentro del formulario, no pantalla completa */}
        {cargandoMesa && (
          <div className="mb-4 text-center">
            <Loader text="Cargando información de mesa..." size="small" />
          </div>
        )}
        
        {mesaId && mesaInfo && (
          <div className="mb-4 bg-karaoke-darkgray p-3 rounded-lg shadow-neumorph-inset">
            <p className="text-center text-primary">
              Mesa preseleccionada: <span className="font-bold">{mesaInfo.numero}</span>
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
              disabled={authLoading || submitting}
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
              disabled={authLoading || submitting}
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
              disabled={authLoading || submitting}
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
            disabled={authLoading || submitting}
            className="w-full mt-2 px-4 py-3 bg-karaoke-darkgray text-primary font-semibold rounded-lg shadow-neumorph hover:shadow-neumorph-inset transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 disabled:opacity-50"
          >
            {authLoading || submitting ? 'Registrando...' : 'Registrarme'}
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