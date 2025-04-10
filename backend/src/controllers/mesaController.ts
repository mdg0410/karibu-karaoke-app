import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Mesa, { IMesa, IHistorialMesa } from '../models/Mesa';
import { IMesaFilters, IMesaPaginationOptions } from '../types/mesa';
import { buildMesaFilterQuery, formatMesaResponse } from '../utils/mesaUtils';

// Obtener todas las mesas con filtros y paginación opcional
export const getMesas = async (req: Request, res: Response) => {
  try {
    // Extraer parámetros de consulta
    const filters: IMesaFilters = {
      estado: req.query.estado as any,
      capacidadMin: req.query.capacidadMin ? parseInt(req.query.capacidadMin as string) : undefined,
      capacidadMax: req.query.capacidadMax ? parseInt(req.query.capacidadMax as string) : undefined,
      fechaDesde: req.query.fechaDesde ? new Date(req.query.fechaDesde as string) : undefined,
      fechaHasta: req.query.fechaHasta ? new Date(req.query.fechaHasta as string) : undefined
    };

    // Opciones de paginación
    const paginationOptions: IMesaPaginationOptions = {
      page: req.query.page ? parseInt(req.query.page as string) : 1,
      limit: req.query.limit ? parseInt(req.query.limit as string) : 10,
      sortBy: req.query.sortBy as string || 'numero',
      order: (req.query.order as 'asc' | 'desc') || 'asc'
    };

    // Construir query de filtros
    const filterQuery = buildMesaFilterQuery(filters);
    
    // Ejecutar consulta con paginación
    const skip = (paginationOptions.page - 1) * paginationOptions.limit;
    
    // Ordenamiento
    const sortOption: any = {};
    if (paginationOptions.sortBy) {
      sortOption[paginationOptions.sortBy] = paginationOptions.order === 'asc' ? 1 : -1;
    } else {
      sortOption['numero'] = 1; // Valor por defecto
    }
    
    // Obtener total de documentos para la paginación
    const total = await Mesa.countDocuments(filterQuery);
    
    // Obtener mesas con los filtros aplicados
    const mesas = await Mesa.find(filterQuery)
      .sort(sortOption)
      .skip(skip)
      .limit(paginationOptions.limit);
    
    // Calcular total de páginas
    const totalPages = Math.ceil(total / paginationOptions.limit);
    
    // Formatear respuesta
    const formattedMesas = mesas.map(mesa => formatMesaResponse(mesa));
    
    return res.status(200).json({
      success: true,
      mesas: formattedMesas,
      pagination: {
        total,
        page: paginationOptions.page,
        limit: paginationOptions.limit,
        totalPages
      }
    });
  } catch (error) {
    console.error('Error al obtener mesas:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al obtener las mesas',
      error: (error as Error).message
    });
  }
};

// Obtener una mesa por ID
export const getMesaById = async (req: Request, res: Response) => {
  try {
    const mesaId = req.params.id;
    
    const mesa = await Mesa.findById(mesaId);
    
    if (!mesa) {
      return res.status(404).json({
        success: false,
        message: 'Mesa no encontrada'
      });
    }
    
    // Formatear la respuesta
    const formattedMesa = formatMesaResponse(mesa);
    
    return res.status(200).json({
      success: true,
      mesa: formattedMesa
    });
  } catch (error) {
    console.error('Error al obtener mesa por ID:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al obtener la mesa',
      error: (error as Error).message
    });
  }
};

// Crear una nueva mesa
export const createMesa = async (req: Request, res: Response) => {
  try {
    const { numero, capacidad, estado } = req.body;
    
    // Crear la nueva mesa
    const newMesa = new Mesa({
      numero,
      capacidad,
      estado: estado || 'disponible',
      historial: []
    });
    
    // Guardar en la base de datos
    await newMesa.save();
    
    // Formatear la respuesta
    const formattedMesa = formatMesaResponse(newMesa);
    
    return res.status(201).json({
      success: true,
      message: 'Mesa creada exitosamente',
      mesa: formattedMesa
    });
  } catch (error) {
    console.error('Error al crear mesa:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al crear la mesa',
      error: (error as Error).message
    });
  }
};

// Actualizar una mesa
export const updateMesa = async (req: Request, res: Response) => {
  try {
    const mesaId = req.params.id;
    const { capacidad, estado } = req.body;
    
    // Buscar la mesa
    const mesa = await Mesa.findById(mesaId);
    
    if (!mesa) {
      return res.status(404).json({
        success: false,
        message: 'Mesa no encontrada'
      });
    }
    
    // Actualizar los campos
    if (capacidad !== undefined) {
      mesa.capacidad = capacidad;
    }
    
    if (estado !== undefined) {
      mesa.estado = estado;
    }
    
    // Guardar los cambios
    await mesa.save();
    
    // Formatear la respuesta
    const formattedMesa = formatMesaResponse(mesa);
    
    return res.status(200).json({
      success: true,
      message: 'Mesa actualizada exitosamente',
      mesa: formattedMesa
    });
  } catch (error) {
    console.error('Error al actualizar mesa:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al actualizar la mesa',
      error: (error as Error).message
    });
  }
};

// Eliminar una mesa
export const deleteMesa = async (req: Request, res: Response) => {
  try {
    const mesaId = req.params.id;
    
    const result = await Mesa.findByIdAndDelete(mesaId);
    
    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'Mesa no encontrada'
      });
    }
    
    return res.status(200).json({
      success: true,
      message: 'Mesa eliminada exitosamente'
    });
  } catch (error) {
    console.error('Error al eliminar mesa:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al eliminar la mesa',
      error: (error as Error).message
    });
  }
};

// Cambiar el estado de una mesa y registrar en el historial
export const cambiarEstadoMesa = async (req: Request, res: Response) => {
  try {
    const mesaId = req.params.id;
    const { estado, usuarioId, fechaInicio = new Date(), fechaFin } = req.body;
    
    // Iniciar una sesión de transacción
    const session = await mongoose.startSession();
    session.startTransaction();
    
    try {
      // Buscar la mesa
      const mesa = await Mesa.findById(mesaId).session(session);
      
      if (!mesa) {
        await session.abortTransaction();
        return res.status(404).json({
          success: false,
          message: 'Mesa no encontrada'
        });
      }
      
      // Si el estado es "ocupada" y cambia a "disponible", cerrar el registro en el historial
      if (mesa.estado === 'ocupada' && estado === 'disponible') {
        // Buscar el último registro sin fechaFin
        const ultimoRegistroIndex = mesa.historial.findIndex(reg => !reg.fechaFin);
        
        if (ultimoRegistroIndex !== -1) {
          mesa.historial[ultimoRegistroIndex].fechaFin = fechaFin || new Date();
        }
      }
      
      // Cambiar el estado de la mesa
      mesa.estado = estado;
      
      // Si el estado cambia a "ocupada", agregar un nuevo registro al historial
      if (estado === 'ocupada') {
        mesa.historial.push({
          usuarioId: new mongoose.Types.ObjectId(usuarioId),
          fechaInicio,
          estado
        });
      }
      
      // Guardar los cambios
      await mesa.save({ session });
      
      // Confirmar la transacción
      await session.commitTransaction();
      
      // Formatear la respuesta
      const formattedMesa = formatMesaResponse(mesa);
      
      return res.status(200).json({
        success: true,
        message: `Estado de mesa cambiado a '${estado}' exitosamente`,
        mesa: formattedMesa
      });
    } catch (error) {
      // Si hay un error, abortar la transacción
      await session.abortTransaction();
      throw error;
    } finally {
      // Finalizar la sesión
      session.endSession();
    }
  } catch (error) {
    console.error('Error al cambiar estado de mesa:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al cambiar el estado de la mesa',
      error: (error as Error).message
    });
  }
};

// Obtener el historial de una mesa
export const getHistorialMesa = async (req: Request, res: Response) => {
  try {
    const mesaId = req.params.id;
    
    const mesa = await Mesa.findById(mesaId).populate('historial.usuarioId', 'nombre');
    
    if (!mesa) {
      return res.status(404).json({
        success: false,
        message: 'Mesa no encontrada'
      });
    }
    
    // Formatear el historial para incluir el nombre del usuario
    const historialFormateado = mesa.historial.map(item => {
      const historialItem = item as any;
      return {
        id: historialItem._id,
        usuarioId: historialItem.usuarioId._id,
        nombreUsuario: historialItem.usuarioId.nombre,
        fechaInicio: historialItem.fechaInicio,
        fechaFin: historialItem.fechaFin,
        estado: historialItem.estado
      };
    });
    
    return res.status(200).json({
      success: true,
      numeroMesa: mesa.numero,
      historial: historialFormateado
    });
  } catch (error) {
    console.error('Error al obtener historial de mesa:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al obtener el historial de la mesa',
      error: (error as Error).message
    });
  }
};

// Obtener mesas disponibles
export const getMesasDisponibles = async (req: Request, res: Response) => {
  try {
    const capacidadMin = req.query.capacidadMin 
      ? parseInt(req.query.capacidadMin as string) 
      : undefined;
    
    const query: any = { estado: 'disponible' };
    
    if (capacidadMin) {
      query.capacidad = { $gte: capacidadMin };
    }
    
    const mesas = await Mesa.find(query).sort({ numero: 1 });
    
    // Formatear las respuestas
    const formattedMesas = mesas.map(mesa => formatMesaResponse(mesa));
    
    return res.status(200).json({
      success: true,
      mesas: formattedMesas
    });
  } catch (error) {
    console.error('Error al obtener mesas disponibles:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al obtener las mesas disponibles',
      error: (error as Error).message
    });
  }
}; 