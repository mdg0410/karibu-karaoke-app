import express from 'express';
import {
  crearPedido,
  obtenerPedidos,
  obtenerPedidoPorId,
  actualizarPedido,
  cambiarEstadoPedido,
  agregarProducto,
  eliminarPedido
} from '../controllers/pedidoController';
import {
  validarCrearPedido,
  validarActualizarPedido,
  validarCambioEstadoPedido,
  validarAgregarProducto,
  validarBusquedaPedidos
} from '../middleware/validation/pedidoValidation';
import { 
  verificarToken, 
  verificarRol
} from '../middleware/auth/userAuth';
import { validationResult } from 'express-validator';

// Middleware para verificar si un pedido existe
import Pedido from '../models/Pedido';
import { Request, Response, NextFunction } from 'express';

// Middleware para manejar errores de validación
const validationErrorHandler = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Middleware para verificar si un pedido existe
const verificarPedidoExiste = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const pedidoId = req.params.id;
    
    const pedido = await Pedido.findById(pedidoId);
    
    if (!pedido) {
      return res.status(404).json({
        message: 'Pedido no encontrado'
      });
    }
    
    next();
  } catch (error) {
    console.error('Error al verificar pedido:', error);
    return res.status(500).json({
      message: 'Error al verificar la existencia del pedido'
    });
  }
};

const router = express.Router();

// Ruta para crear un nuevo pedido (solo clientes y personal)
router.post(
  '/',
  verificarToken,
  verificarRol(['cliente', 'staff', 'admin']),
  validarCrearPedido,
  validationErrorHandler,
  crearPedido
);

// Ruta para obtener todos los pedidos con filtros (solo personal)
router.get(
  '/',
  verificarToken,
  verificarRol(['staff', 'admin']),
  validarBusquedaPedidos,
  validationErrorHandler,
  obtenerPedidos
);

// Ruta para obtener un pedido específico
router.get(
  '/:id',
  verificarToken,
  verificarPedidoExiste,
  obtenerPedidoPorId
);

// Ruta para actualizar un pedido (solo personal)
router.put(
  '/:id',
  verificarToken,
  verificarRol(['staff', 'admin']),
  verificarPedidoExiste,
  validarActualizarPedido,
  validationErrorHandler,
  actualizarPedido
);

// Ruta para cambiar el estado de un pedido (solo personal)
router.patch(
  '/:id/estado',
  verificarToken,
  verificarRol(['staff', 'admin']),
  verificarPedidoExiste,
  validarCambioEstadoPedido,
  validationErrorHandler,
  cambiarEstadoPedido
);

// Ruta para agregar un producto a un pedido existente
router.post(
  '/:id/productos',
  verificarToken,
  verificarRol(['cliente', 'staff', 'admin']),
  verificarPedidoExiste,
  validarAgregarProducto,
  validationErrorHandler,
  agregarProducto
);

// Ruta para eliminar un pedido (solo admin)
router.delete(
  '/:id',
  verificarToken,
  verificarRol(['admin']),
  verificarPedidoExiste,
  eliminarPedido
);

export default router; 