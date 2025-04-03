import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Producto, { IProducto } from '../models/Producto';
import { 
  formatProductoResponse,
  buildProductoFilterQuery,
  createPaginatedProductoResponse,
  actualizarEstadoSegunStock
} from '../utils/productoUtils';
import { 
  IProductoCreate, 
  IProductoUpdate, 
  ICambioEstadoProducto,
  IProductoFilters,
  IProductoPaginationOptions
} from '../types/producto';

// Interfaz para Request con user autenticado
interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    rol: string;
  };
}

/**
 * Obtener todos los productos
 * @route GET /api/productos
 * @access Público
 */
export const getProductos = async (req: Request, res: Response) => {
  try {
    // Extraer parámetros de paginación y ordenamiento
    const { 
      page = 1, 
      limit = 10, 
      sortBy = 'nombre', 
      order = 'asc' 
    } = req.query as unknown as IProductoPaginationOptions;

    // Extraer filtros
    const filters: IProductoFilters = {
      nombre: req.query.nombre as string,
      categoria: req.query.categoria as string,
      estado: req.query.estado as any,
      precioMin: req.query.precioMin ? Number(req.query.precioMin) : undefined,
      precioMax: req.query.precioMax ? Number(req.query.precioMax) : undefined,
      stockMin: req.query.stockMin ? Number(req.query.stockMin) : undefined,
      stockMax: req.query.stockMax ? Number(req.query.stockMax) : undefined
    };

    // Construir la consulta con los filtros
    const query = buildProductoFilterQuery(filters);

    // Contar el total de documentos que coinciden con los filtros
    const total = await Producto.countDocuments(query);

    // Obtener los productos paginados
    const productos = await Producto.find(query)
      .sort({ [sortBy]: order === 'asc' ? 1 : -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    // Crear respuesta paginada
    const response = createPaginatedProductoResponse(productos, page, limit, total);
    
    return res.status(200).json(response);
  } catch (error) {
    console.error('Error al obtener productos:', error);
    return res.status(500).json({ 
      message: 'Error al obtener los productos',
      error: (error as Error).message 
    });
  }
};

/**
 * Obtener productos por categoría
 * @route GET /api/productos/categoria/:categoria
 * @access Público
 */
export const getProductosPorCategoria = async (req: Request, res: Response) => {
  try {
    const { categoria } = req.params;
    
    // Extraer parámetros de paginación y ordenamiento
    const { 
      page = 1, 
      limit = 10, 
      sortBy = 'nombre', 
      order = 'asc' 
    } = req.query as unknown as IProductoPaginationOptions;

    let query: mongoose.FilterQuery<IProducto> = {};
    
    if (categoria === 'bebidas') {
      // Obtener todos los productos que NO son de categoría comida
      query = { 
        categoria: { $ne: 'comida' } 
      };
    } else if (categoria === 'comida') {
      // Obtener productos de categoría comida
      query = { categoria: 'comida' };
    } else {
      // Si se especifica otra categoría, buscar por esa categoría (case insensitive)
      query = { 
        categoria: { $regex: categoria, $options: 'i' } 
      };
    }

    // Contar el total de documentos que coinciden con los filtros
    const total = await Producto.countDocuments(query);

    // Obtener los productos paginados
    const productos = await Producto.find(query)
      .sort({ [sortBy]: order === 'asc' ? 1 : -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    // Crear respuesta paginada
    const response = createPaginatedProductoResponse(productos, page, limit, total);
    
    return res.status(200).json(response);
  } catch (error) {
    console.error(`Error al obtener productos de categoría ${req.params.categoria}:`, error);
    return res.status(500).json({ 
      message: `Error al obtener productos de categoría ${req.params.categoria}`,
      error: (error as Error).message 
    });
  }
};

/**
 * Obtener un producto por ID
 * @route GET /api/productos/:id
 * @access Público
 */
export const getProductoById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // Verificar si el ID es válido
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'ID de producto no válido' });
    }
    
    const producto = await Producto.findById(id);
    
    if (!producto) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    
    return res.status(200).json({
      producto: formatProductoResponse(producto)
    });
  } catch (error) {
    console.error('Error al obtener producto por ID:', error);
    return res.status(500).json({ 
      message: 'Error al obtener producto',
      error: (error as Error).message 
    });
  }
};

/**
 * Obtener todas las categorías disponibles
 * @route GET /api/productos/categorias
 * @access Público
 */
export const getCategorias = async (req: Request, res: Response) => {
  try {
    const categorias = await Producto.distinct('categoria');
    
    return res.status(200).json({
      categorias
    });
  } catch (error) {
    console.error('Error al obtener categorías:', error);
    return res.status(500).json({ 
      message: 'Error al obtener categorías',
      error: (error as Error).message 
    });
  }
};

/**
 * Crear un nuevo producto
 * @route POST /api/productos
 * @access Privado (solo admin)
 */
export const createProducto = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const datosProducto = req.body as IProductoCreate;
    
    // Crear nuevo producto
    const nuevoProducto = new Producto({
      nombre: datosProducto.nombre,
      categoria: datosProducto.categoria,
      precio: datosProducto.precio,
      imagenURL: datosProducto.imagenURL || 'default-producto.jpg',
      stock: datosProducto.stock || 0,
      estado: datosProducto.estado || 'disponible'
    });
    
    // Actualizar estado según stock
    actualizarEstadoSegunStock(nuevoProducto);
    
    await nuevoProducto.save();
    
    return res.status(201).json({
      message: 'Producto creado exitosamente',
      producto: formatProductoResponse(nuevoProducto)
    });
  } catch (error) {
    console.error('Error al crear producto:', error);
    return res.status(400).json({ 
      message: 'Error al crear producto',
      error: (error as Error).message 
    });
  }
};

/**
 * Actualizar un producto
 * @route PUT /api/productos/:id
 * @access Privado (solo admin)
 */
export const updateProducto = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const datosActualizacion = req.body as IProductoUpdate;
    
    // Verificar si el ID es válido
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'ID de producto no válido' });
    }
    
    const producto = await Producto.findById(id);
    if (!producto) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    
    // Actualizar campos
    if (datosActualizacion.nombre) producto.nombre = datosActualizacion.nombre;
    if (datosActualizacion.categoria) producto.categoria = datosActualizacion.categoria;
    if (datosActualizacion.precio !== undefined) producto.precio = datosActualizacion.precio;
    if (datosActualizacion.imagenURL) producto.imagenURL = datosActualizacion.imagenURL;
    if (datosActualizacion.stock !== undefined) producto.stock = datosActualizacion.stock;
    if (datosActualizacion.estado) producto.estado = datosActualizacion.estado;
    
    // Actualizar estado según stock si no se especificó estado
    if (datosActualizacion.stock !== undefined && !datosActualizacion.estado) {
      actualizarEstadoSegunStock(producto);
    }
    
    await producto.save();
    
    return res.status(200).json({
      message: 'Producto actualizado exitosamente',
      producto: formatProductoResponse(producto)
    });
  } catch (error) {
    console.error('Error al actualizar producto:', error);
    return res.status(400).json({ 
      message: 'Error al actualizar producto',
      error: (error as Error).message 
    });
  }
};

/**
 * Cambiar el estado de un producto
 * @route PATCH /api/productos/:id/estado
 * @access Privado (solo admin)
 */
export const cambiarEstadoProducto = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { estado } = req.body as ICambioEstadoProducto;
    
    // Verificar si el ID es válido
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'ID de producto no válido' });
    }
    
    const producto = await Producto.findById(id);
    if (!producto) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    
    producto.estado = estado;
    await producto.save();
    
    return res.status(200).json({
      message: 'Estado del producto actualizado exitosamente',
      producto: formatProductoResponse(producto)
    });
  } catch (error) {
    console.error('Error al cambiar estado del producto:', error);
    return res.status(400).json({ 
      message: 'Error al cambiar estado del producto',
      error: (error as Error).message 
    });
  }
};

/**
 * Eliminar un producto
 * @route DELETE /api/productos/:id
 * @access Privado (solo admin)
 */
export const deleteProducto = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    
    // Verificar si el ID es válido
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'ID de producto no válido' });
    }
    
    const producto = await Producto.findByIdAndDelete(id);
    
    if (!producto) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    
    return res.status(200).json({
      message: 'Producto eliminado exitosamente'
    });
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    return res.status(500).json({ 
      message: 'Error al eliminar producto',
      error: (error as Error).message 
    });
  }
}; 