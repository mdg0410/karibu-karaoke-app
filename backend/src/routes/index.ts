import express from 'express';
import clienteRoutes from './clienteRoutes';
import adminRoutes from './adminRoutes';
import staffRoutes from './staffRoutes';
import authRoutes from './authRoutes';
import mesasRoutes from './mesasRoutes';
import productoRoutes from './productoRoutes';

const router = express.Router();

// Rutas principales
router.use('/clientes', clienteRoutes);
router.use('/admin', adminRoutes);
router.use('/staff', staffRoutes);
router.use('/auth', authRoutes);
router.use('/mesas', mesasRoutes);
router.use('/productos', productoRoutes);

// Ruta de prueba para la API
router.get('/', (req, res) => {
  res.json({ message: 'API de Karibu Karaoke funcionando correctamente' });
});

export default router;
