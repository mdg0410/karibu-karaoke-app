import { body, query } from 'express-validator';
import mongoose from 'mongoose';

export const validarCrearHistorialCierre = [
  body('cajaInicial')
    .isNumeric()
    .withMessage('La caja inicial debe ser un número')
    .isFloat({ min: 0 })
    .withMessage('La caja inicial debe ser un valor positivo'),
  body('observaciones')
    .optional()
    .isString()
    .withMessage('Las observaciones deben ser texto')
];

export const validarActualizarHistorialCierre = [
  body('cajaInicial')
    .optional()
    .isNumeric()
    .withMessage('La caja inicial debe ser un número')
    .isFloat({ min: 0 })
    .withMessage('La caja inicial debe ser un valor positivo'),
  body('observaciones')
    .optional()
    .isString()
    .withMessage('Las observaciones deben ser texto'),
  body('abierto')
    .optional()
    .isBoolean()
    .withMessage('El campo abierto debe ser un valor booleano')
];

export const validarCerrarHistorialCierre = [
  body('cajaFinal')
    .isNumeric()
    .withMessage('La caja final debe ser un número')
    .isFloat({ min: 0 })
    .withMessage('La caja final debe ser un valor positivo'),
  body('efectivoReal')
    .isNumeric()
    .withMessage('El efectivo real debe ser un número')
    .isFloat({ min: 0 })
    .withMessage('El efectivo real debe ser un valor positivo'),
  body('observaciones')
    .optional()
    .isString()
    .withMessage('Las observaciones deben ser texto')
];

export const validarBusquedaHistorialCierre = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('El número de página debe ser un entero positivo'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('El límite debe ser un entero entre 1 y 100'),
  query('abierto')
    .optional()
    .isBoolean()
    .withMessage('El filtro abierto debe ser un valor booleano'),
  query('fechaDesde')
    .optional()
    .isISO8601()
    .withMessage('La fecha desde debe ser una fecha válida en formato ISO8601'),
  query('fechaHasta')
    .optional()
    .isISO8601()
    .withMessage('La fecha hasta debe ser una fecha válida en formato ISO8601'),
  query('sortBy')
    .optional()
    .isIn(['createdAt', 'fechaCierre', 'cajaInicial', 'cajaFinal', 'totalIngresado'])
    .withMessage('El campo de ordenación debe ser válido'),
  query('sortOrder')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('El orden debe ser asc o desc')
]; 