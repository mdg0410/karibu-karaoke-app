import { Request, Response } from 'express';
import User from '../models/User';

// Obtener un miembro del staff por ID
export const getStaffById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    const staff = await User.findOne({ _id: id, role: 'staff' });
    if (!staff) {
      res.status(404).json({ success: false, message: 'Miembro del personal no encontrado' });
      return;
    }
    
    res.status(200).json({
      success: true,
      data: {
        id: staff._id,
        nombre: staff.nombre,
        email: staff.email,
        role: staff.role
      }
    });
  } catch (error) {
    console.error('Error obteniendo staff:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al obtener el miembro del personal', 
      error: (error as Error).message 
    });
  }
};

// Crear un nuevo miembro del staff (para pruebas)
export const createStaff = async (req: Request, res: Response): Promise<void> => {
  try {
    const { nombre, email, password, adminToken } = req.body;
    
    // Crear el nuevo miembro del staff
    const staff = new User({
      nombre,
      email,
      password, // En un sistema real, deberíamos encriptar la contraseña
      role: 'staff',
      adminToken
    });
    
    await staff.save();
    
    res.status(201).json({
      success: true,
      data: {
        id: staff._id,
        nombre: staff.nombre,
        email: staff.email,
        role: staff.role
      }
    });
  } catch (error) {
    console.error('Error creando staff:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al crear el miembro del personal', 
      error: (error as Error).message 
    });
  }
};

export default {
  getStaffById,
  createStaff
};
