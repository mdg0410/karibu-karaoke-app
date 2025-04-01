import { Request, Response } from 'express';
import Cliente from '../models/Cliente';
import { generateToken } from '../utils/jwt';

// Generar JWT para un cliente específico por ID
export const generateClienteToken = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    // Verificar si el cliente existe
    const cliente = await Cliente.findById(id);
    if (!cliente) {
      res.status(404).json({ success: false, message: 'Cliente no encontrado' });
      return;
    }
    
    // Generar el token JWT
    const token = generateToken({ 
      id: cliente._id.toString(),
      nombre: cliente.nombre,
      email: cliente.email
    });
    
    res.status(200).json({
      success: true,
      token,
      cliente: {
        id: cliente._id,
        nombre: cliente.nombre,
        email: cliente.email
      }
    });
  } catch (error) {
    console.error('Error generando token:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al generar el token', 
      error: (error as Error).message 
    });
  }
};

// Crear un nuevo cliente (para pruebas)
export const createCliente = async (req: Request, res: Response): Promise<void> => {
  try {
    const { nombre, email } = req.body;
    
    // Crear el nuevo cliente
    const cliente = new Cliente({
      nombre,
      email
    });
    
    await cliente.save();
    
    res.status(201).json({
      success: true,
      data: cliente
    });
  } catch (error) {
    console.error('Error creando cliente:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al crear el cliente', 
      error: (error as Error).message 
    });
  }
};

export default {
  generateClienteToken,
  createCliente
};
