import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';

// Importar componentes
import ClienteNavbar from './ClienteNavbar';
import Bebidas from './Secciones/Bebidas';
import Comida from './Secciones/Comida';
import Canciones from './Secciones/Canciones';
import Perfil from './Secciones/Perfil';
import Carrito from './Carrito';
import MesaSelectionModal from '../../components/MesaSelectionModal';
import ClienteInfoModal from '../../components/ClienteInfoModal';

// Importar servicios
import { postApi, getApi } from '../../services/api';

// Importar contexto de autenticación
import { useAuth } from '../../context/AuthContext';

const ClienteDashboard = () => {
  const { t } = useTranslation();
  const { currentUser, setCurrentUser } = useAuth();
  const navigate = useNavigate();
  const params = useParams();
  const [carritoVisible, setCarritoVisible] = useState(false);
  const [seccionActiva, setSeccionActiva] = useState('bebidas');
  
  // Estados para los modales
  const [showMesaModal, setShowMesaModal] = useState(false);
  const [showClienteInfoModal, setShowClienteInfoModal] = useState(false);
  const [selectedMesa, setSelectedMesa] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    const checkAuthAndMesa = async () => {
      setLoading(true);
      setError('');
      
      try {
        // Obtener datos del localStorage
        const storedUser = localStorage.getItem('user');
        const mesaIdFromUrl = params.mesaId;
        
        // Si no hay mesaId en la URL, redirigir al inicio
        if (!mesaIdFromUrl) {
          navigate('/', { replace: true });
          return;
        }

        // Si hay usuario autenticado
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          if (userData.role === 'cliente') {
            // Establecer el usuario en el contexto
            setCurrentUser(userData);
            
            // Si la mesa coincide, todo está bien
            if (userData.mesaId === mesaIdFromUrl) {
              setLoading(false);
              setShowWelcome(true);
              setTimeout(() => setShowWelcome(false), 3000);
              return;
            }
            
            // Si la mesa no coincide, actualizar la mesa
            userData.mesaId = mesaIdFromUrl;
            localStorage.setItem('user', JSON.stringify(userData));
            localStorage.setItem('mesaId', mesaIdFromUrl);
            setLoading(false);
            return;
          }
        }

        // Si no hay usuario autenticado, verificar disponibilidad de la mesa
        try {
          const response = await getApi(`mesas/verificar/${mesaIdFromUrl}`);
          if (response.success && response.disponible) {
            setSelectedMesa(mesaIdFromUrl);
            setShowClienteInfoModal(true);
            setLoading(false);
            return;
          }
          
          // Si la mesa no está disponible
          setError('La mesa no está disponible');
          navigate('/', { replace: true });
        } catch (error) {
          console.error('Error verificando mesa:', error);
          setError('Error al verificar la mesa');
          navigate('/', { replace: true });
        }
      } catch (error) {
        console.error('Error en checkAuthAndMesa:', error);
        setError('Error al verificar la autenticación');
      } finally {
        setLoading(false);
      }
    };

    checkAuthAndMesa();
  }, [navigate, params.mesaId, setCurrentUser]);

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
    
    // Mostrar mensaje de bienvenida
    setShowWelcome(true);
    setTimeout(() => setShowWelcome(false), 3000);

    // Forzar el estado de autenticación
    setLoading(false);
  };

  const toggleCarrito = () => {
    setCarritoVisible(!carritoVisible);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('mesaId');
    localStorage.removeItem('clienteToken');
    navigate('/', { replace: true });
  };

  // Mostrar spinner mientras se carga
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-dark">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Mostrar error si hay alguno
  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-dark p-4">
        <div className="bg-red-900/40 border border-red-800 text-red-300 p-6 rounded-lg max-w-md">
          <h2 className="text-xl font-bold mb-3">Error</h2>
          <p>{error}</p>
          <button
            onClick={() => navigate('/', { replace: true })}
            className="mt-4 w-full py-2 px-4 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
          >
            Volver al Inicio
          </button>
        </div>
      </div>
    );
  }

  // Mostrar modales si es necesario
  if (showMesaModal) {
    return <MesaSelectionModal 
      isOpen={showMesaModal}
      onClose={() => navigate('/', { replace: true })}
      onMesaSelected={handleMesaSelected}
    />;
  }

  if (showClienteInfoModal) {
    return <ClienteInfoModal 
      isOpen={showClienteInfoModal}
      onClose={() => {
        setShowClienteInfoModal(false);
        navigate('/', { replace: true });
      }}
      onSubmitSuccess={handleClienteRegistrado}
      mesaId={selectedMesa}
    />;
  }

  // Mostrar dashboard si el usuario está autenticado
  return (
    <div className="min-h-screen bg-dark">
      {showWelcome && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className="bg-primary text-white px-8 py-6 rounded-lg shadow-xl text-center max-w-md transform animate-fade-in">
            <h2 className="text-2xl font-bold mb-2">¡Bienvenido!</h2>
            <p>Sesión iniciada correctamente en la Mesa {currentUser?.mesaId}</p>
          </div>
        </div>
      )}
      
      <ClienteNavbar 
        onSeccionChange={setSeccionActiva} 
        seccionActiva={seccionActiva}
        onToggleCarrito={toggleCarrito}
        onLogout={handleLogout}
        mesaId={currentUser?.mesaId}
      />
      
      <main className="p-6 max-w-7xl mx-auto">
        {seccionActiva === 'bebidas' && <Bebidas />}
        {seccionActiva === 'comida' && <Comida />}
        {seccionActiva === 'canciones' && <Canciones />}
        {seccionActiva === 'perfil' && <Perfil onLogout={handleLogout} />}
      </main>
      
      <Carrito visible={carritoVisible} onClose={() => setCarritoVisible(false)} />
    </div>
  );
};

export default ClienteDashboard;
