import express from 'express';
import { createStaff, getStaffById } from '../controllers/staffController';

const router = express.Router();

// Ruta para obtener un miembro del staff por ID
router.get('/:id', getStaffById);

// Ruta para crear un nuevo miembro del staff (para pruebas)
router.post('/', createStaff);

export default router;
