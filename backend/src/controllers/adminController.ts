import { Request, Response } from 'express';
import User from '../models/User';

// Obtener un admin por ID
export const getAdminById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    const admin = await User.findOne({ _id: id, role: 'admin' });
    if (!admin) {
      res.status(404).json({ success: false, message: 'Administrador no encontrado' });
      return;
    }
    
    res.status(200).json({
      success: true,
      data: {
        id: admin._id,
        nombre: admin.nombre,
        email: admin.email
      }
    });
  } catch (error) {
    console.error('Error obteniendo admin:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al obtener el administrador', 
      error: (error as Error).message 
    });
  }
};

// Crear un nuevo admin (para pruebas)
export const createAdmin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { nombre, email, password } = req.body;
    
    // Crear el nuevo admin
    const admin = new User({
      nombre,
      email,
      password, // En un sistema real, deberíamos encriptar la contraseña
      role: 'admin'
    });
    
    await admin.save();
    
    res.status(201).json({
      success: true,
      data: {
        id: admin._id,
        nombre: admin.nombre,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (error) {
    console.error('Error creando admin:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al crear el administrador', 
      error: (error as Error).message 
    });
  }
};

export default {
  getAdminById,
  createAdmin
};
