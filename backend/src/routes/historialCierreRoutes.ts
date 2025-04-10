import express from 'express';
import {
  getHistorialesCierre,
  getHistorialCierreById,
  getHistorialCierreActual,
  createHistorialCierre,
  updateHistorialCierre,
  cerrarHistorialCierre,
  deleteHistorialCierre
} from '../controllers/historialCierreController';
import {
  validarCrearHistorialCierre,
  validarActualizarHistorialCierre,
  validarCerrarHistorialCierre,
  validarBusquedaHistorialCierre
} from '../middleware/validation/historialCierreValidation';
import {
  verificarPermisosHistorialCierre,
  verificarHistorialCierreExiste,
  verificarHistorialAbierto,
  verificarHistorialAbiertoPrevio
} from '../middleware/auth/historialCierreAuth';
import { validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import { verificarToken } from '../middleware/auth/userAuth';
import { AuthenticatedRequest } from '../types/express';

// Middleware para manejar errores de validación
const validationErrorHandler = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

const router = express.Router();

// Verificar token para todas las rutas
router.use(verificarToken);

// Convertir AuthenticatedRequest a express.RequestHandler
// Esto es necesario porque Express espera un tipo específico para sus handlers
type PermissionMiddleware = ReturnType<typeof verificarPermisosHistorialCierre>;
const asHandler = (middleware: PermissionMiddleware) => middleware as any;

// Rutas para obtener historiales
router.get(
  '/',
  asHandler(verificarPermisosHistorialCierre(['admin', 'trabajador'])),
  validarBusquedaHistorialCierre,
  validationErrorHandler,
  getHistorialesCierre as any
);

router.get(
  '/actual',
  asHandler(verificarPermisosHistorialCierre(['admin', 'trabajador'])),
  getHistorialCierreActual as any
);

router.get(
  '/:id',
  asHandler(verificarPermisosHistorialCierre(['admin', 'trabajador'])),
  verificarHistorialCierreExiste as any,
  getHistorialCierreById as any
);

// Rutas para gestionar historiales
router.post(
  '/',
  asHandler(verificarPermisosHistorialCierre(['admin', 'trabajador'])),
  verificarHistorialAbiertoPrevio as any,
  validarCrearHistorialCierre,
  validationErrorHandler,
  createHistorialCierre as any
);

router.put(
  '/:id',
  asHandler(verificarPermisosHistorialCierre(['admin'])),
  verificarHistorialCierreExiste as any,
  validarActualizarHistorialCierre,
  validationErrorHandler,
  updateHistorialCierre as any
);

router.patch(
  '/:id/cerrar',
  asHandler(verificarPermisosHistorialCierre(['admin', 'trabajador'])),
  verificarHistorialCierreExiste as any,
  verificarHistorialAbierto as any,
  validarCerrarHistorialCierre,
  validationErrorHandler,
  cerrarHistorialCierre as any
);

router.delete(
  '/:id',
  asHandler(verificarPermisosHistorialCierre(['admin'])),
  verificarHistorialCierreExiste as any,
  deleteHistorialCierre as any
);

export default router; 