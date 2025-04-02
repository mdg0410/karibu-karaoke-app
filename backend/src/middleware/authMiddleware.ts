import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';

// Interfaz para extender Request con el usuario
interface AuthRequest extends Request {
  user?: any;
}

// Middleware para verificar el token JWT
export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    let token;

    // Verificar si hay token en los headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    // Si no hay token, denegar acceso
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Acceso no autorizado, token no proporcionado'
      });
    }

    try {
      // Verificar el token
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET || 'secret');
      
      // Buscar el usuario por id y excluir la contraseña
      const user = await User.findById(decoded.id).select('-password');
      
      // Si el usuario no existe
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Usuario no encontrado'
        });
      }
      
      // Añadir el usuario a la request
      req.user = user;
      next();
    } catch (error) {
      console.error('Error en la verificación del token:', error);
      return res.status(401).json({
        success: false,
        message: 'Token no válido o expirado'
      });
    }
  } catch (error) {
    console.error('Error en el middleware de autenticación:', error);
    return res.status(500).json({
      success: false,
      message: 'Error en el servidor'
    });
  }
};

// Middleware para verificar si es admin
export const isAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  authenticate(req, res, () => {
    if (req.user && req.user.role === 'admin') {
      next();
    } else {
      res.status(403).json({
        success: false,
        message: 'Acceso denegado: se requieren permisos de administrador'
      });
    }
  });
};

// Middleware para verificar si es staff
export const isStaff = (req: AuthRequest, res: Response, next: NextFunction) => {
  authenticate(req, res, () => {
    if (req.user && (req.user.role === 'staff' || req.user.role === 'admin')) {
      next();
    } else {
      res.status(403).json({
        success: false,
        message: 'Acceso denegado: se requieren permisos de staff'
      });
    }
  });
}; 