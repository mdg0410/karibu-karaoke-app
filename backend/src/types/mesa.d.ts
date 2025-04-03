import { Document } from 'mongoose';
import { IUser } from '../models/User';

// Interfaz para el historial de una mesa
export interface IMesaHistorial {
  usuarioId: string;
  nombreUsuario?: string;
  fechaInicio: Date;
  fechaFin?: Date;
  estado: string;
}

// Interfaz para respuesta de API de una sola mesa
export interface IMesaResponse {
  id: string;
  numero: number;
  capacidad: number;
  estado: 'disponible' | 'ocupada' | 'reservada';
  historial?: IMesaHistorial[];
  createdAt: Date;
  updatedAt: Date;
}

// Interfaz para actualización del estado de una mesa
export interface IMesaEstadoUpdate {
  estado: 'disponible' | 'ocupada' | 'reservada';
  usuarioId: string;
  fechaInicio?: Date;
  fechaFin?: Date;
}

// Interfaz para crear una nueva mesa
export interface IMesaCreate {
  numero: number;
  capacidad: number;
  estado?: 'disponible' | 'ocupada' | 'reservada';
}

// Interfaz para actualizar una mesa existente
export interface IMesaUpdate {
  capacidad?: number;
  estado?: 'disponible' | 'ocupada' | 'reservada';
}

// Interfaz para filtros de búsqueda de mesas
export interface IMesaFilters {
  estado?: 'disponible' | 'ocupada' | 'reservada';
  capacidadMin?: number;
  capacidadMax?: number;
  fechaDesde?: Date;
  fechaHasta?: Date;
}

// Interfaz para paginación y ordenamiento
export interface IMesaPaginationOptions {
  page: number;
  limit: number;
  sortBy?: string;
  order?: 'asc' | 'desc';
}

// Interfaz para resultado paginado
export interface IPaginatedMesaResult {
  mesas: IMesaResponse[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
} 