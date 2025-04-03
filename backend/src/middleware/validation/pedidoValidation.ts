import { check, param, query } from 'express-validator';
import { isValidPedidoEstado } from '../../utils/pedidoUtils';

export const validarCrearPedido = [
  check('numeroMesa')
    .isInt({ min: 1 })
    .withMessage('El número de mesa debe ser un número entero mayor a 0'),
  
  check('clienteId')
    .isMongoId()
    .withMessage('El ID del cliente no es válido'),
  
  check('detalles')
    .isArray({ min: 1 })
    .withMessage('Debe incluir al menos un producto en el pedido'),
  
  check('detalles.*.productoId')
    .isMongoId()
    .withMessage('El ID del producto no es válido'),
  
  check('detalles.*.cantidad')
    .isInt({ min: 1 })
    .withMessage('La cantidad debe ser un número entero mayor a 0'),
  
  check('estado')
    .optional()
    .custom(value => {
      if (!isValidPedidoEstado(value)) {
        throw new Error('El estado del pedido no es válido');
      }
      return true;
    })
];

export const validarCambioEstadoPedido = [
  param('id')
    .isMongoId()
    .withMessage('El ID del pedido no es válido'),
  
  check('estado')
    .notEmpty()
    .withMessage('El estado es obligatorio')
    .custom(value => {
      if (!isValidPedidoEstado(value)) {
        throw new Error('El estado del pedido no es válido');
      }
      return true;
    }),
  
  check('trabajadorId')
    .isMongoId()
    .withMessage('El ID del trabajador no es válido'),
  
  check('comentario')
    .optional()
    .isString()
    .isLength({ min: 3, max: 500 })
    .withMessage('El comentario debe tener entre 3 y 500 caracteres')
];

export const validarActualizarPedido = [
  param('id')
    .isMongoId()
    .withMessage('El ID del pedido no es válido'),
  
  check('estado')
    .optional()
    .custom(value => {
      if (!isValidPedidoEstado(value)) {
        throw new Error('El estado del pedido no es válido');
      }
      return true;
    }),
  
  check('detalles')
    .optional()
    .isArray({ min: 1 })
    .withMessage('Debe incluir al menos un producto en el pedido'),
  
  check('detalles.*.productoId')
    .optional()
    .isMongoId()
    .withMessage('El ID del producto no es válido'),
  
  check('detalles.*.cantidad')
    .optional()
    .isInt({ min: 1 })
    .withMessage('La cantidad debe ser un número entero mayor a 0'),
  
  check('comentario')
    .optional()
    .isString()
    .isLength({ min: 3, max: 500 })
    .withMessage('El comentario debe tener entre 3 y 500 caracteres')
];

export const validarAgregarProducto = [
  param('id')
    .isMongoId()
    .withMessage('El ID del pedido no es válido'),
  
  check('productoId')
    .isMongoId()
    .withMessage('El ID del producto no es válido'),
  
  check('cantidad')
    .isInt({ min: 1 })
    .withMessage('La cantidad debe ser un número entero mayor a 0')
];

export const validarBusquedaPedidos = [
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
  
  query('numeroMesa')
    .optional()
    .isInt({ min: 1 })
    .withMessage('El número de mesa debe ser un número entero mayor a 0'),
  
  query('clienteId')
    .optional()
    .isMongoId()
    .withMessage('El ID del cliente no es válido'),
  
  query('estado')
    .optional()
    .custom(value => {
      if (!isValidPedidoEstado(value)) {
        throw new Error('El estado del pedido no es válido');
      }
      return true;
    }),
  
  query('fechaDesde')
    .optional()
    .isISO8601()
    .withMessage('La fecha de inicio debe tener un formato válido (ISO8601)'),
  
  query('fechaHasta')
    .optional()
    .isISO8601()
    .withMessage('La fecha de fin debe tener un formato válido (ISO8601)'),
  
  query('trabajadorId')
    .optional()
    .isMongoId()
    .withMessage('El ID del trabajador no es válido'),
  
  query('totalMin')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('El total mínimo debe ser un número mayor o igual a 0'),
  
  query('totalMax')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('El total máximo debe ser un número mayor o igual a 0')
]; 