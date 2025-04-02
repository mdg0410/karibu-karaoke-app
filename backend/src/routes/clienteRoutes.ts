import express from 'express';
import { generateClienteToken, createCliente, registrarCliente } from '../controllers/clienteController';

const router = express.Router();

// Ruta para generar token JWT para un cliente específico
router.get('/:id', generateClienteToken);

// Ruta para registrar un nuevo cliente y asignarlo a una mesa
router.post('/registrar', registrarCliente);

// Ruta para crear un nuevo cliente (para pruebas)
router.post('/', createCliente);

export default router;
