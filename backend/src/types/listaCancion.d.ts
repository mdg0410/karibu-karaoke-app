import { Document } from 'mongoose';

export type EstadoReproduccion = 'pendiente' | 'en reproduccion' | 'finalizado';
export type EstadoPago = 'pendiente' | 'pagado' | 'gratis';

// Interfaz para la respuesta API de un ítem de lista de canciones
export interface IListaCancionResponse {
  id: string;
  canciones: {
    id: string;
    numeroCancion: number;
    titulo: string;
    artista: string;
  }[];
  numeroMesa: number;
  cliente: {
    id: string;
    nombre: string;
  };
  estadoReproduccion: EstadoReproduccion;
  estadoPago: EstadoPago;
  createdAt: Date;
  updatedAt: Date;
}

// Interfaz para crear una nueva lista de canciones
export interface IListaCancionCreate {
  canciones: number[]; // Array de números de canción
  numeroMesa: number;
  clienteId: string;
  estadoReproduccion?: EstadoReproduccion;
  estadoPago?: EstadoPago;
}

// Interfaz para actualizar una lista de canciones existente
export interface IListaCancionUpdate {
  canciones?: number[];
  numeroMesa?: number;
  clienteId?: string;
  estadoReproduccion?: EstadoReproduccion;
  estadoPago?: EstadoPago;
}

// Interfaz para cambiar el estado de reproducción
export interface ICambioEstadoReproduccion {
  estadoReproduccion: EstadoReproduccion;
}

// Interfaz para cambiar el estado de pago
export interface ICambioEstadoPago {
  estadoPago: EstadoPago;
}

// Interfaz para filtros de búsqueda de listas de canciones
export interface IListaCancionFilters {
  numeroMesa?: number;
  clienteId?: string;
  estadoReproduccion?: EstadoReproduccion;
  estadoPago?: EstadoPago;
  fechaInicio?: Date;
  fechaFin?: Date;
  incluirCanciones?: boolean;
}

// Interfaz para paginación y ordenamiento
export interface IListaCancionPaginationOptions {
  page: number;
  limit: number;
  sortBy?: string;
  order?: 'asc' | 'desc';
}

// Interfaz para resultado paginado
export interface IPaginatedListaCancionResult {
  listasCanciones: IListaCancionResponse[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
} 