import request from 'supertest';
import mongoose from 'mongoose';
import { connectDB, disconnectDB } from '../config/database';
import Cliente from '../models/Cliente';
import server from '../server';
// Importamos explícitamente las funciones de Jest
import { beforeAll, afterAll, describe, test, expect } from '@jest/globals';

// Cliente de prueba
const testCliente = {
  nombre: 'Cliente Test',
  email: 'test@example.com'
};

// Conectar a la base de datos antes de las pruebas
beforeAll(async () => {
  await connectDB();
});

// Limpiar la base de datos después de las pruebas
afterAll(async () => {
  await Cliente.deleteMany({});
  await disconnectDB();
  if (server.close) {
    server.close();
  }
});

describe('Rutas de Cliente', () => {
  let clienteId: string;
  
  // Crear un cliente para las pruebas
  test('Debería crear un nuevo cliente', async () => {
    const response = await request(server)
      .post('/api/cliente')
      .send(testCliente);
      
    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveProperty('_id');
    expect(response.body.data.nombre).toBe(testCliente.nombre);
    expect(response.body.data.email).toBe(testCliente.email);
    
    clienteId = response.body.data._id;
  });
  
  // Probar la generación de token
  test('Debería generar un token JWT para un cliente existente', async () => {
    const response = await request(server)
      .get(`/api/cliente/${clienteId}`);
      
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body).toHaveProperty('token');
    expect(response.body.cliente).toHaveProperty('id', clienteId);
    expect(response.body.cliente.nombre).toBe(testCliente.nombre);
  });
  
  // Probar cliente no encontrado
  test('Debería retornar 404 para un cliente que no existe', async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const response = await request(server)
      .get(`/api/cliente/${fakeId}`);
      
    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe('Cliente no encontrado');
  });
});
