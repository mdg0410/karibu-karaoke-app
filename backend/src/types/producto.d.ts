import { Document } from 'mongoose';

export type ProductoEstado = 'disponible' | 'agotado' | 'oculto';

// Interfaz para la respuesta API de un producto
export interface IProductoResponse {
  id: string;
  nombre: string;
  categoria: string;
  precio: number;
  imagenURL: string;
  stock: number;
  estado: ProductoEstado;
  createdAt: Date;
  updatedAt: Date;
}

// Interfaz para crear un nuevo producto
export interface IProductoCreate {
  nombre: string;
  categoria: string;
  precio: number;
  imagenURL?: string;
  stock?: number;
  estado?: ProductoEstado;
}

// Interfaz para actualizar un producto existente
export interface IProductoUpdate {
  nombre?: string;
  categoria?: string;
  precio?: number;
  imagenURL?: string;
  stock?: number;
  estado?: ProductoEstado;
}

// Interfaz para cambiar el estado de un producto
export interface ICambioEstadoProducto {
  estado: ProductoEstado;
}

// Interfaz para filtros de búsqueda de productos
export interface IProductoFilters {
  nombre?: string;
  categoria?: string;
  estado?: ProductoEstado;
  precioMin?: number;
  precioMax?: number;
  stockMin?: number;
  stockMax?: number;
}

// Interfaz para paginación y ordenamiento
export interface IProductoPaginationOptions {
  page: number;
  limit: number;
  sortBy?: string;
  order?: 'asc' | 'desc';
}

// Interfaz para resultado paginado
export interface IPaginatedProductoResult {
  productos: IProductoResponse[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
} 