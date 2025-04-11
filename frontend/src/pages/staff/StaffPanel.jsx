import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StaffLayout from '../../layouts/StaffLayout';
import useAuth from '../../hooks/useAuth';
import useMesa from '../../hooks/useMesa';
import Alert from '../../components/common/Alert';
import Loader from '../../components/common/Loader';

const StaffPanel = () => {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const { mesas, obtenerMesas, actualizarDatosMesa, loading: mesaLoading } = useMesa();

  useEffect(() => {
    // Verificar si el usuario está autenticado como staff
    if (!isAuthenticated || !user) {
      navigate('/staff/login');
      return;
    }

    if (user.rol !== 'trabajador') {
      navigate('/');
      return;
    }

    // Cargar lista de mesas
    obtenerMesas().catch(err => {
      setError('Error al cargar las mesas. Por favor, intenta nuevamente.');
    });
  }, [isAuthenticated, user, navigate]);

  const handleCambiarEstadoMesa = async (mesaId, nuevoEstado) => {
    try {
      await actualizarDatosMesa(mesaId, { estado: nuevoEstado });
      setSuccess(`Mesa ${mesaId} actualizada correctamente a estado: ${nuevoEstado}`);
      
      // Limpiar mensaje después de 3 segundos
      setTimeout(() => {
        setSuccess('');
      }, 3000);
    } catch (err) {
      setError(`Error al actualizar la mesa ${mesaId}: ${err.message}`);
    }
  };

  if (authLoading || mesaLoading) {
    return (
      <StaffLayout>
        <div className="flex justify-center items-center h-[60vh]">
          <Loader text="Cargando información..." />
        </div>
      </StaffLayout>
    );
  }

  return (
    <StaffLayout>
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-6 bg-karaoke-gray p-5 rounded-xl shadow-neumorph">
          <div className="flex flex-wrap justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-primary">Panel de Trabajador</h2>
              <p className="text-primary-light mt-1">
                Usuario: <span className="font-semibold">{user?.nombre}</span>
              </p>
            </div>
          </div>
        </div>

        {error && (
          <Alert 
            type="error" 
            message={error} 
            className="mb-4"
            onClose={() => setError('')}
          />
        )}

        {success && (
          <Alert 
            type="success" 
            message={success} 
            className="mb-4"
            onClose={() => setSuccess('')}
          />
        )}

        <div className="mb-6">
          <h3 className="text-xl font-bold mb-4 text-primary">Gestión de Mesas</h3>
          
          <div className="overflow-x-auto bg-karaoke-gray rounded-xl shadow-neumorph">
            <table className="min-w-full divide-y divide-karaoke-darkgray">
              <thead className="bg-karaoke-darkgray">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-primary uppercase tracking-wider">
                    ID
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-primary uppercase tracking-wider">
                    Número
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-primary uppercase tracking-wider">
                    Estado
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-primary uppercase tracking-wider">
                    Capacidad
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-primary uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-karaoke-gray divide-y divide-karaoke-darkgray">
                {mesas && mesas.length > 0 ? (
                  mesas.map((mesa) => (
                    <tr key={mesa.id} className="hover:bg-karaoke-darkgray/30">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                        {mesa.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                        {mesa.numero}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${mesa.estado === 'disponible' ? 'bg-green-100 text-green-800' : 
                            mesa.estado === 'ocupada' ? 'bg-red-100 text-red-800' : 
                            mesa.estado === 'mantenimiento' ? 'bg-yellow-100 text-yellow-800' : 
                            'bg-gray-100 text-gray-800'}`}>
                          {mesa.estado}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                        {mesa.capacidad}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          {mesa.estado !== 'disponible' && (
                            <button
                              onClick={() => handleCambiarEstadoMesa(mesa.id, 'disponible')}
                              className="text-green-400 hover:text-green-600 transition-colors"
                            >
                              Disponible
                            </button>
                          )}
                          {mesa.estado !== 'ocupada' && (
                            <button
                              onClick={() => handleCambiarEstadoMesa(mesa.id, 'ocupada')}
                              className="text-red-400 hover:text-red-600 transition-colors"
                            >
                              Ocupada
                            </button>
                          )}
                          {mesa.estado !== 'mantenimiento' && (
                            <button
                              onClick={() => handleCambiarEstadoMesa(mesa.id, 'mantenimiento')}
                              className="text-yellow-400 hover:text-yellow-600 transition-colors"
                            >
                              Mantenimiento
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 text-center text-sm text-white">
                      No hay mesas disponibles
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </StaffLayout>
  );
};

export default StaffPanel;