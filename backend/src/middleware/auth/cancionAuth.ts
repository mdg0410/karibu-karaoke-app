import { Request, Response, NextFunction } from 'express';
import Cancion from '../../models/Cancion';

// Tipos para el request con usuario autenticado
interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    rol: string;
  };
}

/**
 * Middleware para verificar permisos de acceso a operaciones con canciones
 */
export const verificarPermisosCancion = (
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
 * Middleware para verificar si una canción existe
 */
export const verificarCancionExiste = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const cancionId = req.params.id;
    
    const cancion = await Cancion.findById(cancionId);
    
    if (!cancion) {
      return res.status(404).json({
        success: false,
        message: 'Canción no encontrada'
      });
    }
    
    // Adjuntar la canción al request para no tener que buscarla de nuevo
    (req as any).cancion = cancion;
    
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error al verificar la existencia de la canción'
    });
  }
};

/**
 * Middleware para verificar si una canción tiene un estado específico
 */
export const verificarEstadoCancion = (estadosPermitidos: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Si la canción ya está en el request, usarla
      let cancion = (req as any).cancion;
      
      // Si no, buscarla
      if (!cancion) {
        const cancionId = req.params.id;
        cancion = await Cancion.findById(cancionId);
        
        if (!cancion) {
          return res.status(404).json({
            success: false,
            message: 'Canción no encontrada'
          });
        }
      }
      
      // Verificar si el estado actual está entre los permitidos
      if (!estadosPermitidos.includes(cancion.estado)) {
        return res.status(400).json({
          success: false,
          message: `Operación no permitida - La canción debe estar en uno de estos estados: ${estadosPermitidos.join(', ')}`
        });
      }
      
      next();
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Error al verificar el estado de la canción'
      });
    }
  };
}; 