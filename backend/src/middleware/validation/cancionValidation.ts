import { Request, Response, NextFunction } from 'express';
import { body, param, query, validationResult } from 'express-validator';
import { validarFormatoDuracion } from '../../utils/cancionUtils';
import Cancion from '../../models/Cancion';

// Validar errores genéricos
export const handleValidationErrors = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      success: false, 
      errors: errors.array().map(err => ({
        param: err.type === 'field' ? err.path : err.type,
        msg: err.msg
      }))
    });
  }
  next();
};

// Validar creación de canción
export const validateCreateCancion = [
  body('numeroCancion')
    .isInt({ min: 1 })
    .withMessage('El número de canción debe ser un entero positivo')
    .custom(async (value: number) => {
      const existingCancion = await Cancion.findOne({ numeroCancion: value });
      if (existingCancion) {
        throw new Error('Ya existe una canción con este número');
      }
      return true;
    }),
  body('titulo')
    .notEmpty()
    .withMessage('El título es obligatorio')
    .isString()
    .withMessage('El título debe ser un texto')
    .isLength({ max: 100 })
    .withMessage('El título no debe exceder los 100 caracteres'),
  body('artista')
    .notEmpty()
    .withMessage('El artista es obligatorio')
    .isString()
    .withMessage('El artista debe ser un texto')
    .isLength({ max: 100 })
    .withMessage('El artista no debe exceder los 100 caracteres'),
  body('genero')
    .notEmpty()
    .withMessage('El género es obligatorio')
    .isString()
    .withMessage('El género debe ser un texto')
    .isLength({ max: 50 })
    .withMessage('El género no debe exceder los 50 caracteres'),
  body('idioma')
    .notEmpty()
    .withMessage('El idioma es obligatorio')
    .isString()
    .withMessage('El idioma debe ser un texto')
    .isLength({ max: 50 })
    .withMessage('El idioma no debe exceder los 50 caracteres'),
  body('duracion')
    .notEmpty()
    .withMessage('La duración es obligatoria')
    .isString()
    .withMessage('La duración debe ser un texto')
    .custom((value: string) => {
      if (!validarFormatoDuracion(value)) {
        throw new Error('El formato de duración debe ser MM:SS');
      }
      return true;
    }),
  body('estado')
    .optional()
    .isIn(['activa', 'inactiva'])
    .withMessage('Estado no válido (debe ser activa o inactiva)'),
  body('popularidad')
    .optional()
    .isInt({ min: 0 })
    .withMessage('La popularidad debe ser un entero no negativo'),
  handleValidationErrors
];

// Validar actualización de canción
export const validateUpdateCancion = [
  param('id')
    .isMongoId()
    .withMessage('ID de canción no válido'),
  body('titulo')
    .optional()
    .isString()
    .withMessage('El título debe ser un texto')
    .isLength({ max: 100 })
    .withMessage('El título no debe exceder los 100 caracteres'),
  body('artista')
    .optional()
    .isString()
    .withMessage('El artista debe ser un texto')
    .isLength({ max: 100 })
    .withMessage('El artista no debe exceder los 100 caracteres'),
  body('genero')
    .optional()
    .isString()
    .withMessage('El género debe ser un texto')
    .isLength({ max: 50 })
    .withMessage('El género no debe exceder los 50 caracteres'),
  body('idioma')
    .optional()
    .isString()
    .withMessage('El idioma debe ser un texto')
    .isLength({ max: 50 })
    .withMessage('El idioma no debe exceder los 50 caracteres'),
  body('duracion')
    .optional()
    .isString()
    .withMessage('La duración debe ser un texto')
    .custom((value: string) => {
      if (!validarFormatoDuracion(value)) {
        throw new Error('El formato de duración debe ser MM:SS');
      }
      return true;
    }),
  body('estado')
    .optional()
    .isIn(['activa', 'inactiva'])
    .withMessage('Estado no válido (debe ser activa o inactiva)'),
  body('popularidad')
    .optional()
    .isInt({ min: 0 })
    .withMessage('La popularidad debe ser un entero no negativo'),
  handleValidationErrors
];

// Validar parámetros de filtrado
export const validateCancionFilters = [
  query('numeroCancion')
    .optional()
    .isInt({ min: 1 })
    .withMessage('El número de canción debe ser un entero positivo'),
  query('titulo')
    .optional()
    .isString()
    .withMessage('El título debe ser un texto'),
  query('artista')
    .optional()
    .isString()
    .withMessage('El artista debe ser un texto'),
  query('genero')
    .optional()
    .isString()
    .withMessage('El género debe ser un texto'),
  query('idioma')
    .optional()
    .isString()
    .withMessage('El idioma debe ser un texto'),
  query('estado')
    .optional()
    .isIn(['activa', 'inactiva'])
    .withMessage('Estado no válido'),
  query('popularidadMin')
    .optional()
    .isInt({ min: 0 })
    .withMessage('La popularidad mínima debe ser un entero no negativo'),
  query('popularidadMax')
    .optional()
    .isInt({ min: 0 })
    .withMessage('La popularidad máxima debe ser un entero no negativo')
    .custom((value, { req }) => {
      if (!req || !req.query) {
        return true;
      }
      const min = req.query.popularidadMin;
      if (min && parseInt(value) < parseInt(min as string)) {
        throw new Error('La popularidad máxima debe ser mayor o igual a la popularidad mínima');
      }
      return true;
    }),
  query('busqueda')
    .optional()
    .isString()
    .withMessage('La búsqueda debe ser un texto'),
  handleValidationErrors
]; 