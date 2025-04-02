import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function StaffLogin() {
  const [credentials, setCredentials] = useState({
    email: '',
    adminToken: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const result = await login(credentials.email, 'staff', null, credentials.adminToken);
      
      if (result.success) {
        navigate('/staff', { replace: true });
      } else {
        setError(result.message || 'Error al iniciar sesión');
      }
    } catch (error) {
      setError('Error al conectar con el servidor');
      console.error('Error:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark p-4">
      <div className="max-w-md w-full space-y-8 bg-dark-card p-8 border-3 border-white shadow-brutal">
        <div>
          <h2 className="text-center text-3xl font-extrabold text-white">
            Staff Login
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-500/10 border-2 border-red-500 p-3 text-red-500 text-center">
              {error}
            </div>
          )}
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="sr-only">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="appearance-none relative block w-full px-3 py-2 border-3 border-white bg-dark text-white placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary"
                placeholder="Email"
                value={credentials.email}
                onChange={(e) => setCredentials({...credentials, email: e.target.value})}
              />
            </div>
            <div>
              <label htmlFor="adminToken" className="sr-only">
                Token de Administrador
              </label>
              <input
                id="adminToken"
                name="adminToken"
                type="text"
                required
                className="appearance-none relative block w-full px-3 py-2 border-3 border-white bg-dark text-white placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary"
                placeholder="Token de Administrador"
                value={credentials.adminToken}
                onChange={(e) => setCredentials({...credentials, adminToken: e.target.value})}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border-3 border-white text-sm font-medium text-dark bg-white hover:bg-dark hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Iniciar Sesión
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default StaffLogin; 