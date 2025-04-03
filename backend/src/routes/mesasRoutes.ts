import express from 'express';
import { Request, Response } from 'express';
import Mesa from '../models/Mesa';

const router = express.Router();

// Ruta para verificar si una mesa está disponible por número de mesa (GET)
router.get('/verificar/:numeromesa', async (req: Request, res: Response) => {
  try {
    const numeromesa = parseInt(req.params.numeromesa);
    
    if (isNaN(numeromesa)) {
      return res.status(400).json({
        success: false,
        message: 'El número de mesa debe ser un número válido'
      });
    }
    
    // Buscar la mesa en la base de datos
    const mesa = await Mesa.findOne({ numero: numeromesa });
    
    if (!mesa) {
      return res.status(404).json({
        success: false,
        disponible: false,
        message: 'Mesa no encontrada'
      });
    }
    
    // Verificar si la mesa está disponible
    const disponible = mesa.estado === 'disponible';
    
    return res.json({
      success: true,
      disponible,
      message: disponible ? 'Mesa disponible' : 'Mesa no disponible',
      mesa: {
        _id: mesa._id, // ObjectId de la mesa
        numero: mesa.numero,
        nombre: mesa.nombre,
        capacidad: mesa.capacidad,
        estado: mesa.estado
      }
    });
  } catch (error) {
    console.error('Error al verificar mesa:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al procesar la solicitud'
    });
  }
});

// Mantener la ruta POST para compatibilidad con el frontend existente
router.post('/verificar', async (req: Request, res: Response) => {
  try {
    const mesaId = parseInt(req.body.mesaId);
    
    if (isNaN(mesaId)) {
      return res.status(400).json({
        success: false,
        message: 'El número de mesa debe ser un número válido'
      });
    }
    
    // Buscar la mesa en la base de datos
    const mesa = await Mesa.findOne({ numero: mesaId });
    
    if (!mesa) {
      return res.status(404).json({
        success: false,
        disponible: false,
        message: 'Mesa no encontrada'
      });
    }
    
    // Verificar si la mesa está disponible
    const disponible = mesa.estado === 'disponible';
    
    return res.json({
      success: true,
      disponible,
      message: disponible ? 'Mesa disponible' : 'Mesa no disponible',
      mesa: {
        _id: mesa._id, // ObjectId de la mesa
        numero: mesa.numero,
        nombre: mesa.nombre,
        capacidad: mesa.capacidad,
        estado: mesa.estado
      }
    });
  } catch (error) {
    console.error('Error al verificar mesa:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al procesar la solicitud'
    });
  }
});

export default router; 