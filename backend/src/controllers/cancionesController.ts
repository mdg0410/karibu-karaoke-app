import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Cancion, { ICancion } from '../models/Cancion';
import { ICancionFilters, ICancionPaginationOptions } from '../types/cancion';
import { buildCancionFilterQuery, formatCancionResponse, incrementarPopularidad, obtenerGenerosUnicos, obtenerIdiomasUnicos } from '../utils/cancionUtils';

// Obtener todas las canciones con filtros y paginación
export const getCanciones = async (req: Request, res: Response) => {
  try {
    // Extraer parámetros de consulta
    const filters: ICancionFilters = {
      numeroCancion: req.query.numeroCancion ? parseInt(req.query.numeroCancion as string) : undefined,
      titulo: req.query.titulo as string,
      artista: req.query.artista as string,
      genero: req.query.genero as string,
      idioma: req.query.idioma as string,
      estado: req.query.estado as 'activa' | 'inactiva',
      popularidadMin: req.query.popularidadMin ? parseInt(req.query.popularidadMin as string) : undefined,
      popularidadMax: req.query.popularidadMax ? parseInt(req.query.popularidadMax as string) : undefined,
      busqueda: req.query.busqueda as string
    };

    // Opciones de paginación
    const paginationOptions: ICancionPaginationOptions = {
      page: req.query.page ? parseInt(req.query.page as string) : 1,
      limit: req.query.limit ? parseInt(req.query.limit as string) : 20,
      sortBy: req.query.sortBy as string || 'numeroCancion',
      order: (req.query.order as 'asc' | 'desc') || 'asc'
    };

    // Construir query de filtros
    const filterQuery = buildCancionFilterQuery(filters);
    
    // Ejecutar consulta con paginación
    const skip = (paginationOptions.page - 1) * paginationOptions.limit;
    
    // Ordenamiento
    const sortOption: any = {};
    sortOption[paginationOptions.sortBy || 'numeroCancion'] = paginationOptions.order === 'asc' ? 1 : -1;
    
    // Obtener total de documentos para la paginación
    const total = await Cancion.countDocuments(filterQuery);
    
    // Obtener canciones con los filtros aplicados
    const canciones = await Cancion.find(filterQuery)
      .sort(sortOption)
      .skip(skip)
      .limit(paginationOptions.limit);
    
    // Calcular total de páginas
    const totalPages = Math.ceil(total / paginationOptions.limit);
    
    // Formatear respuesta
    const formattedCanciones = canciones.map(cancion => formatCancionResponse(cancion));
    
    return res.status(200).json({
      success: true,
      canciones: formattedCanciones,
      pagination: {
        total,
        page: paginationOptions.page,
        limit: paginationOptions.limit,
        totalPages
      }
    });
  } catch (error) {
    console.error('Error al obtener canciones:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al obtener las canciones',
      error: (error as Error).message
    });
  }
};

// Obtener una canción por ID
export const getCancionById = async (req: Request, res: Response) => {
  try {
    const cancionId = req.params.id;
    
    const cancion = await Cancion.findById(cancionId);
    
    if (!cancion) {
      return res.status(404).json({
        success: false,
        message: 'Canción no encontrada'
      });
    }
    
    // Formatear la respuesta
    const formattedCancion = formatCancionResponse(cancion);
    
    return res.status(200).json({
      success: true,
      cancion: formattedCancion
    });
  } catch (error) {
    console.error('Error al obtener canción por ID:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al obtener la canción',
      error: (error as Error).message
    });
  }
};

// Crear una nueva canción
export const createCancion = async (req: Request, res: Response) => {
  try {
    const { numeroCancion, titulo, artista, genero, idioma, duracion, estado, popularidad } = req.body;
    
    // Crear la nueva canción
    const newCancion = new Cancion({
      numeroCancion,
      titulo,
      artista,
      genero,
      idioma,
      duracion,
      estado: estado || 'activa',
      popularidad: popularidad || 0,
      fechaAgregada: new Date()
    });
    
    // Guardar en la base de datos
    await newCancion.save();
    
    // Formatear la respuesta
    const formattedCancion = formatCancionResponse(newCancion);
    
    return res.status(201).json({
      success: true,
      message: 'Canción creada exitosamente',
      cancion: formattedCancion
    });
  } catch (error) {
    console.error('Error al crear canción:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al crear la canción',
      error: (error as Error).message
    });
  }
};

// Actualizar una canción
export const updateCancion = async (req: Request, res: Response) => {
  try {
    const cancionId = req.params.id;
    const { titulo, artista, genero, idioma, duracion, estado, popularidad } = req.body;
    
    // Buscar la canción
    const cancion = await Cancion.findById(cancionId);
    
    if (!cancion) {
      return res.status(404).json({
        success: false,
        message: 'Canción no encontrada'
      });
    }
    
    // Actualizar los campos
    if (titulo !== undefined) cancion.titulo = titulo;
    if (artista !== undefined) cancion.artista = artista;
    if (genero !== undefined) cancion.genero = genero;
    if (idioma !== undefined) cancion.idioma = idioma;
    if (duracion !== undefined) cancion.duracion = duracion;
    if (estado !== undefined) cancion.estado = estado;
    if (popularidad !== undefined) cancion.popularidad = popularidad;
    
    // Guardar los cambios
    await cancion.save();
    
    // Formatear la respuesta
    const formattedCancion = formatCancionResponse(cancion);
    
    return res.status(200).json({
      success: true,
      message: 'Canción actualizada exitosamente',
      cancion: formattedCancion
    });
  } catch (error) {
    console.error('Error al actualizar canción:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al actualizar la canción',
      error: (error as Error).message
    });
  }
};

// Eliminar una canción
export const deleteCancion = async (req: Request, res: Response) => {
  try {
    const cancionId = req.params.id;
    
    const result = await Cancion.findByIdAndDelete(cancionId);
    
    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'Canción no encontrada'
      });
    }
    
    return res.status(200).json({
      success: true,
      message: 'Canción eliminada exitosamente'
    });
  } catch (error) {
    console.error('Error al eliminar canción:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al eliminar la canción',
      error: (error as Error).message
    });
  }
};

// Incrementar la popularidad de una canción
export const incrementarPopularidadCancion = async (req: Request, res: Response) => {
  try {
    const cancionId = req.params.id;
    const { incremento = 1 } = req.body;
    
    // Verificar que el incremento sea un número válido
    const incrementoNum = parseInt(incremento);
    if (isNaN(incrementoNum) || incrementoNum < 1) {
      return res.status(400).json({
        success: false,
        message: 'El incremento debe ser un número positivo'
      });
    }
    
    // Buscar y actualizar la canción
    const cancion = await Cancion.findByIdAndUpdate(
      cancionId,
      { $inc: { popularidad: incrementoNum } },
      { new: true }
    );
    
    if (!cancion) {
      return res.status(404).json({
        success: false,
        message: 'Canción no encontrada'
      });
    }
    
    // Formatear la respuesta
    const formattedCancion = formatCancionResponse(cancion);
    
    return res.status(200).json({
      success: true,
      message: 'Popularidad incrementada exitosamente',
      cancion: formattedCancion
    });
  } catch (error) {
    console.error('Error al incrementar popularidad:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al incrementar la popularidad',
      error: (error as Error).message
    });
  }
};

// Obtener las canciones más populares
export const getCancionesPopulares = async (req: Request, res: Response) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
    
    const canciones = await Cancion.find({ estado: 'activa' })
      .sort({ popularidad: -1 })
      .limit(limit);
    
    // Formatear la respuesta
    const formattedCanciones = canciones.map(cancion => formatCancionResponse(cancion));
    
    return res.status(200).json({
      success: true,
      canciones: formattedCanciones
    });
  } catch (error) {
    console.error('Error al obtener canciones populares:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al obtener las canciones populares',
      error: (error as Error).message
    });
  }
};

// Obtener géneros únicos de canciones
export const getGeneros = async (req: Request, res: Response) => {
  try {
    const generos = await obtenerGenerosUnicos();
    
    return res.status(200).json({
      success: true,
      generos
    });
  } catch (error) {
    console.error('Error al obtener géneros:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al obtener los géneros',
      error: (error as Error).message
    });
  }
};

// Obtener idiomas únicos de canciones
export const getIdiomas = async (req: Request, res: Response) => {
  try {
    const idiomas = await obtenerIdiomasUnicos();
    
    return res.status(200).json({
      success: true,
      idiomas
    });
  } catch (error) {
    console.error('Error al obtener idiomas:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al obtener los idiomas',
      error: (error as Error).message
    });
  }
}; 