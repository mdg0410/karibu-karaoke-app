import { Document } from 'mongoose';

// Interfaz para la respuesta API de un historial de cierre
export interface IHistorialCierreResponse {
  id: string;
  cajaInicial: number;
  cajaFinal: number;
  efectivoReal: number;
  efectivoCalculado: number;
  diferencia: number;
  ventasEfectivo: number;
  ventasTarjeta: number;
  totalVentas: number;
  totalIngresado: number;
  usuarioApertura: {
    id: string;
    nombre: string;
  };
  usuarioCierre?: {
    id: string;
    nombre: string;
  };
  fechaApertura: Date;
  fechaCierre?: Date;
  abierto: boolean;
  observaciones?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Interfaz para crear un nuevo historial de cierre (apertura de caja)
export interface IHistorialCierreCreate {
  cajaInicial: number;
  observaciones?: string;
}

// Interfaz para actualizar un historial de cierre existente
export interface IHistorialCierreUpdate {
  cajaInicial?: number;
  observaciones?: string;
  abierto?: boolean;
}

// Interfaz para cerrar un historial (cierre de caja)
export interface IHistorialCierreCerrar {
  cajaFinal: number;
  efectivoReal: number;
  observaciones?: string;
}

// Interfaz para filtros de búsqueda de historiales de cierre
export interface IHistorialCierreFilters {
  fechaDesde?: Date;
  fechaHasta?: Date;
  abierto?: boolean;
}

// Interfaz para paginación y ordenamiento
export interface IHistorialCierrePaginationOptions {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Interfaz para resultado paginado
export interface IPaginatedHistorialCierreResult {
  historiales: IHistorialCierreResponse[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
} 