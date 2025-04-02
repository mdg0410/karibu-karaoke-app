import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function MesaSelection() {
  const [mesaId, setMesaId] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const handleMesaValidation = async (e) => {
    e.preventDefault();
    try {
      // Validar mesa y hacer login
      const result = await login(mesaId, 'cliente');
      
      if (result.success) {
        // Redirigir al dashboard del cliente
        navigate('/client', { replace: true });
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // ... resto del componente
}

export default MesaSelection; 