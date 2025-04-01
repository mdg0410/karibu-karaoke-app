import express from 'express';
import clienteRoutes from './clienteRoutes';

const router = express.Router();

// Rutas principales
router.use('/cliente', clienteRoutes);

// Ruta de prueba para la API
router.get('/', (req, res) => {
  res.json({ message: 'API de Karibu Karaoke funcionando correctamente' });
});

export default router;
