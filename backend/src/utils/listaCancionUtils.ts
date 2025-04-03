import mongoose from 'mongoose';
import { IListaCanciones } from '../models/ListaCanciones';
import { IListaCancionResponse, IListaCancionFilters, IPaginatedListaCancionResult } from '../types/listaCancion';
import Cancion from '../models/Cancion';
import User from '../models/User';

/**
 * Formatea un documento de lista de canciones para la respuesta API
 * Si incluirDetallesCanciones es true, incluye información detallada de cada canción
 */
export const formatListaCancionResponse = async (
  listaCancion: IListaCanciones,
  incluirDetallesCanciones: boolean = false
): Promise<IListaCancionResponse> => {
  // Obtener información del cliente
  const cliente = await User.findById(listaCancion.clienteId).select('nombre');
  
  // Obtener información básica de las canciones
  const cancionesInfo = incluirDetallesCanciones
    ? await Promise.all(
        listaCancion.canciones.map(async (numeroCancion) => {
          const cancion = await Cancion.findOne({ numeroCancion });
          return cancion
            ? {
                id: cancion._id.toString(),
                numeroCancion: cancion.numeroCancion,
                titulo: cancion.titulo,
                artista: cancion.artista
              }
            : {
                id: '',
                numeroCancion,
                titulo: 'Canción no encontrada',
                artista: 'Desconocido'
              };
        })
      )
    : listaCancion.canciones.map(numeroCancion => ({
        id: '',
        numeroCancion,
        titulo: '',
        artista: ''
      }));

  return {
    id: listaCancion._id.toString(),
    canciones: cancionesInfo,
    numeroMesa: listaCancion.numeroMesa,
    cliente: {
      id: cliente ? cliente._id.toString() : '',
      nombre: cliente ? cliente.nombre : 'Cliente desconocido'
    },
    estadoReproduccion: listaCancion.estadoReproduccion,
    estadoPago: listaCancion.estadoPago,
    createdAt: listaCancion.createdAt,
    updatedAt: listaCancion.updatedAt
  };
};

/**
 * Construye una consulta MongoDB para filtrar listas de canciones
 */
export const buildListaCancionFilterQuery = (
  filters: IListaCancionFilters = {}
): mongoose.FilterQuery<IListaCanciones> => {
  const query: mongoose.FilterQuery<IListaCanciones> = {};

  if (filters.numeroMesa) {
    query.numeroMesa = filters.numeroMesa;
  }

  if (filters.clienteId) {
    query.clienteId = new mongoose.Types.ObjectId(filters.clienteId);
  }

  if (filters.estadoReproduccion) {
    query.estadoReproduccion = filters.estadoReproduccion;
  }

  if (filters.estadoPago) {
    query.estadoPago = filters.estadoPago;
  }

  // Filtro por rango de fechas
  if (filters.fechaInicio || filters.fechaFin) {
    query.createdAt = {};

    if (filters.fechaInicio) {
      query.createdAt.$gte = new Date(filters.fechaInicio);
    }

    if (filters.fechaFin) {
      query.createdAt.$lte = new Date(filters.fechaFin);
    }
  }

  return query;
};

/**
 * Crea un objeto de respuesta paginada para listas de canciones
 */
export const createPaginatedListaCancionResponse = async (
  listasCanciones: IListaCanciones[],
  page: number,
  limit: number,
  total: number,
  incluirDetallesCanciones: boolean = false
): Promise<IPaginatedListaCancionResult> => {
  const listaFormateada = await Promise.all(
    listasCanciones.map(lista => formatListaCancionResponse(lista, incluirDetallesCanciones))
  );

  return {
    listasCanciones: listaFormateada,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit)
  };
};

/**
 * Verifica si todas las canciones existen
 */
export const verificarCancionesExisten = async (numerosCanciones: number[]): Promise<boolean> => {
  const cancionesEncontradas = await Cancion.countDocuments({
    numeroCancion: { $in: numerosCanciones }
  });

  return cancionesEncontradas === numerosCanciones.length;
};

/**
 * Verifica si el estado de reproducción es válido
 */
export const isValidEstadoReproduccion = (estado: string): boolean => {
  return ['pendiente', 'en reproduccion', 'finalizado'].includes(estado);
};

/**
 * Verifica si el estado de pago es válido
 */
export const isValidEstadoPago = (estado: string): boolean => {
  return ['pendiente', 'pagado', 'gratis'].includes(estado);
}; 