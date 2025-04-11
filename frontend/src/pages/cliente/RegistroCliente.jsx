import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HomeLayout from '../../layouts/HomeLayout';

const RegistroCliente = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    celular: ''
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  // Verificar si hay un mesaId en localStorage
  const mesaId = localStorage.getItem('mesaId');
  
  // Si no hay mesaId, redirigir a la selección de mesa
  if (!mesaId) {
    navigate('/mesa/seleccion');
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es obligatorio';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'El email es obligatorio';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El formato del email no es válido';
    }
    
    if (!formData.celular.trim()) {
      newErrors.celular = 'El número de celular es obligatorio';
    } else if (!/^\d{9,10}$/.test(formData.celular)) {
      newErrors.celular = 'El número debe tener entre 9 y 10 dígitos';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Aquí iría la llamada a la API para registrar al cliente
      // Por ahora, simularemos una respuesta exitosa
      
      // Datos de usuario simulados
      const userData = {
        id: 'user123',
        nombre: formData.nombre,
        email: formData.email,
        celular: formData.celular,
        rol: 'cliente'
      };
      
      // Token simulado
      const token = 'jwt-token-simulado';
      
      // Guardar en localStorage
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', token);
      
      // Redirigir al panel del cliente
      navigate('/cliente/panel');
    }
  };

  return (
    <HomeLayout>
      <div className="max-w-md mx-auto bg-karaoke-gray p-5 md:p-6 rounded-xl shadow-neumorph animate-fade-in">
        <h2 className="text-xl md:text-2xl font-bold mb-6 text-center text-primary">Registro de Cliente</h2>
        
        <div className="mb-4 text-center">
          <p className="text-primary bg-karaoke-darkgray p-2 rounded-lg inline-block shadow-neumorph-inset px-4">
            Mesa seleccionada: <span className="font-bold">{mesaId}</span>
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="nombre" className="block mb-2 font-medium text-primary-light">
              Nombre completo
            </label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-karaoke-darkgray text-white rounded-lg shadow-neumorph-inset focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
              placeholder="Tu nombre"
              aria-label="Ingresa tu nombre completo"
              aria-required="true"
            />
            {errors.nombre && <p className="mt-2 text-red-400 text-sm" role="alert">{errors.nombre}</p>}
          </div>
          
          <div>
            <label htmlFor="email" className="block mb-2 font-medium text-primary-light">
              Correo electrónico
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-karaoke-darkgray text-white rounded-lg shadow-neumorph-inset focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
              placeholder="ejemplo@correo.com"
              aria-label="Ingresa tu correo electrónico"
              aria-required="true"
            />
            {errors.email && <p className="mt-2 text-red-400 text-sm" role="alert">{errors.email}</p>}
          </div>
          
          <div>
            <label htmlFor="celular" className="block mb-2 font-medium text-primary-light">
              Número de celular
            </label>
            <input
              type="tel"
              id="celular"
              name="celular"
              value={formData.celular}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-karaoke-darkgray text-white rounded-lg shadow-neumorph-inset focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
              placeholder="9XXXXXXXX"
              aria-label="Ingresa tu número de celular"
              aria-required="true"
            />
            {errors.celular && <p className="mt-2 text-red-400 text-sm" role="alert">{errors.celular}</p>}
          </div>
          
          <button 
            type="submit"
            className="w-full px-4 py-3 bg-karaoke-darkgray text-primary font-semibold rounded-lg shadow-neumorph hover:shadow-neumorph-inset transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
            aria-label="Registrarme y continuar"
          >
            Registrarme
          </button>
        </form>
        
        <div className="mt-6 text-center text-sm text-white">
          <p>La información proporcionada será utilizada únicamente para mejorar su experiencia en Karibu Karaoke</p>
        </div>
      </div>
    </HomeLayout>
  );
};

export default RegistroCliente;