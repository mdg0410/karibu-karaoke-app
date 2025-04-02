import { Request, Response } from 'express';
import ListaCanciones, { ICancion } from '../models/ListaCanciones';

// Obtener todas las canciones con paginación y filtros
export const getCanciones = async (req: Request, res: Response) => {
  try {
    const {
      page = 1,
      limit = 10,
      genero,
      idioma,
      busqueda,
      ordenar = 'numeroCancion'
    } = req.query;

    const query: any = {};
    
    // Aplicar filtros si existen
    if (genero) query.genero = genero;
    if (idioma) query.idioma = idioma;
    if (busqueda) {
      query.$or = [
        { titulo: { $regex: busqueda, $options: 'i' } },
        { artista: { $regex: busqueda, $options: 'i' } }
      ];
    }

    const [canciones, total] = await Promise.all([
      ListaCanciones.find(query)
        .sort({ [ordenar as string]: 1 })
        .limit(Number(limit))
        .skip((Number(page) - 1) * Number(limit))
        .exec(),
      ListaCanciones.countDocuments(query)
    ]);

    res.json({
      success: true,
      data: canciones,
      totalPaginas: Math.ceil(total / Number(limit)),
      paginaActual: Number(page),
      totalCanciones: total
    });
  } catch (error) {
    console.error('Error al obtener canciones:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener la lista de canciones'
    });
  }
};

// Obtener una canción específica
export const getCancion = async (req: Request, res: Response) => {
  try {
    const cancion = await ListaCanciones.findById(req.params.id);
    if (!cancion) {
      return res.status(404).json({
        success: false,
        message: 'Canción no encontrada'
      });
    }
    res.json({ success: true, data: cancion });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener la canción'
    });
  }
};

// Crear una nueva canción
export const createCancion = async (req: Request, res: Response) => {
  try {
    const nuevaCancion = new ListaCanciones(req.body);
    await nuevaCancion.save();
    res.status(201).json({
      success: true,
      message: 'Canción agregada exitosamente',
      data: nuevaCancion
    });
  } catch (error: any) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'El número de canción ya existe'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Error al crear la canción'
    });
  }
};

// Actualizar una canción
export const updateCancion = async (req: Request, res: Response) => {
  try {
    const cancion = await ListaCanciones.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    
    if (!cancion) {
      return res.status(404).json({
        success: false,
        message: 'Canción no encontrada'
      });
    }
    
    res.json({
      success: true,
      message: 'Canción actualizada exitosamente',
      data: cancion
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al actualizar la canción'
    });
  }
};

// Eliminar una canción
export const deleteCancion = async (req: Request, res: Response) => {
  try {
    const cancion = await ListaCanciones.findByIdAndDelete(req.params.id);
    
    if (!cancion) {
      return res.status(404).json({
        success: false,
        message: 'Canción no encontrada'
      });
    }
    
    res.json({
      success: true,
      message: 'Canción eliminada exitosamente'
    });
  }
  catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al eliminar la canción'
    });
  }
};

// Obtener lista de géneros únicos
export const getGeneros = async (_req: Request, res: Response) => {
  try {
    const generos = await ListaCanciones.distinct('genero');
    res.json({
      success: true,
      data: generos
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener la lista de géneros'
    });
  }
};

// Obtener lista de idiomas únicos
export const getIdiomas = async (_req: Request, res: Response) => {
  try {
    const idiomas = await ListaCanciones.distinct('idioma');
    res.json({
      success: true,
      data: idiomas
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener la lista de idiomas'
    });
  }
}; 