import express from 'express';
import { verifyToken, verifyRole } from '../middleware/auth';
import {
  crearPedido,
  obtenerPedidos,
  obtenerPedidosPorCliente,
  obtenerPedido,
  actualizarEstadoCancion,
  actualizarEstadoEspecial,
  eliminarPedido
} from '../controllers/pedidoCancionesController';

const router = express.Router();

// Rutas públicas (requieren solo autenticación)
router.post('/', verifyToken, crearPedido);
router.get('/cliente/:clienteId', verifyToken, obtenerPedidosPorCliente);

// Rutas protegidas (requieren rol de admin)
router.get('/', [verifyToken, verifyRole(['admin'])], obtenerPedidos);
router.get('/:id', [verifyToken, verifyRole(['admin'])], obtenerPedido);
router.patch('/:id/estado-cancion', [verifyToken, verifyRole(['admin'])], actualizarEstadoCancion);
router.patch('/:id/estado-especial', [verifyToken, verifyRole(['admin'])], actualizarEstadoEspecial);
router.delete('/:id', [verifyToken, verifyRole(['admin'])], eliminarPedido);

export default router; 