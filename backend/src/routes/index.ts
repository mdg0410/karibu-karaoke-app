import express from 'express';
import userRoutes from './userRoutes';
import mesasRoutes from './mesasRoutes';
import productoRoutes from './productoRoutes';
import cancionesRoutes from './cancionesRoutes';
import pedidoRoutes from './pedidoRoutes';
import listaCancionesRoutes from './listaCancionesRoutes';
import historialCierreRoutes from './historialCierreRoutes';

const router = express.Router();

// Rutas principales
router.use('/usuarios', userRoutes); // Incluye autenticación
router.use('/mesas', mesasRoutes);
router.use('/productos', productoRoutes);
router.use('/canciones', cancionesRoutes);
router.use('/pedidos', pedidoRoutes);
router.use('/lista-canciones', listaCancionesRoutes);
router.use('/historial-cierre', historialCierreRoutes);

// Ruta de prueba para la API
router.get('/', (req, res) => {
  res.json({ message: 'API de Karibu Karaoke funcionando correctamente' });
});

export default router;
