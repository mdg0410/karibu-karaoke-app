import express from 'express';
import { 
  getListasCanciones,
  getListaCancionById,
  createListaCancion,
  updateListaCancion,
  deleteListaCancion,
  cambiarEstadoReproduccion,
  cambiarEstadoPago,
  getListasCancionesPorMesa
} from '../controllers/listaCancionesController';
import {
  validarCrearListaCancion,
  validarActualizarListaCancion,
  validarCambioEstadoReproduccion,
  validarCambioEstadoPago,
  validarBusquedaListaCancion
} from '../middleware/validation/listaCancionValidation';
import {
  verificarPermisosListaCancion,
  verificarListaCancionExiste,
  verificarCancionesValidas,
  verificarPropietarioOStaff,
  verificarEstadoLista
} from '../middleware/auth/listaCancionAuth';
import { validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import { verificarToken } from '../middleware/auth/userAuth';

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

// Rutas para obtener listas de canciones
router.get(
  '/',
  validarBusquedaListaCancion,
  validationErrorHandler,
  getListasCanciones
);

router.get(
  '/mesa/:numeroMesa',
  verificarPermisosListaCancion(['admin', 'trabajador']),
  getListasCancionesPorMesa
);

router.get(
  '/:id',
  verificarListaCancionExiste,
  verificarPropietarioOStaff,
  getListaCancionById
);

// Rutas para crear/actualizar listas de canciones
router.post(
  '/',
  validarCrearListaCancion,
  validationErrorHandler,
  verificarCancionesValidas,
  createListaCancion
);

router.put(
  '/:id',
  verificarPermisosListaCancion(['admin', 'trabajador']),
  verificarListaCancionExiste,
  validarActualizarListaCancion,
  validationErrorHandler,
  updateListaCancion
);

router.patch(
  '/:id/estado-reproduccion',
  verificarPermisosListaCancion(['admin', 'trabajador']),
  verificarListaCancionExiste,
  validarCambioEstadoReproduccion,
  validationErrorHandler,
  cambiarEstadoReproduccion
);

router.patch(
  '/:id/estado-pago',
  verificarPermisosListaCancion(['admin', 'trabajador']),
  verificarListaCancionExiste,
  validarCambioEstadoPago,
  validationErrorHandler,
  cambiarEstadoPago
);

// Ruta para eliminar lista de canciones (solo admin)
router.delete(
  '/:id',
  verificarPermisosListaCancion(['admin']),
  verificarListaCancionExiste,
  deleteListaCancion
);

export default router; 