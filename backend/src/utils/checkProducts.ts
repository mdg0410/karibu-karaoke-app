import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { connectDB } from '../config/database';

// Cargar variables de entorno
dotenv.config({ path: '.env' });

// Función principal
async function checkProducts() {
  try {
    // Conectar a la base de datos
    await connectDB();
    console.log('Conectado a MongoDB');
    
    // Obtener una referencia a la colección 'products'
    const productsCollection = mongoose.connection.collection('products');
    
    // Contar productos
    const count = await productsCollection.countDocuments();
    console.log(`Total de productos en la colección: ${count}`);
    
    if (count === 0) {
      console.log('No hay productos en la base de datos.');
      process.exit(0);
    }
    
    // Obtener todos los productos
    const productos = await productsCollection.find({}).toArray();
    
    // Mostrar estructura del primer producto
    console.log('\nEstructura del primer producto:');
    console.log(JSON.stringify(productos[0], null, 2));
    
    // Listar todos los productos
    console.log('\nLista de todos los productos:');
    productos.forEach((producto, index) => {
      console.log(`${index + 1}. ${producto.nombre} (${producto.categoria}) - $${producto.precio}`);
    });
    
    // Contar por categoría
    const categorias = {};
    productos.forEach(p => {
      const cat = p.categoria || 'sin-categoria';
      categorias[cat] = (categorias[cat] || 0) + 1;
    });
    
    console.log('\nProductos por categoría:');
    Object.entries(categorias).forEach(([cat, count]) => {
      console.log(`${cat}: ${count}`);
    });
    
    // Verificar campos
    console.log('\nVerificación de campos críticos:');
    const camposFaltantes = {};
    
    ['nombre', 'categoria', 'precio', 'imagenURL', 'cantidad', 'estado'].forEach(campo => {
      const productosSinCampo = productos.filter(p => p[campo] === undefined);
      if (productosSinCampo.length > 0) {
        camposFaltantes[campo] = productosSinCampo.length;
        console.log(`- ${productosSinCampo.length} productos sin el campo '${campo}'`);
      }
    });
    
    if (Object.keys(camposFaltantes).length === 0) {
      console.log('Todos los productos tienen los campos necesarios.');
    }
    
  } catch (error) {
    console.error('Error al verificar los productos:', error);
  } finally {
    // Cerrar la conexión
    console.log('\nCerrando conexión...');
    setTimeout(() => mongoose.connection.close(), 1000);
  }
}

// Ejecutar la función
checkProducts(); 