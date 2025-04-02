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
import { isAdmin } from '../middleware/authMiddleware';

const router = express.Router();

// Rutas públicas
router.get('/', getProductos);
router.get('/categoria/:categoria', getProductosPorCategoria);
router.get('/categorias', getCategorias);
router.get('/:id', getProductoById);

// Rutas protegidas (solo admin)
router.post('/', isAdmin, createProducto);
router.put('/:id', isAdmin, updateProducto);
router.delete('/:id', isAdmin, deleteProducto);
router.patch('/:id/estado', isAdmin, cambiarEstadoProducto);

export default router; 