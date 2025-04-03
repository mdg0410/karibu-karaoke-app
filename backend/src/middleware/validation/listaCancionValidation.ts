import { check, param, query } from 'express-validator';
import { isValidEstadoReproduccion, isValidEstadoPago } from '../../utils/listaCancionUtils';
import mongoose from 'mongoose';

export const validarCrearListaCancion = [
  check('canciones')
    .isArray({ min: 1, max: 3 })
    .withMessage('Debe incluir entre 1 y 3 canciones')
    .custom((canciones) => {
      if (!canciones.every(Number.isInteger)) {
        throw new Error('Los números de canción deben ser enteros');
      }
      return true;
    }),
  
  check('numeroMesa')
    .notEmpty()
    .withMessage('El número de mesa es obligatorio')
    .isInt({ min: 1 })
    .withMessage('El número de mesa debe ser un entero positivo'),
  
  check('clienteId')
    .notEmpty()
    .withMessage('El ID del cliente es obligatorio')
    .isMongoId()
    .withMessage('El ID del cliente no es válido'),
  
  check('estadoReproduccion')
    .optional()
    .custom(value => {
      if (!isValidEstadoReproduccion(value)) {
        throw new Error('El estado de reproducción no es válido');
      }
      return true;
    }),
  
  check('estadoPago')
    .optional()
    .custom(value => {
      if (!isValidEstadoPago(value)) {
        throw new Error('El estado de pago no es válido');
      }
      return true;
    })
];

export const validarActualizarListaCancion = [
  param('id')
    .isMongoId()
    .withMessage('El ID de la lista no es válido'),
  
  check('canciones')
    .optional()
    .isArray({ min: 1, max: 3 })
    .withMessage('Debe incluir entre 1 y 3 canciones')
    .custom((canciones) => {
      if (!canciones.every(Number.isInteger)) {
        throw new Error('Los números de canción deben ser enteros');
      }
      return true;
    }),
  
  check('numeroMesa')
    .optional()
    .isInt({ min: 1 })
    .withMessage('El número de mesa debe ser un entero positivo'),
  
  check('clienteId')
    .optional()
    .isMongoId()
    .withMessage('El ID del cliente no es válido'),
  
  check('estadoReproduccion')
    .optional()
    .custom(value => {
      if (!isValidEstadoReproduccion(value)) {
        throw new Error('El estado de reproducción no es válido');
      }
      return true;
    }),
  
  check('estadoPago')
    .optional()
    .custom(value => {
      if (!isValidEstadoPago(value)) {
        throw new Error('El estado de pago no es válido');
      }
      return true;
    })
];

export const validarCambioEstadoReproduccion = [
  param('id')
    .isMongoId()
    .withMessage('El ID de la lista no es válido'),
  
  check('estadoReproduccion')
    .notEmpty()
    .withMessage('El estado de reproducción es obligatorio')
    .custom(value => {
      if (!isValidEstadoReproduccion(value)) {
        throw new Error('El estado de reproducción no es válido');
      }
      return true;
    })
];

export const validarCambioEstadoPago = [
  param('id')
    .isMongoId()
    .withMessage('El ID de la lista no es válido'),
  
  check('estadoPago')
    .notEmpty()
    .withMessage('El estado de pago es obligatorio')
    .custom(value => {
      if (!isValidEstadoPago(value)) {
        throw new Error('El estado de pago no es válido');
      }
      return true;
    })
];

export const validarBusquedaListaCancion = [
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
    .withMessage('El número de mesa debe ser un entero positivo'),
  
  query('clienteId')
    .optional()
    .custom(value => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        throw new Error('El ID del cliente no es válido');
      }
      return true;
    }),
  
  query('estadoReproduccion')
    .optional()
    .custom(value => {
      if (!isValidEstadoReproduccion(value)) {
        throw new Error('El estado de reproducción no es válido');
      }
      return true;
    }),
  
  query('estadoPago')
    .optional()
    .custom(value => {
      if (!isValidEstadoPago(value)) {
        throw new Error('El estado de pago no es válido');
      }
      return true;
    }),
  
  query('fechaInicio')
    .optional()
    .isISO8601()
    .withMessage('La fecha de inicio debe estar en formato ISO8601'),
  
  query('fechaFin')
    .optional()
    .isISO8601()
    .withMessage('La fecha de fin debe estar en formato ISO8601'),
  
  query('incluirCanciones')
    .optional()
    .isBoolean()
    .withMessage('incluirCanciones debe ser true o false')
]; 