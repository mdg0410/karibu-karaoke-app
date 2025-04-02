import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import MesaSelectionModal from '../components/MesaSelectionModal';
import ClienteInfoModal from '../components/ClienteInfoModal';
import { useEffect, useState } from 'react';

// Custom hook para manejar la autenticación del cliente
const useClienteAuth = () => {
  const navigate = useNavigate();
  const { setCurrentUser } = useAuth();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      if (userData.role === 'cliente' && userData.mesaId) {
        navigate(`/client/${userData.mesaId}`, { replace: true });
      }
    }
  }, [navigate]);

  const handleClienteRegistrado = (response, mesaId) => {
    const userData = {
      id: response.cliente.id,
      nombre: response.cliente.nombre,
      email: response.cliente.email,
      telefono: response.cliente.telefono,
      role: 'cliente',
      token: response.token,
      mesaId
    };
    
    setCurrentUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('clienteToken', response.token);
    localStorage.setItem('mesaId', mesaId);
    
    navigate(`/client/${mesaId}`, { replace: true });
  };

  return { handleClienteRegistrado };
};

const MesaSelection = () => {
  const navigate = useNavigate();
  const [selectedMesa, setSelectedMesa] = useState(null);
  const [currentStep, setCurrentStep] = useState('mesa'); // 'mesa' | 'cliente'
  const { handleClienteRegistrado } = useClienteAuth();

  const handleMesaSelected = (mesaId) => {
    setSelectedMesa(mesaId);
    setCurrentStep('cliente');
  };

  const handleClose = () => {
    navigate('/', { replace: true });
  };

  const handleClienteSuccess = (response) => {
    handleClienteRegistrado(response, selectedMesa);
  };

  // Renderizado condicional basado en el paso actual
  if (currentStep === 'mesa') {
    return (
      <MesaSelectionModal 
        isOpen={true}
        onClose={handleClose}
        onMesaSelected={handleMesaSelected}
      />
    );
  }

  if (currentStep === 'cliente' && selectedMesa) {
    return (
      <ClienteInfoModal 
        isOpen={true}
        onClose={handleClose}
        onSubmitSuccess={handleClienteSuccess}
        mesaId={selectedMesa}
      />
    );
  }

  // Si no hay paso válido, redirigir al inicio
  navigate('/', { replace: true });
  return null;
};

export default MesaSelection; 