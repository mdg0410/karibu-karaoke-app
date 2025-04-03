import express from 'express';
import { 
  getProductos, 
  getProductoById, 
  getProductosPorCategoria,
  createProducto, 
  updateProducto, 
  deleteProducto,
  cambiarEstadoProducto,
  getCategorias
} from '../controllers/productoController';
import {
  validarCrearProducto,
  validarActualizarProducto,
  validarCambioEstadoProducto,
  validarBusquedaProductos
} from '../middleware/validation/productoValidation';
import { 
  verificarToken, 
  verificarRol
} from '../middleware/auth/userAuth';
import { validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

// Middleware para verificar si un producto existe
import Producto from '../models/Producto';

// Middleware para manejar errores de validación
const validationErrorHandler = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Middleware para verificar si un producto existe
const verificarProductoExiste = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const productoId = req.params.id;
    
    if (!productoId) {
      return res.status(400).json({
        message: 'ID de producto no proporcionado'
      });
    }
    
    const producto = await Producto.findById(productoId);
    
    if (!producto) {
      return res.status(404).json({
        message: 'Producto no encontrado'
      });
    }
    
    next();
  } catch (error) {
    console.error('Error al verificar producto:', error);
    return res.status(500).json({
      message: 'Error al verificar la existencia del producto'
    });
  }
};

const router = express.Router();

// Rutas públicas
router.get(
  '/',
  validarBusquedaProductos,
  validationErrorHandler,
  getProductos
);

router.get(
  '/categorias',
  getCategorias
);

router.get(
  '/categoria/:categoria',
  getProductosPorCategoria
);

router.get(
  '/:id',
  verificarProductoExiste,
  getProductoById
);

// Rutas protegidas (solo admin)
router.post(
  '/',
  verificarToken,
  verificarRol(['admin']),
  validarCrearProducto,
  validationErrorHandler,
  createProducto
);

router.put(
  '/:id',
  verificarToken,
  verificarRol(['admin']),
  verificarProductoExiste,
  validarActualizarProducto,
  validationErrorHandler,
  updateProducto
);

router.patch(
  '/:id/estado',
  verificarToken,
  verificarRol(['admin']),
  verificarProductoExiste,
  validarCambioEstadoProducto,
  validationErrorHandler,
  cambiarEstadoProducto
);

router.delete(
  '/:id',
  verificarToken,
  verificarRol(['admin']),
  verificarProductoExiste,
  deleteProducto
);

export default router; 