import { Request, Response, NextFunction } from 'express';
import { body, param, query, validationResult } from 'express-validator';
import { validarFormatoEmail } from '../../utils/userUtils';
import User from '../../models/User';

// Validar errores genéricos
export const handleValidationErrors = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      success: false, 
      errors: errors.array().map(error => ({
        param: error.type === 'field' ? error.path : error.type,
        msg: error.msg
      }))
    });
  }
  next();
};

// Validar registro de usuario
export const validateUserRegistration = [
  body('nombre')
    .notEmpty()
    .withMessage('El nombre es obligatorio')
    .isString()
    .withMessage('El nombre debe ser un texto')
    .isLength({ min: 2, max: 100 })
    .withMessage('El nombre debe tener entre 2 y 100 caracteres'),
  body('email')
    .notEmpty()
    .withMessage('El email es obligatorio')
    .isEmail()
    .withMessage('El email no es válido')
    .custom(async (value) => {
      const existingUser = await User.findOne({ email: value });
      if (existingUser) {
        throw new Error('El email ya está en uso');
      }
      return true;
    }),
  body('password')
    .notEmpty()
    .withMessage('La contraseña es obligatoria')
    .isLength({ min: 6 })
    .withMessage('La contraseña debe tener al menos 6 caracteres'),
  body('telefono')
    .notEmpty()
    .withMessage('El teléfono es obligatorio')
    .isString()
    .withMessage('El teléfono debe ser un texto'),
  body('rol')
    .optional()
    .isIn(['cliente', 'trabajador', 'admin'])
    .withMessage('Rol no válido (debe ser cliente, trabajador o admin)'),
  handleValidationErrors
];

// Validar login de usuario
export const validateUserLogin = [
  body('email')
    .notEmpty()
    .withMessage('El email es obligatorio')
    .isEmail()
    .withMessage('El email no es válido'),
  body('password')
    .notEmpty()
    .withMessage('La contraseña es obligatoria'),
  handleValidationErrors
];

// Validar actualización de usuario
export const validateUserUpdate = [
  param('id')
    .isMongoId()
    .withMessage('ID de usuario no válido'),
  body('nombre')
    .optional()
    .isString()
    .withMessage('El nombre debe ser un texto')
    .isLength({ min: 2, max: 100 })
    .withMessage('El nombre debe tener entre 2 y 100 caracteres'),
  body('email')
    .optional()
    .isEmail()
    .withMessage('El email no es válido')
    .custom(async (value, { req }) => {
      if (!req.params || !req.params.id) {
        throw new Error('ID de usuario no proporcionado');
      }
      const existingUser = await User.findOne({ email: value });
      if (existingUser && existingUser._id.toString() !== req.params.id) {
        throw new Error('El email ya está en uso');
      }
      return true;
    }),
  body('password')
    .optional()
    .isLength({ min: 6 })
    .withMessage('La contraseña debe tener al menos 6 caracteres'),
  body('telefono')
    .optional()
    .isString()
    .withMessage('El teléfono debe ser un texto'),
  body('rol')
    .optional()
    .isIn(['cliente', 'trabajador', 'admin'])
    .withMessage('Rol no válido (debe ser cliente, trabajador o admin)'),
  handleValidationErrors
];

// Validar cambio de contraseña
export const validatePasswordChange = [
  param('id')
    .isMongoId()
    .withMessage('ID de usuario no válido'),
  body('currentPassword')
    .notEmpty()
    .withMessage('La contraseña actual es obligatoria'),
  body('newPassword')
    .notEmpty()
    .withMessage('La nueva contraseña es obligatoria')
    .isLength({ min: 6 })
    .withMessage('La nueva contraseña debe tener al menos 6 caracteres'),
  handleValidationErrors
];

// Validar parámetros de filtrado
export const validateUserFilters = [
  query('nombre')
    .optional()
    .isString()
    .withMessage('El nombre debe ser un texto'),
  query('email')
    .optional()
    .isString()
    .withMessage('El email debe ser un texto'),
  query('rol')
    .optional()
    .isIn(['cliente', 'trabajador', 'admin'])
    .withMessage('Rol no válido'),
  query('fechaDesde')
    .optional()
    .isISO8601()
    .withMessage('Formato de fecha desde no válido'),
  query('fechaHasta')
    .optional()
    .isISO8601()
    .withMessage('Formato de fecha hasta no válido')
    .custom((value, { req }) => {
      if (!req.query || !req.query.fechaDesde) {
        return true;
      }
      const desde = req.query.fechaDesde.toString();
      if (desde && new Date(value) <= new Date(desde)) {
        throw new Error('La fecha hasta debe ser posterior a la fecha desde');
      }
      return true;
    }),
  handleValidationErrors
]; 