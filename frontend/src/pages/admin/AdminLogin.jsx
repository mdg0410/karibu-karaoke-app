import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import HomeLayout from '../../layouts/HomeLayout';
import Alert from '../../components/common/Alert';
import Loader from '../../components/common/Loader';

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login, isAuthenticated, user, loading, error: authError } = useAuth();

  useEffect(() => {
    // Si el usuario ya está autenticado como admin, redirigir al panel
    if (isAuthenticated && user && user.rol === 'admin') {
      navigate('/admin/panel');
    }
    
    // Si el usuario está autenticado pero con otro rol, mostrar mensaje
    if (isAuthenticated && user && user.rol !== 'admin') {
      setError('No tienes permisos de administrador para acceder a esta sección');
    }
  }, [isAuthenticated, user, navigate]);

  useEffect(() => {
    if (authError) {
      setError(authError);
    }
  }, [authError]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validación básica
    if (!formData.email.trim() || !formData.password) {
      setError('Todos los campos son obligatorios');
      return;
    }
    
    setError('');
    
    try {
      await login(formData);
      // El hook useAuth maneja la redirección según el rol
    } catch (err) {
      setError(err.message || 'Credenciales inválidas');
    }
  };

  return (
    <HomeLayout>
      <div className="max-w-md mx-auto bg-karaoke-gray p-5 md:p-6 rounded-xl shadow-neumorph animate-fade-in">
        <h2 className="text-xl md:text-2xl font-bold mb-6 text-center text-primary">Acceso de Administrador</h2>
        
        {error && (
          <Alert 
            type="error" 
            message={error} 
            className="mb-4"
            onClose={() => setError('')}
          />
        )}
        
        {loading ? (
          <div className="text-center mb-6">
            <Loader text="Verificando credenciales..." />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block mb-1 font-medium text-primary-light">
                Email de Administrador
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={loading}
                className="w-full px-4 py-2 bg-karaoke-darkgray text-white rounded-lg shadow-neumorph-inset focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 disabled:opacity-50"
                placeholder="admin@karibu.com"
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block mb-1 font-medium text-primary-light">
                Contraseña
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                disabled={loading}
                className="w-full px-4 py-2 bg-karaoke-darkgray text-white rounded-lg shadow-neumorph-inset focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 disabled:opacity-50"
                placeholder="••••••••"
              />
            </div>
            
            <button 
              type="submit"
              disabled={loading}
              className="w-full px-4 py-3 bg-karaoke-darkgray text-primary font-semibold rounded-lg shadow-neumorph hover:shadow-neumorph-inset transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 disabled:opacity-50"
            >
              Iniciar Sesión como Administrador
            </button>
          </form>
        )}
        
        <div className="mt-6 text-center">
          <p className="text-primary-light text-sm">
            Acceso exclusivo para administradores de Karibu Karaoke
          </p>
        </div>
      </div>
    </HomeLayout>
  );
};

export default AdminLogin;