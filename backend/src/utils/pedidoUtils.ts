import mongoose from 'mongoose';
import { IPedido } from '../models/Pedido';
import { IPedidoResponse, IPedidoFilters, IPaginatedPedidoResult } from '../types/pedido';

/**
 * Formatea un documento de pedido para la respuesta API
 */
export const formatPedidoResponse = (pedido: IPedido): IPedidoResponse => {
  return {
    id: pedido._id.toString(),
    numeroMesa: pedido.numeroMesa,
    clienteId: pedido.clienteId.toString(),
    detalles: pedido.detalles.map(detalle => ({
      productoId: detalle.productoId.toString(),
      cantidad: detalle.cantidad,
      precioUnitario: detalle.precioUnitario,
      subtotal: detalle.subtotal
    })),
    estado: pedido.estado,
    total: pedido.total,
    historialCambios: pedido.historialCambios.map(cambio => ({
      trabajadorId: cambio.trabajadorId.toString(),
      fechaCambio: cambio.fechaCambio,
      estadoAnterior: cambio.estadoAnterior,
      estadoNuevo: cambio.estadoNuevo,
      comentario: cambio.comentario
    })),
    createdAt: pedido.createdAt,
    updatedAt: pedido.updatedAt
  };
};

/**
 * Construye una consulta MongoDB para filtrar pedidos
 */
export const buildPedidoFilterQuery = (filters: IPedidoFilters = {}): mongoose.FilterQuery<IPedido> => {
  const query: mongoose.FilterQuery<IPedido> = {};

  if (filters.numeroMesa) {
    query.numeroMesa = filters.numeroMesa;
  }

  if (filters.clienteId) {
    query.clienteId = new mongoose.Types.ObjectId(filters.clienteId);
  }

  if (filters.estado) {
    query.estado = filters.estado;
  }

  if (filters.fechaDesde || filters.fechaHasta) {
    query.createdAt = {};
    
    if (filters.fechaDesde) {
      query.createdAt.$gte = filters.fechaDesde;
    }
    
    if (filters.fechaHasta) {
      query.createdAt.$lte = filters.fechaHasta;
    }
  }

  if (filters.trabajadorId) {
    query['historialCambios.trabajadorId'] = new mongoose.Types.ObjectId(filters.trabajadorId);
  }

  if (filters.totalMin || filters.totalMax) {
    query.total = {};
    
    if (filters.totalMin) {
      query.total.$gte = filters.totalMin;
    }
    
    if (filters.totalMax) {
      query.total.$lte = filters.totalMax;
    }
  }

  return query;
};

/**
 * Crea un objeto de respuesta paginada para pedidos
 */
export const createPaginatedPedidoResponse = (
  pedidos: IPedido[],
  page: number,
  limit: number,
  total: number
): IPaginatedPedidoResult => {
  return {
    pedidos: pedidos.map(pedido => formatPedidoResponse(pedido)),
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit)
  };
};

/**
 * Verifica si un estado de pedido es válido
 */
export const isValidPedidoEstado = (estado: string): boolean => {
  const estadosValidos = ['pendiente', 'en preparacion', 'entregado', 'cancelado'];
  return estadosValidos.includes(estado);
};

/**
 * Calcula el subtotal para un detalle de pedido
 */
export const calcularSubtotal = (cantidad: number, precioUnitario: number): number => {
  return cantidad * precioUnitario;
};

/**
 * Calcula el total de un pedido basado en sus detalles
 */
export const calcularTotalPedido = (detalles: { cantidad: number; precioUnitario: number }[]): number => {
  return detalles.reduce((total, detalle) => total + (detalle.cantidad * detalle.precioUnitario), 0);
};

/**
 * Verifica si el cambio de estado es válido según el flujo del negocio
 */
export const isValidEstadoTransition = (estadoActual: string, nuevoEstado: string): boolean => {
  const transicionesValidas: Record<string, string[]> = {
    'pendiente': ['en preparacion', 'cancelado'],
    'en preparacion': ['entregado', 'cancelado'],
    'entregado': ['cancelado'],
    'cancelado': []
  };

  return transicionesValidas[estadoActual]?.includes(nuevoEstado) || false;
}; 