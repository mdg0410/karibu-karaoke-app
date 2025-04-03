import { Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import HistorialCierre from '../../models/HistorialCierre';
import { AuthenticatedRequest } from '../../types/express';

// Verificar si el usuario tiene permisos para acceder a las funcionalidades de historial de cierre
export const verificarPermisosHistorialCierre = (rolesPermitidos: string[]) => {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return res.status(401).json({ 
          success: false, 
          message: 'No estás autenticado' 
        });
      }

      if (!rolesPermitidos.includes(req.user.rol)) {
        return res.status(403).json({ 
          success: false, 
          message: 'No tienes permiso para realizar esta acción' 
        });
      }

      next();
    } catch (error) {
      return res.status(500).json({ 
        success: false, 
        message: 'Error al verificar permisos', 
        error: error instanceof Error ? error.message : 'Error desconocido' 
      });
    }
  };
};

// Verificar si el historial de cierre existe
export const verificarHistorialCierreExiste = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ 
        success: false, 
        message: 'ID de historial inválido' 
      });
    }

    const historialCierre = await HistorialCierre.findById(id);

    if (!historialCierre) {
      return res.status(404).json({ 
        success: false, 
        message: 'Historial de cierre no encontrado' 
      });
    }

    // Almacenar el historial para uso posterior
    req.historialCierre = historialCierre;
    next();
  } catch (error) {
    return res.status(500).json({ 
      success: false, 
      message: 'Error al verificar historial de cierre', 
      error: error instanceof Error ? error.message : 'Error desconocido' 
    });
  }
};

// Verificar si el historial está abierto
export const verificarHistorialAbierto = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.historialCierre) {
      return res.status(404).json({ 
        success: false, 
        message: 'Historial de cierre no encontrado en la solicitud' 
      });
    }

    if (!req.historialCierre.abierto) {
      return res.status(400).json({ 
        success: false, 
        message: 'Este historial de cierre ya está cerrado' 
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({ 
      success: false, 
      message: 'Error al verificar estado del historial', 
      error: error instanceof Error ? error.message : 'Error desconocido' 
    });
  }
};

// Verificar si ya existe un historial abierto
export const verificarHistorialAbiertoPrevio = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const historialAbierto = await HistorialCierre.findOne({ abierto: true });

    if (historialAbierto) {
      return res.status(400).json({ 
        success: false, 
        message: 'Ya existe un historial de cierre abierto. Debe cerrarlo antes de crear uno nuevo.',
        historialId: historialAbierto._id
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({ 
      success: false, 
      message: 'Error al verificar historial abierto', 
      error: error instanceof Error ? error.message : 'Error desconocido' 
    });
  }
}; 