import { Request, Response, NextFunction } from 'express';
import Mesa from '../../models/Mesa';

// Tipos para el request con usuario autenticado
interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    rol: string;
  };
}

/**
 * Middleware para verificar permisos de acceso a una mesa específica
 */
export const verificarPermisosMesa = (
  roles: string[] = ['admin', 'trabajador']
) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const user = req.user;

      // Verificar que el usuario esté autenticado
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'No autorizado - Debe iniciar sesión'
        });
      }

      // Verificar que el usuario tenga el rol adecuado
      if (!roles.includes(user.rol)) {
        return res.status(403).json({
          success: false,
          message: `No autorizado - Se requiere uno de estos roles: ${roles.join(', ')}`
        });
      }

      // Si todo es correcto, continuar
      next();
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Error al verificar permisos'
      });
    }
  };
};

/**
 * Middleware para verificar si una mesa existe
 */
export const verificarMesaExiste = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const mesaId = req.params.id;
    
    const mesa = await Mesa.findById(mesaId);
    
    if (!mesa) {
      return res.status(404).json({
        success: false,
        message: 'Mesa no encontrada'
      });
    }
    
    // Adjuntar la mesa al request para no tener que buscarla de nuevo
    (req as any).mesa = mesa;
    
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error al verificar la existencia de la mesa'
    });
  }
};

/**
 * Middleware para verificar si una mesa tiene un estado específico
 */
export const verificarEstadoMesa = (estadosPermitidos: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Si la mesa ya está en el request, usarla
      let mesa = (req as any).mesa;
      
      // Si no, buscarla
      if (!mesa) {
        const mesaId = req.params.id;
        mesa = await Mesa.findById(mesaId);
        
        if (!mesa) {
          return res.status(404).json({
            success: false,
            message: 'Mesa no encontrada'
          });
        }
      }
      
      // Verificar si el estado actual está entre los permitidos
      if (!estadosPermitidos.includes(mesa.estado)) {
        return res.status(400).json({
          success: false,
          message: `Operación no permitida - La mesa debe estar en uno de estos estados: ${estadosPermitidos.join(', ')}`
        });
      }
      
      next();
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Error al verificar el estado de la mesa'
      });
    }
  };
}; 