import express from 'express';
import https from 'https';
import http from 'http';
import fs from 'fs';
import path from 'path';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { connectDB } from './config/database';
import routes from './routes';

// Cargar variables de entorno
dotenv.config();

// Inicializar express
const app = express();
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';
const USE_HTTPS = process.env.USE_HTTPS !== 'false'; // Por defecto usar HTTPS a menos que se especifique lo contrario

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Conectar a MongoDB
connectDB();

// Rutas de la API
app.use('/api', routes);

// Crear servidor HTTP o HTTPS dependiendo del entorno
let server;

if (NODE_ENV === 'development' && USE_HTTPS) {
  try {
    // Intentar leer los certificados
    const options = {
      key: fs.readFileSync(path.join(__dirname, '../certs/server.key')),
      cert: fs.readFileSync(path.join(__dirname, '../certs/server.crt'))
    };
    
    // Crear servidor HTTPS
    server = https.createServer(options, app);
    console.log('Servidor HTTPS configurado correctamente');
  } catch (error) {
    console.warn('No se pudieron cargar los certificados SSL. Usando HTTP por defecto.');
    console.warn('Ejecuta "npm run generate-cert" para generar certificados simplificados.');
    console.warn(`Error: ${(error as Error).message}`);
    
    // Crear servidor HTTP si no hay certificados
    server = http.createServer(app);
  }
} else {
  // Usar HTTP en producción o si se especifica USE_HTTPS=false
  server = http.createServer(app);
  console.log('Usando servidor HTTP');
}

// Función para cerrar la conexión de MongoDB y el servidor
const gracefulShutdown = async () => {
  try {
    console.log('\nIniciando cierre controlado del servidor...');
    
    // Cerrar el servidor HTTP/HTTPS
    await new Promise<void>((resolve) => {
      server.close(() => {
        console.log('Servidor HTTP/HTTPS cerrado correctamente');
        resolve();
      });
    });

    // Cerrar la conexión de MongoDB
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
      console.log('Conexión de MongoDB cerrada correctamente');
    }

    console.log('Proceso de cierre completado');
    process.exit(0);
  } catch (error) {
    console.error('Error durante el cierre del servidor:', error);
    process.exit(1);
  }
};

// Iniciar el servidor
server.listen(PORT, () => {
  console.log(`Servidor corriendo en ${NODE_ENV === 'development' && server instanceof https.Server ? 'https' : 'http'}://localhost:${PORT}`);
  console.log(`Ambiente: ${NODE_ENV}`);
  console.log(`Estado de MongoDB: ${mongoose.connection.readyState === 1 ? 'Conectado' : 'Desconectado'}`);
});

// Manejar señales de terminación
process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);
process.on('uncaughtException', async (error) => {
  console.error('Error no controlado:', error);
  await gracefulShutdown();
});

export default server;
