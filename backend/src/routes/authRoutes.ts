import express from 'express';
import { loginCliente, loginAdmin, loginStaff } from '../controllers/authController';

const router = express.Router();

// Rutas de autenticación
router.post('/login/cliente', loginCliente);
router.post('/login/admin', loginAdmin);
router.post('/login/staff', loginStaff);

export default router;
