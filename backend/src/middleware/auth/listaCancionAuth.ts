import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import ListaCanciones, { IListaCanciones } from '../../models/ListaCanciones';
import Cancion from '../../models/Cancion';

// Extender la interfaz Request para incluir el usuario autenticado
interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    rol: string;
  };
}

/**
 * Verifica si el usuario tiene los permisos necesarios según su rol
 */
export const verificarPermisosListaCancion = (rolesPermitidos: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { user } = req;

      if (!user) {
        return res.status(401).json({
          message: 'No autenticado'
        });
      }

      if (!rolesPermitidos.includes(user.rol)) {
        return res.status(403).json({
          message: 'No autorizado para realizar esta acción'
        });
      }

      next();
    } catch (error) {
      console.error('Error al verificar permisos:', error);
      return res.status(500).json({
        message: 'Error al verificar permisos'
      });
    }
  };
};

/**
 * Verifica que una lista de canciones exista
 */
export const verificarListaCancionExiste = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const listaId = req.params.id;
    
    if (!mongoose.Types.ObjectId.isValid(listaId)) {
      return res.status(400).json({
        message: 'ID de lista no válido'
      });
    }
    
    const lista = await ListaCanciones.findById(listaId);
    
    if (!lista) {
      return res.status(404).json({
        message: 'Lista de canciones no encontrada'
      });
    }
    
    next();
  } catch (error) {
    console.error('Error al verificar existencia de lista:', error);
    return res.status(500).json({
      message: 'Error al verificar la existencia de la lista'
    });
  }
};

/**
 * Verifica que las canciones seleccionadas existan y estén activas
 */
export const verificarCancionesValidas = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const numerosCanciones = req.body.canciones;
    
    if (!Array.isArray(numerosCanciones) || numerosCanciones.length === 0) {
      return res.status(400).json({
        message: 'Debe proporcionar al menos una canción'
      });
    }
    
    if (numerosCanciones.length > 3) {
      return res.status(400).json({
        message: 'No puede solicitar más de 3 canciones a la vez'
      });
    }
    
    // Verificar que todas las canciones existan y estén activas
    const canciones = await Cancion.find({
      numeroCancion: { $in: numerosCanciones },
      estado: 'activa'
    });
    
    if (canciones.length !== numerosCanciones.length) {
      return res.status(400).json({
        message: 'Una o más canciones no existen o no están disponibles'
      });
    }
    
    next();
  } catch (error) {
    console.error('Error al verificar canciones:', error);
    return res.status(500).json({
      message: 'Error al verificar las canciones'
    });
  }
};

/**
 * Verifica que el cliente pueda ver o modificar la lista (es dueño o es admin/staff)
 */
export const verificarPropietarioOStaff = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const listaId = req.params.id;
    const { user } = req;
    
    if (!user) {
      return res.status(401).json({
        message: 'No autenticado'
      });
    }
    
    const lista = await ListaCanciones.findById(listaId) as IListaCanciones;
    
    if (!lista) {
      return res.status(404).json({
        message: 'Lista de canciones no encontrada'
      });
    }
    
    // Si es admin o trabajador, puede acceder a cualquier lista
    if (['admin', 'trabajador'].includes(user.rol)) {
      return next();
    }
    
    // Si es cliente, solo puede acceder a sus propias listas
    if (user.rol === 'cliente' && lista.clienteId.toString() === user.id) {
      return next();
    }
    
    return res.status(403).json({
      message: 'No tienes permiso para acceder a esta lista de canciones'
    });
  } catch (error) {
    console.error('Error al verificar propietario:', error);
    return res.status(500).json({
      message: 'Error al verificar permiso de acceso'
    });
  }
};

/**
 * Verifica que la lista esté en un estado específico
 */
export const verificarEstadoLista = (estadosPermitidos: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const listaId = req.params.id;
      
      const lista = await ListaCanciones.findById(listaId) as IListaCanciones;
      
      if (!lista) {
        return res.status(404).json({
          message: 'Lista de canciones no encontrada'
        });
      }
      
      if (!estadosPermitidos.includes(lista.estadoReproduccion)) {
        return res.status(400).json({
          message: `La lista debe estar en uno de los siguientes estados: ${estadosPermitidos.join(', ')}`
        });
      }
      
      next();
    } catch (error) {
      console.error('Error al verificar estado de lista:', error);
      return res.status(500).json({
        message: 'Error al verificar el estado de la lista'
      });
    }
  };
}; 