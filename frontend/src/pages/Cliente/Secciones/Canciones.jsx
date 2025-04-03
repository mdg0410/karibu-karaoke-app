import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../../context/AuthContext';
import { postApi, getApi } from '../../../services/api';

const Canciones = () => {
  const { t } = useTranslation();
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [songNumbers, setSongNumbers] = useState(['', '', '']);
  const [canciones, setCanciones] = useState([]);

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

  useEffect(() => {
    const fetchCanciones = async () => {
      try {
        setLoading(true);
        const response = await getApi('canciones');
        if (response.success) {
          setCanciones(response.data);
        } else {
          setError('Error al cargar las canciones');
        }
      } catch (error) {
        console.error('Error fetching canciones:', error);
        setError('Error al cargar las canciones');
      } finally {
        setLoading(false);
      }
    };

    fetchCanciones();
  }, []);

  if (loading) {
    return (
      <div className="bg-dark-card p-6 rounded-lg border border-white/10">
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-dark-card p-6 rounded-lg border border-white/10">
        <h2 className="text-2xl font-bold mb-6 text-white">{t('canciones')}</h2>
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-dark-card p-6 rounded-lg border border-white/10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Columna izquierda - QR Code */}
        <div className="flex flex-col items-center justify-center p-6 bg-dark-light rounded-lg border border-white/5">
          <div className="w-64 h-64 mb-4">
            <img
              src="/images/Cancionero.jpeg"
              alt="Cancionero QR"
              className="w-full h-full object-contain"
            />
          </div>
          <p className="text-white/70 text-center mt-4">
            Escanea el código QR para ver el catálogo completo de canciones disponibles
          </p>
        </div>

        {/* Columna derecha - Lista de canciones */}
        <div className="overflow-hidden">
          <h3 className="text-xl font-semibold mb-4 text-white">
            {t('cancionesRecientes')}
          </h3>
          <div className="overflow-y-auto max-h-[400px] pr-2 space-y-2">
            {canciones.length === 0 ? (
              <p className="text-white/70">{t('noCancionesDisponibles')}</p>
            ) : (
              canciones.map((cancion) => (
                <div
                  key={cancion._id}
                  className="bg-dark p-4 rounded-lg border border-white/5 hover:border-primary/50 transition-all"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-white font-medium">{cancion.titulo}</h4>
                      <p className="text-white/70 text-sm">{cancion.artista}</p>
                    </div>
                    <span className="bg-primary/20 text-primary px-2 py-1 rounded text-xs">
                      {cancion.genero}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Canciones;
