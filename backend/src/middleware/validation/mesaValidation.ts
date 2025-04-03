import { Request, Response, NextFunction } from 'express';
import { body, param, query, validationResult } from 'express-validator';
import { validarCapacidad, esTransicionEstadoValida } from '../../utils/mesaUtils';
import Mesa from '../../models/Mesa';

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

// Validar creación de mesa
export const validateCreateMesa = [
  body('numero')
    .isInt({ min: 1 })
    .withMessage('El número de mesa debe ser un entero positivo')
    .custom(async (value) => {
      const existingMesa = await Mesa.findOne({ numero: value });
      if (existingMesa) {
        throw new Error('Ya existe una mesa con este número');
      }
      return true;
    }),
  body('capacidad')
    .isInt({ min: 1 })
    .withMessage('La capacidad debe ser un entero positivo')
    .custom((value) => {
      if (!validarCapacidad(value)) {
        throw new Error('La capacidad no es válida (debe estar entre 1 y 20)');
      }
      return true;
    }),
  body('estado')
    .optional()
    .isIn(['disponible', 'ocupada', 'reservada'])
    .withMessage('Estado no válido (debe ser disponible, ocupada o reservada)'),
  handleValidationErrors
];

// Validar actualización de mesa
export const validateUpdateMesa = [
  param('id')
    .isMongoId()
    .withMessage('ID de mesa no válido'),
  body('capacidad')
    .optional()
    .isInt({ min: 1 })
    .withMessage('La capacidad debe ser un entero positivo')
    .custom((value) => {
      if (!validarCapacidad(value)) {
        throw new Error('La capacidad no es válida (debe estar entre 1 y 20)');
      }
      return true;
    }),
  body('estado')
    .optional()
    .isIn(['disponible', 'ocupada', 'reservada'])
    .withMessage('Estado no válido (debe ser disponible, ocupada o reservada)'),
  handleValidationErrors
];

// Validar cambio de estado
export const validateEstadoUpdate = [
  param('id')
    .isMongoId()
    .withMessage('ID de mesa no válido'),
  body('estado')
    .isIn(['disponible', 'ocupada', 'reservada'])
    .withMessage('Estado no válido (debe ser disponible, ocupada o reservada)'),
  body('usuarioId')
    .isMongoId()
    .withMessage('ID de usuario no válido'),
  body('fechaInicio')
    .optional()
    .isISO8601()
    .withMessage('Formato de fecha de inicio no válido'),
  body('fechaFin')
    .optional()
    .isISO8601()
    .withMessage('Formato de fecha de fin no válido')
    .custom((value, { req }) => {
      if (value && req.body.fechaInicio && new Date(value) <= new Date(req.body.fechaInicio)) {
        throw new Error('La fecha de fin debe ser posterior a la fecha de inicio');
      }
      return true;
    }),
  handleValidationErrors
];

// Middleware para validar que la transición de estado sea válida
export const validateEstadoTransition = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const mesaId = req.params.id;
    const nuevoEstado = req.body.estado;
    
    const mesa = await Mesa.findById(mesaId);
    
    if (!mesa) {
      return res.status(404).json({ success: false, message: 'Mesa no encontrada' });
    }
    
    const estadoActual = mesa.estado;
    
    if (!esTransicionEstadoValida(estadoActual, nuevoEstado)) {
      return res.status(400).json({ 
        success: false, 
        message: `No se puede cambiar el estado de '${estadoActual}' a '${nuevoEstado}'` 
      });
    }
    
    next();
  } catch (error) {
    return res.status(500).json({ 
      success: false, 
      message: 'Error al validar la transición de estado' 
    });
  }
};

// Validar parámetros de filtrado
export const validateMesaFilters = [
  query('estado')
    .optional()
    .isIn(['disponible', 'ocupada', 'reservada'])
    .withMessage('Estado no válido'),
  query('capacidadMin')
    .optional()
    .isInt({ min: 1 })
    .withMessage('La capacidad mínima debe ser un entero positivo'),
  query('capacidadMax')
    .optional()
    .isInt({ min: 1 })
    .withMessage('La capacidad máxima debe ser un entero positivo')
    .custom((value, { req }) => {
      if (!req || !req.query) {
        return true;
      }
      const min = req.query.capacidadMin;
      if (min && parseInt(value) < parseInt(min as string)) {
        throw new Error('La capacidad máxima debe ser mayor o igual a la capacidad mínima');
      }
      return true;
    }),
  query('fechaDesde')
    .optional()
    .isISO8601()
    .withMessage('Formato de fecha desde no válido'),
  query('fechaHasta')
    .optional()
    .isISO8601()
    .withMessage('Formato de fecha hasta no válido')
    .custom((value, { req }) => {
      if (!req || !req.query) {
        return true;
      }
      const desde = req.query.fechaDesde;
      if (desde && new Date(value) <= new Date(desde as string)) {
        throw new Error('La fecha hasta debe ser posterior a la fecha desde');
      }
      return true;
    }),
  handleValidationErrors
]; 