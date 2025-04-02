import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Producto, { IProducto } from '../models/Producto';

/**
 * Obtener todos los productos
 * @route GET /api/productos
 * @access Público
 */
export const getProductos = async (req: Request, res: Response) => {
  try {
    console.log('Solicitando todos los productos');
    
    // Obtener referencia directa a la colección
    const productosCollection = mongoose.connection.collection('products');
    const productos = await productosCollection.find({}).toArray();
    
    console.log(`Se encontraron ${productos.length} productos directamente de la colección`);
    if (productos.length > 0) {
      console.log('Muestra del primer producto:', JSON.stringify(productos[0], null, 2));
    }
    
    res.status(200).json({ 
      success: true,
      count: productos.length,
      data: productos
    });
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener productos',
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
    console.log(`Solicitando productos de categoría: ${categoria}`);
    
    // Obtener referencia directa a la colección
    const productosCollection = mongoose.connection.collection('products');
    let query = {};
    
    if (categoria === 'bebidas') {
      // Obtener todos los productos que NO son de categoría comida (case insensitive)
      console.log('Buscando productos que NO son de categoría comida');
      query = { 
        categoria: { 
          $not: { 
            $regex: /^comida$/i // Expresión regular para "comida" case insensitive
          } 
        } 
      };
    } else if (categoria === 'comida') {
      // Obtener productos de categoría comida (case insensitive)
      console.log('Buscando productos de categoría comida');
      query = { 
        categoria: { 
          $regex: /^comida$/i // Expresión regular para "comida" case insensitive
        } 
      };
    } else {
      // Si se especifica otra categoría, buscar por esa categoría (case insensitive)
      console.log(`Buscando productos de categoría específica: ${categoria}`);
      query = { 
        categoria: { 
          $regex: new RegExp(`^${categoria}$`, 'i') 
        } 
      };
    }
    
    // Log de la consulta que se realizará
    console.log('Query a ejecutar:', JSON.stringify(query));
    
    const productos = await productosCollection.find(query).toArray();
    
    console.log(`Se encontraron ${productos.length} productos para la categoría ${categoria}`);
    if (productos.length > 0) {
      console.log('Muestra del primer producto:', JSON.stringify(productos[0], null, 2));
    } else {
      // Log adicional para diagnóstico
      console.log('No se encontraron productos. Verificando categorías disponibles...');
      const todasCategorias = await productosCollection.distinct('categoria');
      console.log('Categorías disponibles en la BD:', todasCategorias);
    }
    
    res.status(200).json({ 
      success: true,
      count: productos.length,
      data: productos
    });
  } catch (error) {
    console.error(`Error al obtener productos de categoría ${req.params.categoria}:`, error);
    res.status(500).json({
      success: false,
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
    console.log(`Solicitando producto con ID: ${id}`);
    
    // Verificar si el ID es válido
    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.log(`ID no válido: ${id}`);
      return res.status(400).json({
        success: false,
        message: 'ID de producto no válido'
      });
    }
    
    // Obtener referencia directa a la colección
    const productosCollection = mongoose.connection.collection('products');
    const producto = await productosCollection.findOne({ _id: new mongoose.Types.ObjectId(id) });
    
    if (!producto) {
      console.log(`Producto con ID ${id} no encontrado`);
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado'
      });
    }
    
    console.log(`Producto encontrado:`, JSON.stringify(producto, null, 2));
    
    res.status(200).json({ 
      success: true,
      data: producto
    });
  } catch (error) {
    console.error('Error al obtener producto por ID:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener producto',
      error: (error as Error).message
    });
  }
};

/**
 * Crear un nuevo producto
 * @route POST /api/productos
 * @access Privado (solo admin)
 */
export const createProducto = async (req: Request, res: Response) => {
  try {
    console.log('Creando nuevo producto:', req.body);
    
    // Verificar campos requeridos
    const { nombre, categoria, precio } = req.body;
    if (!nombre || !categoria || precio === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Faltan campos requeridos: nombre, categoria y precio son obligatorios'
      });
    }
    
    // Obtener referencia directa a la colección
    const productosCollection = mongoose.connection.collection('products');
    
    // Insertar el documento
    const resultado = await productosCollection.insertOne({
      ...req.body,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    // Obtener el documento insertado
    const nuevoProducto = await productosCollection.findOne({ _id: resultado.insertedId });
    
    console.log(`Producto creado con ID: ${resultado.insertedId}`);
    
    res.status(201).json({ 
      success: true,
      message: 'Producto creado correctamente',
      data: nuevoProducto
    });
  } catch (error) {
    console.error('Error al crear producto:', error);
    res.status(400).json({
      success: false,
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
export const updateProducto = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    console.log(`Actualizando producto con ID: ${id}`, req.body);
    
    // Verificar si el ID es válido
    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.log(`ID no válido: ${id}`);
      return res.status(400).json({
        success: false,
        message: 'ID de producto no válido'
      });
    }
    
    // Obtener referencia directa a la colección
    const productosCollection = mongoose.connection.collection('products');
    
    // Actualizar el documento
    const resultado = await productosCollection.updateOne(
      { _id: new mongoose.Types.ObjectId(id) },
      { 
        $set: { 
          ...req.body,
          updatedAt: new Date()
        } 
      }
    );
    
    if (resultado.matchedCount === 0) {
      console.log(`Producto con ID ${id} no encontrado para actualizar`);
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado'
      });
    }
    
    // Obtener el documento actualizado
    const productoActualizado = await productosCollection.findOne({ _id: new mongoose.Types.ObjectId(id) });
    
    console.log(`Producto actualizado:`, JSON.stringify(productoActualizado, null, 2));
    
    res.status(200).json({ 
      success: true,
      message: 'Producto actualizado correctamente',
      data: productoActualizado
    });
  } catch (error) {
    console.error('Error al actualizar producto:', error);
    res.status(400).json({
      success: false,
      message: 'Error al actualizar producto',
      error: (error as Error).message
    });
  }
};

/**
 * Eliminar un producto
 * @route DELETE /api/productos/:id
 * @access Privado (solo admin)
 */
export const deleteProducto = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    console.log(`Eliminando producto con ID: ${id}`);
    
    // Verificar si el ID es válido
    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.log(`ID no válido: ${id}`);
      return res.status(400).json({
        success: false,
        message: 'ID de producto no válido'
      });
    }
    
    // Obtener referencia directa a la colección
    const productosCollection = mongoose.connection.collection('products');
    
    // Buscar el producto antes de eliminarlo
    const producto = await productosCollection.findOne({ _id: new mongoose.Types.ObjectId(id) });
    
    if (!producto) {
      console.log(`Producto con ID ${id} no encontrado para eliminar`);
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado'
      });
    }
    
    // Eliminar el documento
    await productosCollection.deleteOne({ _id: new mongoose.Types.ObjectId(id) });
    
    console.log(`Producto eliminado:`, JSON.stringify(producto, null, 2));
    
    res.status(200).json({ 
      success: true,
      message: 'Producto eliminado correctamente'
    });
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar producto',
      error: (error as Error).message
    });
  }
};

/**
 * Cambiar el estado de un producto
 * @route PATCH /api/productos/:id/estado
 * @access Privado (solo admin)
 */
export const cambiarEstadoProducto = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;
    console.log(`Cambiando estado del producto con ID: ${id} a ${estado}`);
    
    // Verificar si el ID es válido
    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.log(`ID no válido: ${id}`);
      return res.status(400).json({
        success: false,
        message: 'ID de producto no válido'
      });
    }
    
    if (!estado || !['disponible', 'agotado', 'oculto'].includes(estado)) {
      console.log(`Estado inválido: ${estado}`);
      return res.status(400).json({
        success: false,
        message: 'Estado no válido'
      });
    }
    
    // Obtener referencia directa a la colección
    const productosCollection = mongoose.connection.collection('products');
    
    // Actualizar el documento
    const resultado = await productosCollection.updateOne(
      { _id: new mongoose.Types.ObjectId(id) },
      { 
        $set: { 
          estado,
          updatedAt: new Date()
        } 
      }
    );
    
    if (resultado.matchedCount === 0) {
      console.log(`Producto con ID ${id} no encontrado para cambiar estado`);
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado'
      });
    }
    
    // Obtener el documento actualizado
    const producto = await productosCollection.findOne({ _id: new mongoose.Types.ObjectId(id) });
    
    console.log(`Estado del producto actualizado:`, JSON.stringify(producto, null, 2));
    
    res.status(200).json({ 
      success: true,
      message: `Producto marcado como ${estado}`,
      data: producto
    });
  } catch (error) {
    console.error('Error al cambiar estado del producto:', error);
    res.status(500).json({
      success: false,
      message: 'Error al cambiar estado del producto',
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
    console.log('Solicitando todas las categorías disponibles');
    
    // Obtener referencia directa a la colección
    const productosCollection = mongoose.connection.collection('products');
    
    // Obtener categorías únicas
    const categorias = await productosCollection.distinct('categoria');
    
    console.log(`Se encontraron ${categorias.length} categorías distintas:`, categorias);
    
    res.status(200).json({ 
      success: true,
      count: categorias.length,
      data: categorias
    });
  } catch (error) {
    console.error('Error al obtener categorías:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener categorías',
      error: (error as Error).message
    });
  }
}; 