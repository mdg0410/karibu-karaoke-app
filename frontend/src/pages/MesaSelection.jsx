import React, { useState } from 'react';
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

  const handleMesaSelected = (mesaId) => {
    setSelectedMesa(mesaId);
    setShowMesaModal(false);
    setShowClienteInfoModal(true);
  };

  const handleClienteRegistrado = (response) => {
    setShowClienteInfoModal(false);
    setCurrentUser({
      id: response.cliente.id,
      nombre: response.cliente.nombre,
      email: response.cliente.email,
      telefono: response.cliente.telefono,
      role: 'cliente',
      token: response.token,
      mesaId: selectedMesa
    });
    navigate(`/client/${selectedMesa}`);
  };

  // Mostrar modales según el estado
  if (showMesaModal) {
    return (
      <MesaSelectionModal 
        isOpen={showMesaModal}
        onClose={() => navigate('/')}
        onMesaSelected={handleMesaSelected}
      />
    );
  }

  if (showClienteInfoModal) {
    return (
      <ClienteInfoModal 
        isOpen={showClienteInfoModal}
        onClose={() => {
          setShowClienteInfoModal(false);
          navigate('/');
        }}
        onSubmitSuccess={handleClienteRegistrado}
        mesaId={selectedMesa}
      />
    );
  }

  // Página de respaldo (aunque normalmente no se mostrará porque
  // siempre estará uno de los modales activos)
  return (
    <div className="flex justify-center items-center h-screen bg-dark p-4">
      <div className="bg-dark-secondary rounded-lg shadow-xl max-w-md w-full p-6 text-center">
        <h2 className="text-2xl font-bold mb-4 text-white">
          {t('mesa.seleccion')}
        </h2>
        <button
          onClick={() => setShowMesaModal(true)}
          className="mt-4 w-full py-2 px-4 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
        >
          {t('buttons.seleccionarMesa')}
        </button>
      </div>
    </div>
  );
}

export default MesaSelection; 