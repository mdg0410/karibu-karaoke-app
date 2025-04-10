import { Request, Response } from 'express';
import mongoose from 'mongoose';
import ListaCanciones, { IListaCanciones } from '../models/ListaCanciones';
import Cancion from '../models/Cancion';
import { 
  formatListaCancionResponse,
  buildListaCancionFilterQuery,
  createPaginatedListaCancionResponse,
  verificarCancionesExisten
} from '../utils/listaCancionUtils';
import {
  IListaCancionCreate,
  IListaCancionUpdate,
  ICambioEstadoReproduccion,
  ICambioEstadoPago,
  IListaCancionFilters,
  IListaCancionPaginationOptions
} from '../types/listaCancion';

// Interfaz para Request con user autenticado
interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    rol: string;
  };
}

/**
 * Obtener todas las listas de canciones con filtros y paginación
 * @route GET /api/lista-canciones
 * @access Privado (admin, trabajador, cliente)
 */
export const getListasCanciones = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = req.user;
    
    if (!user) {
      return res.status(401).json({
        message: 'No autenticado'
      });
    }
    
    // Extraer parámetros de paginación y ordenamiento
    const { 
      page = 1, 
      limit = 10, 
      sortBy = 'createdAt', 
      order = 'desc' 
    } = req.query as unknown as IListaCancionPaginationOptions;
    
    // Extraer filtros
    const filters: IListaCancionFilters = {
      numeroMesa: req.query.numeroMesa ? Number(req.query.numeroMesa) : undefined,
      clienteId: req.query.clienteId as string,
      estadoReproduccion: req.query.estadoReproduccion as any,
      estadoPago: req.query.estadoPago as any,
      fechaInicio: req.query.fechaInicio ? new Date(req.query.fechaInicio as string) : undefined,
      fechaFin: req.query.fechaFin ? new Date(req.query.fechaFin as string) : undefined,
      incluirCanciones: req.query.incluirCanciones === 'true'
    };
    
    // Si el usuario es cliente, solo puede ver sus propias listas
    if (user.rol === 'cliente') {
      filters.clienteId = user.id;
    }
    
    // Construir la consulta
    const query = buildListaCancionFilterQuery(filters);
    
    // Contar total de documentos
    const total = await ListaCanciones.countDocuments(query);
    
    // Obtener listas paginadas
    const listasCanciones = await ListaCanciones.find(query)
      .sort({ [sortBy]: order === 'asc' ? 1 : -1 })
      .skip((page - 1) * limit)
      .limit(limit) as IListaCanciones[];
    
    // Crear respuesta paginada
    const response = await createPaginatedListaCancionResponse(
      listasCanciones,
      page,
      limit,
      total,
      filters.incluirCanciones
    );
    
    return res.status(200).json(response);
  } catch (error) {
    console.error('Error al obtener listas de canciones:', error);
    return res.status(500).json({
      message: 'Error al obtener las listas de canciones',
      error: (error as Error).message
    });
  }
};

/**
 * Obtener una lista de canciones por ID
 * @route GET /api/lista-canciones/:id
 * @access Privado (admin, trabajador, owner)
 */
export const getListaCancionById = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const incluirDetallesCanciones = req.query.incluirCanciones === 'true';
    
    // Verificar si el ID es válido
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: 'ID de lista no válido'
      });
    }
    
    const listaCancion = await ListaCanciones.findById(id) as IListaCanciones;
    
    if (!listaCancion) {
      return res.status(404).json({
        message: 'Lista de canciones no encontrada'
      });
    }
    
    // Formatear la respuesta
    const formattedLista = await formatListaCancionResponse(listaCancion, incluirDetallesCanciones);
    
    return res.status(200).json({
      listaCancion: formattedLista
    });
  } catch (error) {
    console.error('Error al obtener lista de canciones:', error);
    return res.status(500).json({
      message: 'Error al obtener la lista de canciones',
      error: (error as Error).message
    });
  }
};

/**
 * Crear una nueva lista de canciones
 * @route POST /api/lista-canciones
 * @access Privado (admin, trabajador, cliente)
 */
export const createListaCancion = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = req.user;
    
    if (!user) {
      return res.status(401).json({
        message: 'No autenticado'
      });
    }
    
    const datosListaCancion = req.body as IListaCancionCreate;
    
    // Verificar si las canciones existen
    const cancionesExisten = await verificarCancionesExisten(datosListaCancion.canciones);
    
    if (!cancionesExisten) {
      return res.status(400).json({
        message: 'Una o más canciones no existen'
      });
    }
    
    // Crear la lista de canciones
    const nuevaListaCancion = new ListaCanciones({
      canciones: datosListaCancion.canciones,
      numeroMesa: datosListaCancion.numeroMesa,
      clienteId: datosListaCancion.clienteId || user.id,
      estadoReproduccion: datosListaCancion.estadoReproduccion || 'pendiente',
      estadoPago: datosListaCancion.estadoPago || 'pendiente'
    });
    
    await nuevaListaCancion.save();
    
    // Formatear la respuesta
    const formattedLista = await formatListaCancionResponse(nuevaListaCancion, true);
    
    // Incrementar la popularidad de las canciones seleccionadas
    datosListaCancion.canciones.forEach(async (numeroCancion) => {
      await Cancion.findOneAndUpdate(
        { numeroCancion },
        { $inc: { popularidad: 1 } }
      );
    });
    
    return res.status(201).json({
      message: 'Lista de canciones creada exitosamente',
      listaCancion: formattedLista
    });
  } catch (error) {
    console.error('Error al crear lista de canciones:', error);
    return res.status(400).json({
      message: 'Error al crear la lista de canciones',
      error: (error as Error).message
    });
  }
};

/**
 * Actualizar una lista de canciones
 * @route PUT /api/lista-canciones/:id
 * @access Privado (admin, trabajador)
 */
export const updateListaCancion = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const datosActualizacion = req.body as IListaCancionUpdate;
    
    // Verificar si el ID es válido
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: 'ID de lista no válido'
      });
    }
    
    // Verificar si las canciones existen (si se proporcionan)
    if (datosActualizacion.canciones && datosActualizacion.canciones.length > 0) {
      const cancionesExisten = await verificarCancionesExisten(datosActualizacion.canciones);
      
      if (!cancionesExisten) {
        return res.status(400).json({
          message: 'Una o más canciones no existen'
        });
      }
    }
    
    // Actualizar la lista
    const listaCancionActualizada = await ListaCanciones.findByIdAndUpdate(
      id,
      { 
        ...datosActualizacion,
        updatedAt: new Date()
      },
      { new: true }
    ) as IListaCanciones;
    
    if (!listaCancionActualizada) {
      return res.status(404).json({
        message: 'Lista de canciones no encontrada'
      });
    }
    
    // Formatear la respuesta
    const formattedLista = await formatListaCancionResponse(listaCancionActualizada, true);
    
    return res.status(200).json({
      message: 'Lista de canciones actualizada exitosamente',
      listaCancion: formattedLista
    });
  } catch (error) {
    console.error('Error al actualizar lista de canciones:', error);
    return res.status(400).json({
      message: 'Error al actualizar la lista de canciones',
      error: (error as Error).message
    });
  }
};

/**
 * Cambiar el estado de reproducción de una lista
 * @route PATCH /api/lista-canciones/:id/estado-reproduccion
 * @access Privado (admin, trabajador)
 */
export const cambiarEstadoReproduccion = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { estadoReproduccion } = req.body as ICambioEstadoReproduccion;
    
    // Verificar si el ID es válido
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: 'ID de lista no válido'
      });
    }
    
    // Actualizar el estado
    const listaCancionActualizada = await ListaCanciones.findByIdAndUpdate(
      id,
      { 
        estadoReproduccion,
        updatedAt: new Date()
      },
      { new: true }
    ) as IListaCanciones;
    
    if (!listaCancionActualizada) {
      return res.status(404).json({
        message: 'Lista de canciones no encontrada'
      });
    }
    
    // Formatear la respuesta
    const formattedLista = await formatListaCancionResponse(listaCancionActualizada, true);
    
    return res.status(200).json({
      message: `Estado de reproducción cambiado a ${estadoReproduccion}`,
      listaCancion: formattedLista
    });
  } catch (error) {
    console.error('Error al cambiar estado de reproducción:', error);
    return res.status(400).json({
      message: 'Error al cambiar el estado de reproducción',
      error: (error as Error).message
    });
  }
};

/**
 * Cambiar el estado de pago de una lista
 * @route PATCH /api/lista-canciones/:id/estado-pago
 * @access Privado (admin, trabajador)
 */
export const cambiarEstadoPago = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { estadoPago } = req.body as ICambioEstadoPago;
    
    // Verificar si el ID es válido
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: 'ID de lista no válido'
      });
    }
    
    // Actualizar el estado
    const listaCancionActualizada = await ListaCanciones.findByIdAndUpdate(
      id,
      { 
        estadoPago,
        updatedAt: new Date()
      },
      { new: true }
    ) as IListaCanciones;
    
    if (!listaCancionActualizada) {
      return res.status(404).json({
        message: 'Lista de canciones no encontrada'
      });
    }
    
    // Formatear la respuesta
    const formattedLista = await formatListaCancionResponse(listaCancionActualizada, true);
    
    return res.status(200).json({
      message: `Estado de pago cambiado a ${estadoPago}`,
      listaCancion: formattedLista
    });
  } catch (error) {
    console.error('Error al cambiar estado de pago:', error);
    return res.status(400).json({
      message: 'Error al cambiar el estado de pago',
      error: (error as Error).message
    });
  }
};

/**
 * Eliminar una lista de canciones
 * @route DELETE /api/lista-canciones/:id
 * @access Privado (admin)
 */
export const deleteListaCancion = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // Verificar si el ID es válido
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: 'ID de lista no válido'
      });
    }
    
    const resultado = await ListaCanciones.findByIdAndDelete(id);
    
    if (!resultado) {
      return res.status(404).json({
        message: 'Lista de canciones no encontrada'
      });
    }
    
    return res.status(200).json({
      message: 'Lista de canciones eliminada exitosamente'
    });
  } catch (error) {
    console.error('Error al eliminar lista de canciones:', error);
    return res.status(500).json({
      message: 'Error al eliminar la lista de canciones',
      error: (error as Error).message
    });
  }
};

/**
 * Obtener listas de canciones por mesa
 * @route GET /api/lista-canciones/mesa/:numeroMesa
 * @access Privado (admin, trabajador)
 */
export const getListasCancionesPorMesa = async (req: Request, res: Response) => {
  try {
    const { numeroMesa } = req.params;
    const incluirDetallesCanciones = req.query.incluirCanciones === 'true';
    
    // Verificar si el número de mesa es válido
    const mesaNum = parseInt(numeroMesa);
    if (isNaN(mesaNum) || mesaNum <= 0) {
      return res.status(400).json({
        message: 'Número de mesa no válido'
      });
    }
    
    // Buscar listas por mesa
    const listasCanciones = await ListaCanciones.find({ numeroMesa: mesaNum }) as IListaCanciones[];
    
    // Formatear la respuesta
    const listasFormateadas = await Promise.all(
      listasCanciones.map(lista => formatListaCancionResponse(lista, incluirDetallesCanciones))
    );
    
    return res.status(200).json({
      count: listasFormateadas.length,
      listasCanciones: listasFormateadas
    });
  } catch (error) {
    console.error('Error al obtener listas por mesa:', error);
    return res.status(500).json({
      message: 'Error al obtener las listas de canciones por mesa',
      error: (error as Error).message
    });
  }
}; 