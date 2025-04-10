import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getApi } from '../../../services/api';

// Imagen por defecto como variable constante
const DEFAULT_IMAGE = '/images/productos/default-producto.jpg';

const Bebidas = () => {
  const { t } = useTranslation();
  const [bebidas, setBebidas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('todas');

  useEffect(() => {
    const fetchBebidas = async () => {
      try {
        setLoading(true);
        console.log('Solicitando bebidas...');
        const response = await getApi('productos/categoria/bebidas');
        console.log('Respuesta de bebidas:', response);
        
        if (response.success) {
          console.log(`Se recibieron ${response.data.length} bebidas:`, response.data);
          setBebidas(response.data);
          // Extract unique categories
          const uniqueCategories = [...new Set(response.data.map(bebida => bebida.categoria || 'sin-categoria'))];
          setCategories(uniqueCategories);
        } else {
          console.error('Error en la respuesta:', response);
          setError('Error al cargar las bebidas');
        }
      } catch (error) {
        console.error('Error fetching bebidas:', error);
        setError('Error al cargar las bebidas');
      } finally {
        setLoading(false);
      }
    };

    fetchBebidas();
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

  // Filtrar bebidas por categoría
  const filteredBebidas = selectedCategory === 'todas' 
    ? bebidas 
    : bebidas.filter(bebida => bebida.categoria === selectedCategory);

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
        <h2 className="text-2xl font-bold mb-6 text-white">{t('bebidas')}</h2>
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-dark-card p-6 rounded-lg border border-white/10">
      <h2 className="text-2xl font-bold mb-6 text-white">{t('bebidas')}</h2>
      
      {/* Filtros de categoría */}
      <div className="mb-6 flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedCategory('todas')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
            ${selectedCategory === 'todas' 
              ? 'bg-primary text-white' 
              : 'bg-dark-light text-white/70 hover:text-white hover:bg-primary/20'}`}
        >
          Todas
        </button>
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
              ${selectedCategory === category 
                ? 'bg-primary text-white' 
                : 'bg-dark-light text-white/70 hover:text-white hover:bg-primary/20'}`}
          >
            {category}
          </button>
        ))}
      </div>
      
      {filteredBebidas.length === 0 ? (
        <p className="text-white/70">{t('noBebidasDisponibles')}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBebidas.map((bebida) => (
            <div 
              key={bebida._id} 
              className="bg-dark-light rounded-lg overflow-hidden border border-white/5 hover:border-primary/50 transition-all"
            >
              <div className="aspect-w-16 aspect-h-9 bg-dark-lighter">
                <img 
                  src={getImageUrl(bebida.imagenURL)}
                  alt={bebida.nombre}
                  className="object-cover w-full h-48"
                  onError={handleImageError}
                />
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold text-white">{bebida.nombre}</h3>
                  <span className="bg-primary/20 text-primary px-2 py-1 rounded text-xs">
                    {bebida.categoria || 'bebida'}
                  </span>
                </div>
                <div className="flex justify-between items-center mb-4">
                  <p className="text-white text-xl font-bold">
                    ${typeof bebida.precio === 'number' ? bebida.precio.toFixed(2) : bebida.precio}
                  </p>
                  <p className="text-white/70 text-sm">
                    {bebida.estado === 'disponible' && typeof bebida.cantidad === 'number'
                      ? `${bebida.cantidad} ${t('disponibles')}` 
                      : bebida.estado === 'agotado' 
                      ? t('agotado')
                      : ''}
                  </p>
                </div>
                <button
                  onClick={() => handleAddToCart(bebida)}
                  disabled={bebida.estado === 'agotado' || bebida.cantidad <= 0}
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

export default Bebidas;
