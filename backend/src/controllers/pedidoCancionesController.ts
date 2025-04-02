import { Request, Response } from 'express';
import PedidoCanciones from '../models/PedidoCanciones';

// Crear nuevo pedido de canciones
export const crearPedido = async (req: Request, res: Response) => {
  try {
    const { canciones, mesaId } = req.body;
    
    if (!Array.isArray(canciones) || canciones.length === 0 || canciones.length > 3) {
      return res.status(400).json({
        success: false,
        message: 'Debe proporcionar entre 1 y 3 canciones'
      });
    }

    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Usuario no autenticado'
      });
    }

    const nuevoPedido = new PedidoCanciones({
      clienteId: req.user.id,
      mesaId: mesaId,
      canciones
    });

    await nuevoPedido.save();

    res.status(201).json({
      success: true,
      message: 'Pedido de canciones creado exitosamente',
      data: nuevoPedido
    });
  } catch (error) {
    console.error('Error al crear pedido:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear el pedido de canciones'
    });
  }
};

// Obtener todos los pedidos con filtros opcionales
export const obtenerPedidos = async (req: Request, res: Response) => {
  try {
    const {
      clienteId,
      mesaId,
      estadoCancion,
      estadoEspecial,
      fechaInicio,
      fechaFin
    } = req.query;

    const filtro: any = {};

    if (clienteId) filtro.clienteId = clienteId;
    if (mesaId) filtro.mesaId = mesaId;
    if (estadoCancion) filtro.estadoCancion = estadoCancion;
    if (estadoEspecial) filtro.estadoEspecial = Number(estadoEspecial);
    
    if (fechaInicio || fechaFin) {
      filtro.fechaCreacion = {};
      if (fechaInicio) filtro.fechaCreacion.$gte = new Date(fechaInicio as string);
      if (fechaFin) filtro.fechaCreacion.$lte = new Date(fechaFin as string);
    }

    const pedidos = await PedidoCanciones.find(filtro)
      .sort({ fechaCreacion: -1 })
      .populate('clienteId', 'nombre')
      .populate('mesaId', 'numero');

    res.json({
      success: true,
      data: pedidos
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener los pedidos'
    });
  }
};

// Obtener pedidos por ID de cliente
export const obtenerPedidosPorCliente = async (req: Request, res: Response) => {
  try {
    const pedidos = await PedidoCanciones.find({ clienteId: req.params.clienteId })
      .sort({ fechaCreacion: -1 })
      .populate('mesaId', 'numero');

    res.json({
      success: true,
      data: pedidos
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener los pedidos del cliente'
    });
  }
};

// Obtener un pedido específico
export const obtenerPedido = async (req: Request, res: Response) => {
  try {
    const pedido = await PedidoCanciones.findById(req.params.id)
      .populate('clienteId', 'nombre')
      .populate('mesaId', 'numero');

    if (!pedido) {
      return res.status(404).json({
        success: false,
        message: 'Pedido no encontrado'
      });
    }

    res.json({
      success: true,
      data: pedido
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener el pedido'
    });
  }
};

// Actualizar estado de canción
export const actualizarEstadoCancion = async (req: Request, res: Response) => {
  try {
    const { estadoCancion } = req.body;

    if (!['pendiente', 'reproduciendo', 'completada'].includes(estadoCancion)) {
      return res.status(400).json({
        success: false,
        message: 'Estado de canción no válido'
      });
    }

    const pedido = await PedidoCanciones.findByIdAndUpdate(
      req.params.id,
      { estadoCancion },
      { new: true }
    );

    if (!pedido) {
      return res.status(404).json({
        success: false,
        message: 'Pedido no encontrado'
      });
    }

    res.json({
      success: true,
      message: 'Estado de canción actualizado exitosamente',
      data: pedido
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al actualizar el estado de la canción'
    });
  }
};

// Actualizar estado especial (pago)
export const actualizarEstadoEspecial = async (req: Request, res: Response) => {
  try {
    const { estadoEspecial } = req.body;

    if (![0, 1, 2].includes(estadoEspecial)) {
      return res.status(400).json({
        success: false,
        message: 'Estado especial no válido'
      });
    }

    const pedido = await PedidoCanciones.findByIdAndUpdate(
      req.params.id,
      { estadoEspecial },
      { new: true }
    );

    if (!pedido) {
      return res.status(404).json({
        success: false,
        message: 'Pedido no encontrado'
      });
    }

    res.json({
      success: true,
      message: 'Estado especial actualizado exitosamente',
      data: pedido
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al actualizar el estado especial'
    });
  }
};

// Eliminar pedido
export const eliminarPedido = async (req: Request, res: Response) => {
  try {
    const pedido = await PedidoCanciones.findByIdAndDelete(req.params.id);

    if (!pedido) {
      return res.status(404).json({
        success: false,
        message: 'Pedido no encontrado'
      });
    }

    res.json({
      success: true,
      message: 'Pedido eliminado exitosamente'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al eliminar el pedido'
    });
  }
}; 