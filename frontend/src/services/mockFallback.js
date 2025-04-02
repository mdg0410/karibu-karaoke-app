/**
 * Servicio de respaldo para simular respuestas de API cuando hay problemas de conexión
 * Esto es temporal hasta que se resuelvan los problemas de CORS en el backend
 */

// Mesas disponibles para pruebas
const MESAS_DISPONIBLES = ['1', '2', '3', '4', '5'];

// Función para verificar si una mesa está disponible
export const verificarMesa = (mesaId) => {
  console.log('Usando servicio de respaldo para verificar mesa:', mesaId);
  
  if (MESAS_DISPONIBLES.includes(mesaId)) {
    return Promise.resolve({
      success: true,
      disponible: true,
      message: 'Mesa disponible'
    });
  } else {
    return Promise.resolve({
      success: false,
      disponible: false,
      message: 'Mesa no disponible o no existe'
    });
  }
};

// Función para registrar a un cliente en una mesa
export const registrarCliente = (datos) => {
  console.log('Usando servicio de respaldo para registrar cliente:', datos);
  
  // Generar un token aleatorio
  const token = Math.random().toString(36).substring(2, 15) + 
                Math.random().toString(36).substring(2, 15);
  
  return Promise.resolve({
    success: true,
    message: 'Cliente registrado exitosamente',
    token,
    cliente: {
      id: Math.floor(Math.random() * 1000),
      nombre: datos.nombre,
      email: datos.email,
      telefono: datos.telefono
    }
  });
};

export default {
  verificarMesa,
  registrarCliente
}; 