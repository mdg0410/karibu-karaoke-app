import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../../context/AuthContext';
import { postApi } from '../../../services/api';
import QRCode from 'qrcode.react';

const Canciones = () => {
  const { t } = useTranslation();
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [songNumbers, setSongNumbers] = useState(['', '', '']);

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

    // Validar que al menos una canción sea ingresada
    const validSongs = songNumbers.filter(num => num.trim() !== '');
    if (validSongs.length === 0) {
      setError('Ingresa al menos un número de canción');
      setLoading(false);
      return;
    }

    try {
      const response = await postApi('canciones/solicitud', {
        clienteId: currentUser._id,
        mesaId: currentUser.mesaId,
        canciones: validSongs.map(num => parseInt(num)),
      });

      if (response.success) {
        setSuccess(true);
        setSongNumbers(['', '', '']);
      } else {
        setError(response.message || 'Error al enviar la solicitud');
      }
    } catch (error) {
      console.error('Error al enviar solicitud:', error);
      setError('Error al enviar la solicitud');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-dark-card p-6 rounded-lg border border-white/10">
      <h2 className="text-2xl font-bold mb-6 text-white">{t('canciones')}</h2>
      
      <div className="grid md:grid-cols-2 gap-8">
        {/* Columna izquierda - QR Code */}
        <div className="bg-dark-light p-6 rounded-lg text-center">
          <h3 className="text-lg font-semibold text-white mb-4">Escanea para ver el catálogo</h3>
          <div className="bg-white p-4 rounded-lg inline-block mb-4">
            <QRCode 
              value={`${window.location.origin}/catalogo-canciones`}
              size={200}
              level="H"
              includeMargin={true}
            />
          </div>
          <p className="text-white/70 text-sm">
            Escanea el código QR para ver el catálogo completo de canciones disponibles
          </p>
        </div>

        {/* Columna derecha - Formulario */}
        <div className="bg-dark-light p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-white mb-4">Solicitar Canciones</h3>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              {songNumbers.map((number, index) => (
                <div key={index}>
                  <label className="block text-sm font-medium text-white/70 mb-1">
                    Canción {index + 1}
                  </label>
                  <input
                    type="number"
                    value={number}
                    onChange={(e) => handleSongNumberChange(index, e.target.value)}
                    placeholder="Ingresa el número de la canción"
                    className="w-full px-4 py-2 bg-dark-card border border-white/10 rounded-md text-white placeholder-white/30 focus:outline-none focus:border-primary"
                  />
                </div>
              ))}
            </div>

            {error && (
              <div className="mt-4 p-3 bg-red-500/20 border border-red-500/50 rounded-md">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            {success && (
              <div className="mt-4 p-3 bg-green-500/20 border border-green-500/50 rounded-md">
                <p className="text-green-400 text-sm">Solicitud enviada correctamente</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-6 w-full py-2 px-4 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Enviando...' : 'Enviar Solicitud'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Canciones;
