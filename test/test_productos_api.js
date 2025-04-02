/**
 * Script para probar la API de productos
 * 
 * Ejecutar con: node test_productos_api.js
 */

const API_URL = 'https://localhost:5000/api';

// Función para hacer una petición a la API
async function fetchApi(endpoint, options = {}) {
  try {
    // Desactivar la verificación SSL para desarrollo (no usar en producción)
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
    
    const url = `${API_URL}/${endpoint}`;
    console.log(`Haciendo petición a: ${url}`);
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    });
    
    const data = await response.json();
    return { status: response.status, data };
  } catch (error) {
    console.error(`Error en la petición a ${endpoint}:`, error.message);
    return { status: 500, error: error.message };
  }
}

// Probar obtener todos los productos
async function getAllProducts() {
  console.log('===== Probando obtener todos los productos =====');
  const result = await fetchApi('productos');
  console.log(`Status: ${result.status}`);
  
  if (result.data) {
    if (result.data.success) {
      console.log(`Total productos: ${result.data.count}`);
      if (result.data.data.length > 0) {
        console.log('Primer producto:', JSON.stringify(result.data.data[0], null, 2));
      } else {
        console.log('No se encontraron productos');
      }
    } else {
      console.log('Error:', result.data.message);
    }
  } else {
    console.log('No se recibieron datos');
  }
  console.log('=============================================\n');
  return result;
}

// Probar obtener bebidas
async function getBebidas() {
  console.log('===== Probando obtener bebidas =====');
  const result = await fetchApi('productos/categoria/bebidas');
  console.log(`Status: ${result.status}`);
  
  if (result.data) {
    if (result.data.success) {
      console.log(`Total bebidas: ${result.data.count}`);
      if (result.data.data.length > 0) {
        console.log('Ejemplos de bebidas:');
        result.data.data.slice(0, 3).forEach((bebida, i) => {
          console.log(`${i + 1}. ${bebida.nombre} - Categoría: ${bebida.categoria}`);
        });
      } else {
        console.log('No se encontraron bebidas');
      }
    } else {
      console.log('Error:', result.data.message);
    }
  } else {
    console.log('No se recibieron datos');
  }
  console.log('=============================================\n');
  return result;
}

// Probar obtener comida
async function getComida() {
  console.log('===== Probando obtener comida =====');
  const result = await fetchApi('productos/categoria/comida');
  console.log(`Status: ${result.status}`);
  
  if (result.data) {
    if (result.data.success) {
      console.log(`Total comidas: ${result.data.count}`);
      if (result.data.data.length > 0) {
        console.log('Ejemplos de comidas:');
        result.data.data.slice(0, 3).forEach((comida, i) => {
          console.log(`${i + 1}. ${comida.nombre} - Categoría: ${comida.categoria}`);
        });
      } else {
        console.log('No se encontraron comidas');
      }
    } else {
      console.log('Error:', result.data.message);
    }
  } else {
    console.log('No se recibieron datos');
  }
  console.log('=============================================\n');
  return result;
}

// Ejecutar las pruebas
async function runTests() {
  try {
    console.log('Iniciando pruebas de la API de productos...\n');
    
    // Probar obtener todos los productos
    const allProducts = await getAllProducts();
    
    // Probar obtener bebidas
    const bebidas = await getBebidas();
    
    // Probar obtener comida
    const comida = await getComida();
    
    console.log('Resumen de pruebas:');
    console.log(`- Todos los productos: ${allProducts.data?.success ? 'OK' : 'ERROR'}`);
    console.log(`- Bebidas: ${bebidas.data?.success ? 'OK' : 'ERROR'}`);
    console.log(`- Comida: ${comida.data?.success ? 'OK' : 'ERROR'}`);
    
  } catch (error) {
    console.error('Error en las pruebas:', error);
  }
}

// Ejecutar las pruebas
runTests(); 