import express from 'express';
import * as mesaController from '../controllers/mesaController';
import { validateCreateMesa, validateUpdateMesa, validateEstadoUpdate, validateEstadoTransition, validateMesaFilters } from '../middleware/validation/mesaValidation';
import { verificarPermisosMesa, verificarMesaExiste, verificarEstadoMesa } from '../middleware/auth/mesaAuth';
import { verificarToken } from '../middleware/auth/userAuth';

const router = express.Router();

// Rutas públicas (sin autenticación)
router.get('/disponibles', validateMesaFilters, mesaController.getMesasDisponibles);
router.get('/:id', verificarMesaExiste, mesaController.getMesaById);

// Middleware para verificar el token en todas las rutas
router.use(verificarToken);

// Rutas para operaciones básicas (requieren rol admin o trabajador)
router.get('/', verificarPermisosMesa(['admin', 'trabajador']), validateMesaFilters, mesaController.getMesas);
router.post('/', verificarPermisosMesa(['admin']), validateCreateMesa, mesaController.createMesa);
router.put('/:id', verificarPermisosMesa(['admin']), verificarMesaExiste, validateUpdateMesa, mesaController.updateMesa);
router.delete('/:id', verificarPermisosMesa(['admin']), verificarMesaExiste, mesaController.deleteMesa);

// Rutas para operaciones de estado
router.put('/:id/estado', 
  verificarPermisosMesa(['admin', 'trabajador', 'cliente']),
  verificarMesaExiste,
  validateEstadoUpdate,
  validateEstadoTransition,
  mesaController.cambiarEstadoMesa
);

// Rutas para historial
router.get('/:id/historial', 
  verificarPermisosMesa(['admin', 'trabajador']),
  verificarMesaExiste,
  mesaController.getHistorialMesa
);

export default router; 