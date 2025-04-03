import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../../models/User';

// Interfaz para el token decodificado
interface DecodedToken {
  id: string;
  rol: string;
  iat: number;
  exp: number;
}

// Extender Request para incluir user
interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    rol: string;
  };
}

/**
 * Middleware para verificar y validar el token JWT
 */
export const verificarToken = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'No autorizado - Token no proporcionado'
      });
    }
    
    const token = authHeader.split(' ')[1];
    
    try {
      // Verificar el token
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'tu_clave_secreta'
      ) as DecodedToken;
      
      // Adjuntar la información del usuario al request
      req.user = {
        id: decoded.id,
        rol: decoded.rol
      };
      
      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Token inválido o expirado'
      });
    }
  } catch (error) {
    console.error('Error al verificar token:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al verificar autenticación'
    });
  }
};

/**
 * Middleware para verificar roles permitidos
 */
export const verificarRol = (rolesPermitidos: string[] = []) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      // Verificar que el usuario esté autenticado
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'No autorizado - Debe iniciar sesión'
        });
      }
      
      // Si no hay roles específicos o el array está vacío, permitir acceso
      if (!rolesPermitidos.length) {
        return next();
      }
      
      // Verificar que el rol del usuario esté entre los permitidos
      if (!rolesPermitidos.includes(req.user.rol)) {
        return res.status(403).json({
          success: false,
          message: `Acceso denegado - Se requiere uno de estos roles: ${rolesPermitidos.join(', ')}`
        });
      }
      
      next();
    } catch (error) {
      console.error('Error al verificar rol:', error);
      return res.status(500).json({
        success: false,
        message: 'Error al verificar permisos'
      });
    }
  };
};

/**
 * Middleware para verificar si el usuario existe
 */
export const verificarUsuarioExiste = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.params.id;
    
    const user = await User.findById(userId).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }
    
    // Adjuntar el usuario al request para no tener que buscarlo de nuevo
    (req as any).usuarioEncontrado = user;
    
    next();
  } catch (error) {
    console.error('Error al verificar usuario:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al verificar la existencia del usuario'
    });
  }
};

/**
 * Middleware para verificar si el usuario autenticado es el mismo que está siendo modificado
 * o si es un administrador
 */
export const verificarPropietarioOAdmin = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // Verificar que el usuario esté autenticado
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'No autorizado - Debe iniciar sesión'
      });
    }
    
    const usuarioId = req.params.id;
    
    // Permitir si es el mismo usuario o un administrador
    if (req.user.id === usuarioId || req.user.rol === 'admin') {
      return next();
    }
    
    return res.status(403).json({
      success: false,
      message: 'No tiene permisos para realizar esta operación'
    });
  } catch (error) {
    console.error('Error al verificar propietario:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al verificar permisos'
    });
  }
}; 