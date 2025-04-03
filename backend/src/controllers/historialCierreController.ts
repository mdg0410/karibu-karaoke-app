import { Request, Response } from 'express';
import mongoose from 'mongoose';
import HistorialCierre, { IHistorialCierre } from '../models/HistorialCierre';
import {
  IHistorialCierreCreate,
  IHistorialCierreUpdate,
  IHistorialCierreCerrar,
  IHistorialCierreFilters,
  IHistorialCierrePaginationOptions
} from '../types/historialCierre';
import { AuthenticatedRequest } from '../types/express';
import Pedido from '../models/Pedido';
import User from '../models/User';

/**
 * Obtener todos los historiales de cierre con filtros y paginación
 * @route GET /api/historial-cierre
 * @access Privado (admin, trabajador)
 */
export const getHistorialesCierre = async (req: AuthenticatedRequest, res: Response) => {
  try {
    // Extraer parámetros de paginación y ordenamiento
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const sortBy = (req.query.sortBy as string) || 'createdAt';
    const sortOrder = (req.query.sortOrder as string) || 'desc';
    
    // Construir consulta
    const query: any = {};
    
    // Aplicar filtros si existen
    if (req.query.abierto !== undefined) {
      query.abierto = req.query.abierto === 'true';
    }
    
    if (req.query.fechaDesde) {
      if (!query.fechaApertura) query.fechaApertura = {};
      query.fechaApertura.$gte = new Date(req.query.fechaDesde as string);
    }
    
    if (req.query.fechaHasta) {
      if (!query.fechaApertura) query.fechaApertura = {};
      query.fechaApertura.$lte = new Date(req.query.fechaHasta as string);
    }
    
    // Contar total de documentos
    const total = await HistorialCierre.countDocuments(query);
    
    // Obtener historiales paginados
    const historiales = await HistorialCierre.find(query)
      .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('usuarioApertura', 'nombre')
      .populate('usuarioCierre', 'nombre');
    
    return res.status(200).json({
      success: true,
      data: {
        historiales,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Error al obtener historiales de cierre:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al obtener los historiales de cierre',
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};

/**
 * Obtener un historial de cierre por ID
 * @route GET /api/historial-cierre/:id
 * @access Privado (admin, trabajador)
 */
export const getHistorialCierreById = async (req: AuthenticatedRequest, res: Response) => {
  try {
    // El historial ya se ha obtenido en el middleware verificarHistorialCierreExiste
    const historial = req.historialCierre;
    
    await historial?.populate('usuarioApertura', 'nombre');
    await historial?.populate('usuarioCierre', 'nombre');
    
    return res.status(200).json({
      success: true,
      data: historial
    });
  } catch (error) {
    console.error('Error al obtener historial de cierre:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al obtener el historial de cierre',
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};

/**
 * Obtener el historial de cierre actualmente abierto
 * @route GET /api/historial-cierre/actual
 * @access Privado (admin, trabajador)
 */
export const getHistorialCierreActual = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const historialAbierto = await HistorialCierre.findOne({ abierto: true })
      .populate('usuarioApertura', 'nombre')
      .populate('usuarioCierre', 'nombre');
    
    if (!historialAbierto) {
      return res.status(404).json({
        success: false,
        message: 'No hay un historial de cierre abierto actualmente'
      });
    }
    
    return res.status(200).json({
      success: true,
      data: historialAbierto
    });
  } catch (error) {
    console.error('Error al obtener historial de cierre actual:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al obtener el historial de cierre actual',
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};

/**
 * Crear un nuevo historial de cierre (apertura)
 * @route POST /api/historial-cierre
 * @access Privado (admin, trabajador)
 */
export const createHistorialCierre = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { cajaInicial, observaciones } = req.body;
    
    // Crear el historial de cierre
    const nuevoHistorial = new HistorialCierre({
      cajaInicial,
      usuarioApertura: new mongoose.Types.ObjectId(req.user.id),
      observaciones,
      abierto: true,
      fechaApertura: new Date()
    });
    
    await nuevoHistorial.save();
    
    // Obtener el historial con referencias pobladas
    const historialPopulado = await HistorialCierre.findById(nuevoHistorial._id)
      .populate('usuarioApertura', 'nombre');
    
    return res.status(201).json({
      success: true,
      message: 'Historial de cierre creado exitosamente',
      data: historialPopulado
    });
  } catch (error) {
    console.error('Error al crear historial de cierre:', error);
    return res.status(400).json({
      success: false,
      message: 'Error al crear el historial de cierre',
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};

/**
 * Actualizar un historial de cierre
 * @route PUT /api/historial-cierre/:id
 * @access Privado (admin)
 */
export const updateHistorialCierre = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { cajaInicial, observaciones, abierto } = req.body;
    
    // El historial ya se ha obtenido en el middleware verificarHistorialCierreExiste
    const historial = req.historialCierre;
    
    // Actualizar campos
    if (cajaInicial !== undefined) historial!.cajaInicial = cajaInicial;
    if (observaciones !== undefined) historial!.observaciones = observaciones;
    if (abierto !== undefined) historial!.abierto = abierto;
    
    await historial!.save();
    
    await historial?.populate('usuarioApertura', 'nombre');
    await historial?.populate('usuarioCierre', 'nombre');
    
    return res.status(200).json({
      success: true,
      message: 'Historial de cierre actualizado exitosamente',
      data: historial
    });
  } catch (error) {
    console.error('Error al actualizar historial de cierre:', error);
    return res.status(400).json({
      success: false,
      message: 'Error al actualizar el historial de cierre',
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};

/**
 * Cerrar un historial de cierre
 * @route PATCH /api/historial-cierre/:id/cerrar
 * @access Privado (admin, trabajador)
 */
export const cerrarHistorialCierre = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { cajaFinal, efectivoReal, observaciones } = req.body;
    
    // El historial ya se ha obtenido en el middleware verificarHistorialCierreExiste
    const historial = req.historialCierre!;
    
    // Calcular ventas en efectivo y tarjeta
    const ventasData = await Pedido.aggregate([
      {
        $match: {
          createdAt: { 
            $gte: historial.fechaApertura,
            $lte: new Date()
          },
          estado: 'entregado'
        }
      },
      {
        $group: {
          _id: '$formaPago',
          total: { $sum: '$total' }
        }
      }
    ]);
    
    const ventasEfectivo = ventasData.find(item => item._id === 'efectivo')?.total || 0;
    const ventasTarjeta = ventasData.find(item => item._id === 'tarjeta')?.total || 0;
    const totalVentas = ventasEfectivo + ventasTarjeta;
    
    // Calcular efectivo teórico en caja
    const efectivoCalculado = historial.cajaInicial + ventasEfectivo;
    
    // Actualizar historial
    historial.cajaFinal = cajaFinal;
    historial.efectivoReal = efectivoReal;
    historial.efectivoCalculado = efectivoCalculado;
    historial.diferencia = efectivoReal - efectivoCalculado;
    historial.ventasEfectivo = ventasEfectivo;
    historial.ventasTarjeta = ventasTarjeta;
    historial.totalVentas = totalVentas;
    historial.totalIngresado = ventasEfectivo + ventasTarjeta;
    historial.fechaCierre = new Date();
    historial.usuarioCierre = new mongoose.Types.ObjectId(req.user.id);
    historial.abierto = false;
    
    if (observaciones) {
      historial.observaciones = observaciones;
    }
    
    await historial.save();
    
    // Obtener historial actualizado con referencias pobladas
    const historialActualizado = await HistorialCierre.findById(historial._id)
      .populate('usuarioApertura', 'nombre')
      .populate('usuarioCierre', 'nombre');
    
    return res.status(200).json({
      success: true,
      message: 'Historial de cierre cerrado exitosamente',
      data: historialActualizado
    });
  } catch (error) {
    console.error('Error al cerrar historial de cierre:', error);
    return res.status(400).json({
      success: false,
      message: 'Error al cerrar el historial de cierre',
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};

/**
 * Eliminar un historial de cierre
 * @route DELETE /api/historial-cierre/:id
 * @access Privado (admin)
 */
export const deleteHistorialCierre = async (req: AuthenticatedRequest, res: Response) => {
  try {
    // El historial ya se ha obtenido en el middleware verificarHistorialCierreExiste
    const historial = req.historialCierre;
    
    await HistorialCierre.findByIdAndDelete(historial!._id);
    
    return res.status(200).json({
      success: true,
      message: 'Historial de cierre eliminado exitosamente'
    });
  } catch (error) {
    console.error('Error al eliminar historial de cierre:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al eliminar el historial de cierre',
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
}; 