import express from 'express';
import { generateClienteToken, createCliente } from '../controllers/clienteController';

const router = express.Router();

// Ruta para generar token JWT para un cliente específico
router.get('/:id', generateClienteToken);

// Ruta para crear un nuevo cliente (para pruebas)
router.post('/', createCliente);

export default router;
