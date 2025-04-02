import express from 'express';
import { verifyToken, verifyRole } from '../middleware/auth';
import {
  getCanciones,
  getCancion,
  createCancion,
  updateCancion,
  deleteCancion,
  getGeneros,
  getIdiomas
} from '../controllers/cancionesController';

const router = express.Router();

// Rutas públicas
router.get('/', getCanciones);
router.get('/generos', getGeneros);
router.get('/idiomas', getIdiomas);
router.get('/:id', getCancion);

// Rutas protegidas (requieren autenticación y rol de admin o staff)
router.post('/', [verifyToken, verifyRole(['admin', 'staff'])], createCancion);
router.put('/:id', [verifyToken, verifyRole(['admin', 'staff'])], updateCancion);
router.delete('/:id', [verifyToken, verifyRole(['admin'])], deleteCancion);

export default router; 