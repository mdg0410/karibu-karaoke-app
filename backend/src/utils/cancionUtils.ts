import mongoose from 'mongoose';
import { ICancion } from '../models/Cancion';
import { ICancionFilters, ICancionResponse } from '../types/cancion';

/**
 * Transforma un documento de Cancion a un formato de respuesta API
 */
export const formatCancionResponse = (cancion: ICancion): ICancionResponse => {
  return {
    id: cancion._id.toString(),
    numeroCancion: cancion.numeroCancion,
    titulo: cancion.titulo,
    artista: cancion.artista,
    genero: cancion.genero,
    idioma: cancion.idioma,
    duracion: cancion.duracion,
    estado: cancion.estado,
    popularidad: cancion.popularidad,
    fechaAgregada: cancion.fechaAgregada,
    createdAt: cancion.createdAt,
    updatedAt: cancion.updatedAt
  };
};

/**
 * Valida si el formato de la duración es correcto (MM:SS)
 */
export const validarFormatoDuracion = (duracion: string): boolean => {
  return /^([0-5]?[0-9]):([0-5][0-9])$/.test(duracion);
};

/**
 * Construye un objeto de filtro para consultas de MongoDB basado en los filtros proporcionados
 */
export const buildCancionFilterQuery = (filters: ICancionFilters): any => {
  const query: any = {};
  
  // Filtro por número de canción
  if (filters.numeroCancion) {
    query.numeroCancion = filters.numeroCancion;
  }
  
  // Filtros exactos
  if (filters.estado) {
    query.estado = filters.estado;
  }
  
  if (filters.genero) {
    query.genero = filters.genero;
  }
  
  if (filters.idioma) {
    query.idioma = filters.idioma;
  }
  
  // Filtros de texto con expresiones regulares
  if (filters.titulo) {
    query.titulo = { $regex: new RegExp(filters.titulo, 'i') };
  }
  
  if (filters.artista) {
    query.artista = { $regex: new RegExp(filters.artista, 'i') };
  }
  
  // Filtros de rango para popularidad
  if (filters.popularidadMin !== undefined || filters.popularidadMax !== undefined) {
    query.popularidad = {};
    
    if (filters.popularidadMin !== undefined) {
      query.popularidad.$gte = filters.popularidadMin;
    }
    
    if (filters.popularidadMax !== undefined) {
      query.popularidad.$lte = filters.popularidadMax;
    }
  }
  
  // Búsqueda de texto general (título y artista)
  if (filters.busqueda) {
    const regex = new RegExp(filters.busqueda, 'i');
    query.$or = [
      { titulo: { $regex: regex } },
      { artista: { $regex: regex } }
    ];
  }
  
  return query;
};

/**
 * Incrementa el contador de popularidad de una canción
 */
export const incrementarPopularidad = async (
  cancionId: string,
  incremento: number = 1
): Promise<boolean> => {
  try {
    const Cancion = mongoose.model<ICancion>('Cancion');
    const resultado = await Cancion.updateOne(
      { _id: cancionId },
      { $inc: { popularidad: incremento } }
    );
    
    return resultado.modifiedCount > 0;
  } catch (error) {
    console.error('Error al incrementar popularidad:', error);
    return false;
  }
};

/**
 * Obtiene géneros únicos de canciones
 */
export const obtenerGenerosUnicos = async (): Promise<string[]> => {
  try {
    const Cancion = mongoose.model<ICancion>('Cancion');
    const generos = await Cancion.distinct('genero');
    return generos;
  } catch (error) {
    console.error('Error al obtener géneros únicos:', error);
    return [];
  }
};

/**
 * Obtiene idiomas únicos de canciones
 */
export const obtenerIdiomasUnicos = async (): Promise<string[]> => {
  try {
    const Cancion = mongoose.model<ICancion>('Cancion');
    const idiomas = await Cancion.distinct('idioma');
    return idiomas;
  } catch (error) {
    console.error('Error al obtener idiomas únicos:', error);
    return [];
  }
}; 