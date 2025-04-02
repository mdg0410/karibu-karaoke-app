import { Request, Response } from 'express';
import Cliente from '../models/Cliente';
import User from '../models/User';
import { generateToken } from '../utils/jwt';

// Login para cliente
export const loginCliente = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;
    
    // En un sistema real, verificaríamos también la contraseña
    const cliente = await Cliente.findOne({ email });
    if (!cliente) {
      res.status(404).json({ success: false, message: 'Cliente no encontrado' });
      return;
    }
    
    // Generar token
    const token = generateToken({ 
      id: cliente._id.toString(),
      nombre: cliente.nombre,
      email: cliente.email,
      role: 'cliente'
    });
    
    res.status(200).json({
      success: true,
      token,
      user: {
        id: cliente._id,
        nombre: cliente.nombre,
        email: cliente.email,
        role: 'cliente'
      }
    });
  } catch (error) {
    console.error('Error en login de cliente:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error en autenticación', 
      error: (error as Error).message 
    });
  }
};

// Login para admin
export const loginAdmin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;
    
    // En un sistema real, verificaríamos también la contraseña
    const admin = await User.findOne({ email, role: 'admin' });
    if (!admin) {
      res.status(404).json({ success: false, message: 'Administrador no encontrado' });
      return;
    }
    
    // Generar token
    const token = generateToken({ 
      id: admin._id.toString(),
      nombre: admin.nombre,
      email: admin.email,
      role: 'admin'
    });
    
    res.status(200).json({
      success: true,
      token,
      user: {
        id: admin._id,
        nombre: admin.nombre,
        email: admin.email,
        role: 'admin'
      }
    });
  } catch (error) {
    console.error('Error en login de admin:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error en autenticación', 
      error: (error as Error).message 
    });
  }
};

// Login para staff
export const loginStaff = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;
    
    // En un sistema real, verificaríamos también la contraseña
    const staff = await User.findOne({ email, role: 'staff' });
    if (!staff) {
      res.status(404).json({ success: false, message: 'Miembro del personal no encontrado' });
      return;
    }
    
    // Generar token
    const token = generateToken({ 
      id: staff._id.toString(),
      nombre: staff.nombre,
      email: staff.email,
      role: 'staff'
    });
    
    res.status(200).json({
      success: true,
      token,
      user: {
        id: staff._id,
        nombre: staff.nombre,
        email: staff.email,
        role: 'staff'
      }
    });
  } catch (error) {
    console.error('Error en login de staff:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error en autenticación', 
      error: (error as Error).message 
    });
  }
};

export default {
  loginCliente,
  loginAdmin,
  loginStaff
};
