import { Request } from 'express';
import { Document } from 'mongoose';
import { IHistorialCierre } from '../models/HistorialCierre';

// Extender la interfaz Request para incluir el usuario autenticado y otros elementos
export interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    rol: string;
  };
  historialCierre?: Document & IHistorialCierre;
} 