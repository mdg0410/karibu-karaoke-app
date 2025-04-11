import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HomeLayout from '../../layouts/HomeLayout';

const StaffLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validación básica
    if (!formData.email.trim() || !formData.password.trim()) {
      setError('Todos los campos son obligatorios');
      return;
    }
    
    // Aquí iría la llamada a la API para autenticar al staff
    // Por ahora, simularemos una autenticación exitosa con datos estáticos
    
    // Verificamos las credenciales (simulado)
    if (formData.email === 'staff@karibu.com' && formData.password === 'password') {
      // Datos de usuario simulados
      const userData = {
        id: 'staff123',
        nombre: 'Usuario Staff',
        email: formData.email,
        rol: 'trabajador'
      };
      
      // Token simulado
      const token = 'jwt-token-staff-simulado';
      
      // Guardar en localStorage
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', token);
      
      // Redirigir al panel del staff
      navigate('/staff/panel');
    } else {
      setError('Credenciales incorrectas');
    }
  };

  return (
    <HomeLayout>
      <div className="max-w-md mx-auto bg-karaoke-gray p-5 md:p-6 rounded-xl shadow-neumorph animate-fade-in">
        <h2 className="text-xl md:text-2xl font-bold mb-6 text-center text-primary">Acceso de Personal</h2>
        
        {error && (
          <div className="bg-red-900 text-white p-3 rounded-lg mb-4 text-center shadow-neumorph-inset" role="alert">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
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
              placeholder="correo@karibu.com"
              aria-label="Ingresa tu correo electrónico"
              aria-required="true"
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block mb-2 font-medium text-primary-light">
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-karaoke-darkgray text-white rounded-lg shadow-neumorph-inset focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
              placeholder="••••••••"
              aria-label="Ingresa tu contraseña"
              aria-required="true"
            />
          </div>
          
          <button 
            type="submit"
            className="w-full px-4 py-3 bg-karaoke-darkgray text-primary font-semibold rounded-lg shadow-neumorph hover:shadow-neumorph-inset transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
            aria-label="Iniciar sesión como personal"
          >
            Iniciar Sesión
          </button>
        </form>
        
        <div className="mt-6 text-center text-sm text-white">
          <p>¿Olvidaste tu contraseña? Contacta al administrador del sistema.</p>
        </div>
      </div>
    </HomeLayout>
  );
};

export default StaffLogin;