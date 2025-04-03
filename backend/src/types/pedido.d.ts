import { Document } from 'mongoose';

// Interfaz para historial de cambios
export interface IHistorialCambio {
  trabajadorId: string;
  nombreTrabajador?: string;
  fechaCambio: Date;
  estadoAnterior: string;
  estadoNuevo: string;
  comentario?: string;
}

// Interfaz para detalles de productos en pedido
export interface IDetallePedido {
  productoId: string;
  nombreProducto?: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

// Interfaz para respuesta de API de un pedido
export interface IPedidoResponse {
  id: string;
  numeroMesa: number;
  clienteId: string;
  nombreCliente?: string;
  detalles: IDetallePedido[];
  estado: 'pendiente' | 'en preparacion' | 'entregado' | 'cancelado';
  total: number;
  historialCambios: IHistorialCambio[];
  createdAt: Date;
  updatedAt: Date;
}

// Interfaz para crear un nuevo pedido
export interface IPedidoCreate {
  numeroMesa: number;
  clienteId: string;
  detalles: {
    productoId: string;
    cantidad: number;
    precioUnitario?: number;
  }[];
  estado?: 'pendiente' | 'en preparacion' | 'entregado' | 'cancelado';
}

// Interfaz para actualizar un pedido existente
export interface IPedidoUpdate {
  estado?: 'pendiente' | 'en preparacion' | 'entregado' | 'cancelado';
  detalles?: {
    productoId: string;
    cantidad: number;
    precioUnitario?: number;
  }[];
  comentario?: string;
}

// Interfaz para agregar un producto al pedido
export interface IAgregarProducto {
  productoId: string;
  cantidad: number;
  precioUnitario?: number;
}

// Interfaz para cambiar el estado de un pedido
export interface ICambioEstadoPedido {
  estado: 'pendiente' | 'en preparacion' | 'entregado' | 'cancelado';
  trabajadorId: string;
  comentario?: string;
}

// Interfaz para filtros de búsqueda de pedidos
export interface IPedidoFilters {
  numeroMesa?: number;
  clienteId?: string;
  estado?: 'pendiente' | 'en preparacion' | 'entregado' | 'cancelado';
  fechaDesde?: Date;
  fechaHasta?: Date;
  trabajadorId?: string;
  totalMin?: number;
  totalMax?: number;
}

// Interfaz para paginación y ordenamiento
export interface IPedidoPaginationOptions {
  page: number;
  limit: number;
  sortBy?: string;
  order?: 'asc' | 'desc';
}

// Interfaz para resultado paginado
export interface IPaginatedPedidoResult {
  pedidos: IPedidoResponse[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
} 