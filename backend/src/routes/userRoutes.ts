import express from 'express';
import * as userController from '../controllers/userController';
import { validateUserRegistration, validateUserLogin, validateUserUpdate, validatePasswordChange, validateUserFilters } from '../middleware/validation/userValidation';
import { verificarToken, verificarRol, verificarUsuarioExiste, verificarPropietarioOAdmin } from '../middleware/auth/userAuth';

const router = express.Router();

// Rutas públicas (sin autenticación)
router.post('/registro', validateUserRegistration, userController.registro);
router.post('/login', validateUserLogin, userController.login);

// Rutas para el perfil de usuario autenticado
router.get('/perfil', verificarToken, userController.getPerfil);

// Rutas para usuarios (requieren autenticación)
router.use(verificarToken);

// Operaciones que requieren rol admin o ser el propietario de la cuenta
router.put('/cambiar-password/:id',
  verificarUsuarioExiste,
  verificarPropietarioOAdmin,
  validatePasswordChange,
  userController.cambiarPassword
);

router.put('/:id',
  verificarUsuarioExiste,
  verificarPropietarioOAdmin,
  validateUserUpdate,
  userController.updateUsuario
);

// Operaciones que solo pueden realizar los admin
router.get('/',
  verificarRol(['admin']),
  validateUserFilters,
  userController.getUsuarios
);

router.get('/:id',
  verificarRol(['admin']),
  verificarUsuarioExiste,
  userController.getUsuarioById
);

router.delete('/:id',
  verificarRol(['admin']),
  verificarUsuarioExiste,
  userController.deleteUsuario
);

export default router; 