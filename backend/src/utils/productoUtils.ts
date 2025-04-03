import mongoose from 'mongoose';
import { IProducto } from '../models/Producto';
import { IProductoResponse, IProductoFilters, IPaginatedProductoResult } from '../types/producto';

/**
 * Formatea un documento de producto para la respuesta API
 */
export const formatProductoResponse = (producto: IProducto): IProductoResponse => {
  return {
    id: producto._id.toString(),
    nombre: producto.nombre,
    categoria: producto.categoria,
    precio: producto.precio,
    imagenURL: producto.imagenURL,
    stock: producto.stock,
    estado: producto.estado,
    createdAt: producto.createdAt,
    updatedAt: producto.updatedAt
  };
};

/**
 * Construye una consulta MongoDB para filtrar productos
 */
export const buildProductoFilterQuery = (filters: IProductoFilters = {}): mongoose.FilterQuery<IProducto> => {
  const query: mongoose.FilterQuery<IProducto> = {};

  if (filters.nombre) {
    query.nombre = { $regex: filters.nombre, $options: 'i' };
  }

  if (filters.categoria) {
    query.categoria = { $regex: filters.categoria, $options: 'i' };
  }

  if (filters.estado) {
    query.estado = filters.estado;
  }

  if (filters.precioMin || filters.precioMax) {
    query.precio = {};
    
    if (filters.precioMin) {
      query.precio.$gte = filters.precioMin;
    }
    
    if (filters.precioMax) {
      query.precio.$lte = filters.precioMax;
    }
  }

  if (filters.stockMin || filters.stockMax) {
    query.stock = {};
    
    if (filters.stockMin) {
      query.stock.$gte = filters.stockMin;
    }
    
    if (filters.stockMax) {
      query.stock.$lte = filters.stockMax;
    }
  }

  return query;
};

/**
 * Crea un objeto de respuesta paginada para productos
 */
export const createPaginatedProductoResponse = (
  productos: IProducto[],
  page: number,
  limit: number,
  total: number
): IPaginatedProductoResult => {
  return {
    productos: productos.map(producto => formatProductoResponse(producto)),
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit)
  };
};

/**
 * Verifica si el estado del producto es válido
 */
export const isValidProductoEstado = (estado: string): boolean => {
  const estadosValidos = ['disponible', 'agotado', 'oculto'];
  return estadosValidos.includes(estado);
};

/**
 * Actualiza automáticamente el estado de un producto según su stock
 */
export const actualizarEstadoSegunStock = (producto: IProducto): void => {
  if (producto.stock <= 0 && producto.estado === 'disponible') {
    producto.estado = 'agotado';
  } else if (producto.stock > 0 && producto.estado === 'agotado') {
    producto.estado = 'disponible';
  }
}; 