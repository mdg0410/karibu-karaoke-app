import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Pedido, { IPedido } from '../models/Pedido';
import Producto from '../models/Producto';
import User from '../models/User';
import { 
  formatPedidoResponse,
  buildPedidoFilterQuery,
  createPaginatedPedidoResponse,
  calcularSubtotal,
  isValidEstadoTransition
} from '../utils/pedidoUtils';
import { 
  IPedidoCreate, 
  IPedidoUpdate, 
  IAgregarProducto,
  ICambioEstadoPedido,
  IPedidoFilters,
  IPedidoPaginationOptions
} from '../types/pedido';

// Interfaz para Request con user autenticado
interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    rol: string;
  };
}

/**
 * Crear un nuevo pedido
 */
export const crearPedido = async (req: Request, res: Response) => {
  try {
    const { numeroMesa, clienteId, detalles, estado = 'pendiente' } = req.body as IPedidoCreate;

    // Verificar que el cliente exista
    const clienteExiste = await User.findById(clienteId);
    if (!clienteExiste) {
      return res.status(404).json({ message: 'El cliente no existe' });
    }

    // Procesar los detalles del pedido
    const detallesProcesados = [];
    let totalPedido = 0;

    for (const detalle of detalles) {
      const producto = await Producto.findById(detalle.productoId);
      if (!producto) {
        return res.status(404).json({ 
          message: `El producto con ID ${detalle.productoId} no existe` 
        });
      }

      // Usar el precio del producto si no se proporciona
      const precioUnitario = detalle.precioUnitario || producto.precio;
      const subtotal = calcularSubtotal(detalle.cantidad, precioUnitario);
      
      detallesProcesados.push({
        productoId: producto._id,
        cantidad: detalle.cantidad,
        precioUnitario,
        subtotal
      });

      totalPedido += subtotal;
    }

    // Crear el pedido
    const nuevoPedido = new Pedido({
      numeroMesa,
      clienteId,
      detalles: detallesProcesados,
      estado,
      total: totalPedido,
      historialCambios: []
    });

    await nuevoPedido.save();

    return res.status(201).json({
      message: 'Pedido creado exitosamente',
      pedido: formatPedidoResponse(nuevoPedido)
    });
  } catch (error) {
    console.error('Error al crear pedido:', error);
    return res.status(500).json({ message: 'Error al crear el pedido' });
  }
};

/**
 * Obtener todos los pedidos con filtros y paginación
 */
export const obtenerPedidos = async (req: Request, res: Response) => {
  try {
    // Extraer parámetros de paginación y ordenamiento
    const { 
      page = 1, 
      limit = 10, 
      sortBy = 'createdAt', 
      order = 'desc' 
    } = req.query as unknown as IPedidoPaginationOptions;

    // Extraer filtros
    const filters: IPedidoFilters = {
      numeroMesa: req.query.numeroMesa ? Number(req.query.numeroMesa) : undefined,
      clienteId: req.query.clienteId as string,
      estado: req.query.estado as any,
      fechaDesde: req.query.fechaDesde ? new Date(req.query.fechaDesde as string) : undefined,
      fechaHasta: req.query.fechaHasta ? new Date(req.query.fechaHasta as string) : undefined,
      trabajadorId: req.query.trabajadorId as string,
      totalMin: req.query.totalMin ? Number(req.query.totalMin) : undefined,
      totalMax: req.query.totalMax ? Number(req.query.totalMax) : undefined
    };

    // Construir la consulta con los filtros
    const query = buildPedidoFilterQuery(filters);

    // Contar el total de documentos que coinciden con los filtros
    const total = await Pedido.countDocuments(query);

    // Obtener los pedidos paginados
    const pedidos = await Pedido.find(query)
      .sort({ [sortBy]: order === 'asc' ? 1 : -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    // Crear respuesta paginada
    const response = createPaginatedPedidoResponse(pedidos, page, limit, total);
    
    return res.status(200).json(response);
  } catch (error) {
    console.error('Error al obtener pedidos:', error);
    return res.status(500).json({ message: 'Error al obtener los pedidos' });
  }
};

/**
 * Obtener un pedido por su ID
 */
export const obtenerPedidoPorId = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const pedido = await Pedido.findById(id);
    if (!pedido) {
      return res.status(404).json({ message: 'Pedido no encontrado' });
    }

    return res.status(200).json({
      pedido: formatPedidoResponse(pedido)
    });
  } catch (error) {
    console.error('Error al obtener pedido:', error);
    return res.status(500).json({ message: 'Error al obtener el pedido' });
  }
};

/**
 * Actualizar un pedido
 */
export const actualizarPedido = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const datosActualizacion = req.body as IPedidoUpdate;

    const pedido = await Pedido.findById(id);
    if (!pedido) {
      return res.status(404).json({ message: 'Pedido no encontrado' });
    }

    // Si se actualizan los detalles, recalcular subtotales y total
    if (datosActualizacion.detalles && datosActualizacion.detalles.length > 0) {
      const detallesProcesados = [];
      let totalPedido = 0;

      for (const detalle of datosActualizacion.detalles) {
        const producto = await Producto.findById(detalle.productoId);
        if (!producto) {
          return res.status(404).json({ 
            message: `El producto con ID ${detalle.productoId} no existe` 
          });
        }

        const precioUnitario = detalle.precioUnitario || producto.precio;
        const subtotal = calcularSubtotal(detalle.cantidad, precioUnitario);
        
        detallesProcesados.push({
          productoId: producto._id,
          cantidad: detalle.cantidad,
          precioUnitario,
          subtotal
        });

        totalPedido += subtotal;
      }

      pedido.detalles = detallesProcesados;
      pedido.total = totalPedido;
    }

    // Si se actualiza el estado, verificar que sea una transición válida
    if (datosActualizacion.estado && datosActualizacion.estado !== pedido.estado) {
      if (!isValidEstadoTransition(pedido.estado, datosActualizacion.estado)) {
        return res.status(400).json({ 
          message: `No se puede cambiar el estado de ${pedido.estado} a ${datosActualizacion.estado}` 
        });
      }

      // Registrar el cambio de estado en el historial
      if (req.user && req.user.id) {
        pedido.historialCambios.push({
          trabajadorId: new mongoose.Types.ObjectId(req.user.id),
          fechaCambio: new Date(),
          estadoAnterior: pedido.estado,
          estadoNuevo: datosActualizacion.estado,
          comentario: datosActualizacion.comentario
        });
      }

      pedido.estado = datosActualizacion.estado;
    }

    await pedido.save();

    return res.status(200).json({
      message: 'Pedido actualizado exitosamente',
      pedido: formatPedidoResponse(pedido)
    });
  } catch (error) {
    console.error('Error al actualizar pedido:', error);
    return res.status(500).json({ message: 'Error al actualizar el pedido' });
  }
};

/**
 * Cambiar el estado de un pedido
 */
export const cambiarEstadoPedido = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { estado, trabajadorId, comentario } = req.body as ICambioEstadoPedido;

    const pedido = await Pedido.findById(id);
    if (!pedido) {
      return res.status(404).json({ message: 'Pedido no encontrado' });
    }

    // Verificar que el trabajador exista
    const trabajador = await User.findById(trabajadorId);
    if (!trabajador) {
      return res.status(404).json({ message: 'El trabajador no existe' });
    }

    // Verificar que el cambio de estado sea válido
    if (!isValidEstadoTransition(pedido.estado, estado)) {
      return res.status(400).json({ 
        message: `No se puede cambiar el estado de ${pedido.estado} a ${estado}` 
      });
    }

    // Registrar el cambio de estado en el historial
    pedido.historialCambios.push({
      trabajadorId: new mongoose.Types.ObjectId(trabajadorId),
      fechaCambio: new Date(),
      estadoAnterior: pedido.estado,
      estadoNuevo: estado,
      comentario
    });

    pedido.estado = estado;
    await pedido.save();

    return res.status(200).json({
      message: 'Estado del pedido actualizado exitosamente',
      pedido: formatPedidoResponse(pedido)
    });
  } catch (error) {
    console.error('Error al cambiar estado del pedido:', error);
    return res.status(500).json({ message: 'Error al cambiar el estado del pedido' });
  }
};

/**
 * Agregar un producto a un pedido existente
 */
export const agregarProducto = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { productoId, cantidad, precioUnitario } = req.body as IAgregarProducto;

    const pedido = await Pedido.findById(id);
    if (!pedido) {
      return res.status(404).json({ message: 'Pedido no encontrado' });
    }

    // Verificar si el pedido ya está completado o cancelado
    if (pedido.estado === 'entregado' || pedido.estado === 'cancelado') {
      return res.status(400).json({ 
        message: `No se pueden agregar productos a un pedido ${pedido.estado}` 
      });
    }

    // Verificar que el producto exista
    const producto = await Producto.findById(productoId);
    if (!producto) {
      return res.status(404).json({ message: 'El producto no existe' });
    }

    // Usar el precio del producto si no se proporciona
    const precio = precioUnitario || producto.precio;
    const subtotal = calcularSubtotal(cantidad, precio);

    // Verificar si el producto ya está en el pedido
    const detalleExistente = pedido.detalles.findIndex(
      d => d.productoId.toString() === productoId
    );

    if (detalleExistente >= 0) {
      // Actualizar la cantidad y el subtotal del producto existente
      pedido.detalles[detalleExistente].cantidad += cantidad;
      pedido.detalles[detalleExistente].subtotal += subtotal;
    } else {
      // Agregar el nuevo producto al pedido
      pedido.detalles.push({
        productoId: new mongoose.Types.ObjectId(productoId),
        cantidad,
        precioUnitario: precio,
        subtotal
      });
    }

    // Recalcular el total del pedido
    pedido.total = pedido.detalles.reduce((sum, item) => sum + item.subtotal, 0);
    
    await pedido.save();

    return res.status(200).json({
      message: 'Producto agregado al pedido exitosamente',
      pedido: formatPedidoResponse(pedido)
    });
  } catch (error) {
    console.error('Error al agregar producto al pedido:', error);
    return res.status(500).json({ message: 'Error al agregar producto al pedido' });
  }
};

/**
 * Eliminar un pedido
 */
export const eliminarPedido = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const pedido = await Pedido.findById(id);
    if (!pedido) {
      return res.status(404).json({ message: 'Pedido no encontrado' });
    }

    // Sólo se pueden eliminar pedidos pendientes o cancelados
    if (pedido.estado !== 'pendiente' && pedido.estado !== 'cancelado') {
      return res.status(400).json({ 
        message: `No se puede eliminar un pedido en estado ${pedido.estado}` 
      });
    }

    await Pedido.findByIdAndDelete(id);

    return res.status(200).json({
      message: 'Pedido eliminado exitosamente'
    });
  } catch (error) {
    console.error('Error al eliminar pedido:', error);
    return res.status(500).json({ message: 'Error al eliminar el pedido' });
  }
}; 