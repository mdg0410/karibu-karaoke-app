import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getApi } from '../../../services/api';

// Imagen por defecto como variable constante
const DEFAULT_IMAGE = '/images/productos/default-producto.jpg';

const Comida = () => {
  const { t } = useTranslation();
  const [comidas, setComidas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchComidas = async () => {
      try {
        setLoading(true);
        console.log('Solicitando comidas...');
        const response = await getApi('productos/categoria/comida');
        console.log('Respuesta de comidas:', response);
        
        if (response.success) {
          console.log(`Se recibieron ${response.data.length} comidas:`, response.data);
          setComidas(response.data);
        } else {
          console.error('Error en la respuesta:', response);
          setError('Error al cargar la comida');
        }
      } catch (error) {
        console.error('Error fetching comidas:', error);
        setError('Error al cargar la comida');
      } finally {
        setLoading(false);
      }
    };

    fetchComidas();
  }, []);

  // Función para determinar la URL de la imagen correcta
  const getImageUrl = (imagenURL) => {
    if (!imagenURL) return DEFAULT_IMAGE;
    if (imagenURL.startsWith('http')) return imagenURL;
    return `/images/productos/${imagenURL}`;
  };

  // Función para manejar errores de imagen - evitando el bucle
  const handleImageError = (e) => {
    // Prevenimos el bucle infinito verificando que la fuente actual no sea ya la default
    if (e.target.src !== DEFAULT_IMAGE) {
      console.log('Imagen no encontrada, usando default');
      e.target.src = DEFAULT_IMAGE;
    }
  };

  // Función para añadir al carrito (a implementar)
  const handleAddToCart = (producto) => {
    console.log('Añadir al carrito:', producto);
    // Implementar lógica para añadir al carrito
  };

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
        <h2 className="text-2xl font-bold mb-6 text-white">{t('comida')}</h2>
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-dark-card p-6 rounded-lg border border-white/10">
      <h2 className="text-2xl font-bold mb-6 text-white">{t('comida')}</h2>
      
      {comidas.length === 0 ? (
        <p className="text-white/70">{t('noComidaDisponible')}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {comidas.map((comida) => (
            <div 
              key={comida._id} 
              className="bg-dark-light rounded-lg overflow-hidden border border-white/5 hover:border-primary/50 transition-all"
            >
              <div className="aspect-w-16 aspect-h-9 bg-dark-lighter">
                <img 
                  src={getImageUrl(comida.imagenURL)}
                  alt={comida.nombre}
                  className="object-cover w-full h-48"
                  onError={handleImageError}
                />
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold text-white">{comida.nombre}</h3>
                  <span className="bg-primary/20 text-primary px-2 py-1 rounded text-xs">
                    {comida.categoria || 'comida'}
                  </span>
                </div>
                <div className="flex justify-between items-center mb-4">
                  <p className="text-white text-xl font-bold">
                    ${typeof comida.precio === 'number' ? comida.precio.toFixed(2) : comida.precio}
                  </p>
                  <p className="text-white/70 text-sm">
                    {comida.estado === 'disponible' && typeof comida.cantidad === 'number'
                      ? `${comida.cantidad} ${t('disponibles')}` 
                      : comida.estado === 'agotado' 
                      ? t('agotado')
                      : ''}
                  </p>
                </div>
                <button
                  onClick={() => handleAddToCart(comida)}
                  disabled={comida.estado === 'agotado' || comida.cantidad <= 0}
                  className="w-full py-2 px-4 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors disabled:bg-gray-700 disabled:text-gray-400"
                >
                  {t('Agregar al Carrito')}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Comida;
