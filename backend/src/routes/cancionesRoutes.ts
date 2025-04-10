import express from 'express';
import * as cancionesController from '../controllers/cancionesController';
import { validateCreateCancion, validateUpdateCancion, validateCancionFilters } from '../middleware/validation/cancionValidation';
import { verificarPermisosCancion, verificarCancionExiste, verificarEstadoCancion } from '../middleware/auth/cancionAuth';
import { verificarToken } from '../middleware/auth/userAuth';

const router = express.Router();

// Middleware para verificar el token en todas las rutas
router.use(verificarToken);

// Rutas públicas (accesibles para todos los roles autenticados)
router.get('/populares', cancionesController.getCancionesPopulares);
router.get('/generos', cancionesController.getGeneros);
router.get('/idiomas', cancionesController.getIdiomas);
router.get('/:id', verificarCancionExiste, cancionesController.getCancionById);
router.get('/', validateCancionFilters, cancionesController.getCanciones);

// Rutas para operaciones básicas (requieren rol admin o trabajador)
router.post('/', 
  verificarPermisosCancion(['admin']), 
  validateCreateCancion, 
  cancionesController.createCancion
);

router.put('/:id', 
  verificarPermisosCancion(['admin']), 
  verificarCancionExiste,
  validateUpdateCancion, 
  cancionesController.updateCancion
);

router.delete('/:id', 
  verificarPermisosCancion(['admin']), 
  verificarCancionExiste, 
  cancionesController.deleteCancion
);

// Ruta para incrementar popularidad
router.put('/:id/popularidad', 
  verificarPermisosCancion(['admin', 'trabajador']),
  verificarCancionExiste,
  verificarEstadoCancion(['activa']),
  cancionesController.incrementarPopularidadCancion
);

export default router; 