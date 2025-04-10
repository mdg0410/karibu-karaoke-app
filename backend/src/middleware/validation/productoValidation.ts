import { check, param, query } from 'express-validator';
import { isValidProductoEstado } from '../../utils/productoUtils';

export const validarCrearProducto = [
  check('nombre')
    .notEmpty()
    .withMessage('El nombre del producto es obligatorio')
    .isString()
    .isLength({ min: 2, max: 100 })
    .withMessage('El nombre debe tener entre 2 y 100 caracteres'),
  
  check('categoria')
    .notEmpty()
    .withMessage('La categoría es obligatoria')
    .isString()
    .isLength({ min: 2, max: 50 })
    .withMessage('La categoría debe tener entre 2 y 50 caracteres'),
  
  check('precio')
    .notEmpty()
    .withMessage('El precio es obligatorio')
    .isFloat({ min: 0 })
    .withMessage('El precio debe ser un número mayor o igual a 0'),
  
  check('imagenURL')
    .optional()
    .isString()
    .withMessage('La URL de la imagen debe ser una cadena de texto'),
  
  check('stock')
    .optional()
    .isInt({ min: 0 })
    .withMessage('El stock debe ser un número entero mayor o igual a 0'),
  
  check('estado')
    .optional()
    .custom(value => {
      if (!isValidProductoEstado(value)) {
        throw new Error('El estado del producto no es válido');
      }
      return true;
    })
];

export const validarActualizarProducto = [
  param('id')
    .isMongoId()
    .withMessage('El ID del producto no es válido'),
  
  check('nombre')
    .optional()
    .isString()
    .isLength({ min: 2, max: 100 })
    .withMessage('El nombre debe tener entre 2 y 100 caracteres'),
  
  check('categoria')
    .optional()
    .isString()
    .isLength({ min: 2, max: 50 })
    .withMessage('La categoría debe tener entre 2 y 50 caracteres'),
  
  check('precio')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('El precio debe ser un número mayor o igual a 0'),
  
  check('imagenURL')
    .optional()
    .isString()
    .withMessage('La URL de la imagen debe ser una cadena de texto'),
  
  check('stock')
    .optional()
    .isInt({ min: 0 })
    .withMessage('El stock debe ser un número entero mayor o igual a 0'),
  
  check('estado')
    .optional()
    .custom(value => {
      if (!isValidProductoEstado(value)) {
        throw new Error('El estado del producto no es válido');
      }
      return true;
    })
];

export const validarCambioEstadoProducto = [
  param('id')
    .isMongoId()
    .withMessage('El ID del producto no es válido'),
  
  check('estado')
    .notEmpty()
    .withMessage('El estado es obligatorio')
    .custom(value => {
      if (!isValidProductoEstado(value)) {
        throw new Error('El estado del producto no es válido');
      }
      return true;
    })
];

export const validarBusquedaProductos = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('La página debe ser un número entero mayor a 0'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('El límite debe ser un número entero entre 1 y 100'),
  
  query('sortBy')
    .optional()
    .isString()
    .withMessage('El campo de ordenamiento debe ser una cadena de texto'),
  
  query('order')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('El orden debe ser "asc" o "desc"'),
  
  query('nombre')
    .optional()
    .isString()
    .withMessage('El nombre debe ser una cadena de texto'),
  
  query('categoria')
    .optional()
    .isString()
    .withMessage('La categoría debe ser una cadena de texto'),
  
  query('estado')
    .optional()
    .custom(value => {
      if (!isValidProductoEstado(value)) {
        throw new Error('El estado del producto no es válido');
      }
      return true;
    }),
  
  query('precioMin')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('El precio mínimo debe ser un número mayor o igual a 0'),
  
  query('precioMax')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('El precio máximo debe ser un número mayor o igual a 0'),
  
  query('stockMin')
    .optional()
    .isInt({ min: 0 })
    .withMessage('El stock mínimo debe ser un número entero mayor o igual a 0'),
  
  query('stockMax')
    .optional()
    .isInt({ min: 0 })
    .withMessage('El stock máximo debe ser un número entero mayor o igual a 0')
]; 