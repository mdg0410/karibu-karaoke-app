import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../../context/AuthContext';
import { postApi } from '../../../services/api';

const Canciones = () => {
  const { t } = useTranslation();
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [songNumbers, setSongNumbers] = useState(['', '', '']);

  const getMesaId = () => {
    const mesaId = localStorage.getItem('mesaObjectId');
    
    if (!mesaId) {
      if (currentUser?.mesa?._id) {
        return currentUser.mesa._id;
      }
      return null;
    }

    return mesaId;
  };

  const handleSongNumberChange = (index, value) => {
    const newSongNumbers = [...songNumbers];
    newSongNumbers[index] = value;
    setSongNumbers(newSongNumbers);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const mesaId = getMesaId();

      if (!mesaId) {
        setError('No se encontró la información de la mesa. Por favor, selecciona una mesa primero.');
        setLoading(false);
        return;
      }

      const validSongs = songNumbers
        .filter(num => num.trim() !== '')
        .map(num => {
          const parsedNum = parseInt(num);
          if (isNaN(parsedNum) || parsedNum <= 0) {
            throw new Error('Los números de canción deben ser valores positivos');
          }
          return parsedNum;
        });

      if (validSongs.length === 0) {
        setError('Ingresa al menos un número de canción');
        return;
      }

      if (validSongs.length > 3) {
        setError('No puedes solicitar más de 3 canciones');
        return;
      }

      const requestData = {
        mesaId: mesaId,
        canciones: validSongs
      };

      console.info('[Pedido Canciones] Enviando solicitud para mesa:', mesaId);
      
      const response = await postApi('pedido-canciones', requestData);

      if (response.success) {
        console.info('[Pedido Canciones] Solicitud exitosa:', {
          mesaId: mesaId,
          cancionesSolicitadas: validSongs.length
        });
        setSuccess(true);
        setSongNumbers(['', '', '']);
      } else {
        console.warn('[Pedido Canciones] Error en la solicitud:', response.message);
        setError(response.message || 'Error al enviar la solicitud');
      }
    } catch (error) {
      console.error('[Pedido Canciones] Error:', error.message);
      setError(error.message || 'Error al enviar la solicitud');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-dark to-dark-light py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-dark-card p-8 rounded-2xl border border-white/10 shadow-xl">
          <h2 className="text-3xl font-bold text-white text-center mb-8">
            {t('solicitarCanciones')}
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Columna izquierda - QR Code */}
            <div className="bg-dark/50 p-6 rounded-xl border border-white/5 flex flex-col items-center">
              <div className="w-full max-w-md aspect-square mb-4 rounded-lg overflow-hidden shadow-lg">
                <img
                  src="/images/productos/Cancionero.jpeg"
                  alt="Cancionero QR"
                  className="w-full h-full object-contain bg-white p-2"
                />
              </div>
              <p className="text-white/70 text-center text-lg">
                Escanea el código QR para ver el catálogo completo de canciones disponibles
              </p>
            </div>

            {/* Columna derecha - Formulario */}
            <div className="bg-dark/50 p-6 rounded-xl border border-white/5">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  {songNumbers.map((number, index) => (
                    <div key={index} className="flex flex-col">
                      <label className="text-white/90 text-lg mb-2 font-medium">
                        {t('cancion')} {index + 1}
                      </label>
                      <input
                        type="number"
                        value={number}
                        onChange={(e) => handleSongNumberChange(index, e.target.value)}
                        placeholder={t('numeroCancion')}
                        className="bg-dark border-2 border-white/10 rounded-lg px-4 py-3 text-white text-lg focus:outline-none focus:border-primary transition-colors"
                        min="1"
                      />
                    </div>
                  ))}
                </div>

                {error && (
                  <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-lg">
                    {error}
                  </div>
                )}

                {success && (
                  <div className="bg-green-500/10 border border-green-500/20 text-green-400 p-4 rounded-lg">
                    {t('solicitudEnviada')}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-primary text-white rounded-lg text-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-primary/20"
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {t('enviando')}
                    </span>
                  ) : (
                    t('enviarSolicitud')
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Canciones;
