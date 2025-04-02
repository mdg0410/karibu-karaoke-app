import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { postApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import MesaSelectionModal from '../components/MesaSelectionModal';
import ClienteInfoModal from '../components/ClienteInfoModal';

function MesaSelection() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { setCurrentUser } = useAuth();
  
  const [selectedMesa, setSelectedMesa] = useState(null);
  const [showMesaModal, setShowMesaModal] = useState(true);
  const [showClienteInfoModal, setShowClienteInfoModal] = useState(false);
  const [error, setError] = useState('');

  // Verificar si ya hay un usuario autenticado al cargar
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      if (userData.role === 'cliente' && userData.mesaId) {
        navigate(`/client/${userData.mesaId}`, { replace: true });
      }
    }
  }, [navigate]);

  const handleMesaSelected = (mesaId) => {
    setSelectedMesa(mesaId);
    setShowMesaModal(false);
    setShowClienteInfoModal(true);
  };

  const handleClienteRegistrado = (response) => {
    setShowClienteInfoModal(false);
    const userData = {
      id: response.cliente.id,
      nombre: response.cliente.nombre,
      email: response.cliente.email,
      telefono: response.cliente.telefono,
      role: 'cliente',
      token: response.token,
      mesaId: selectedMesa
    };
    
    // Establecer el usuario actual en el contexto
    setCurrentUser(userData);
    
    // Guardar datos en localStorage
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('clienteToken', response.token);
    localStorage.setItem('mesaId', selectedMesa);
    
    // Redirigir al dashboard de cliente
    navigate(`/client/${selectedMesa}`, { replace: true });
  };

  // Mostrar modales según el estado
  if (showMesaModal) {
    return (
      <MesaSelectionModal 
        isOpen={showMesaModal}
        onClose={() => navigate('/', { replace: true })}
        onMesaSelected={handleMesaSelected}
      />
    );
  }

  if (showClienteInfoModal) {
    return (
      <ClienteInfoModal 
        isOpen={showClienteInfoModal}
        onClose={() => navigate('/', { replace: true })}
        onSubmitSuccess={handleClienteRegistrado}
        mesaId={selectedMesa}
      />
    );
  }

  // Si no hay modal activo, redirigir al inicio
  navigate('/', { replace: true });
  return null;
}

export default MesaSelection; 