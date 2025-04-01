import express from 'express';
import { createAdmin, getAdminById } from '../controllers/adminController';

const router = express.Router();

// Ruta para obtener un admin por ID
router.get('/:id', getAdminById);

// Ruta para crear un nuevo admin (para pruebas)
router.post('/', createAdmin);

export default router;
