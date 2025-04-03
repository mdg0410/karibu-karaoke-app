import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { IUser } from '../models/User';
import { IUserFilters, IUserResponse, IAuthResponse } from '../types/user';

/**
 * Transforma un documento de Usuario a un formato de respuesta API
 */
export const formatUserResponse = (user: IUser): IUserResponse => {
  return {
    id: user._id.toString(),
    nombre: user.nombre,
    email: user.email,
    telefono: user.telefono,
    rol: user.rol,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  };
};

/**
 * Construye un objeto de filtro para consultas de MongoDB basado en los filtros proporcionados
 */
export const buildUserFilterQuery = (filters: IUserFilters): any => {
  const query: any = {};
  
  // Filtros por rol
  if (filters.rol) {
    query.rol = filters.rol;
  }
  
  // Filtros de texto con expresiones regulares
  if (filters.nombre) {
    query.nombre = { $regex: new RegExp(filters.nombre, 'i') };
  }
  
  if (filters.email) {
    query.email = { $regex: new RegExp(filters.email, 'i') };
  }
  
  // Filtros de fecha para createdAt
  if (filters.fechaDesde || filters.fechaHasta) {
    query.createdAt = {};
    
    if (filters.fechaDesde) {
      query.createdAt.$gte = filters.fechaDesde;
    }
    
    if (filters.fechaHasta) {
      query.createdAt.$lte = filters.fechaHasta;
    }
  }
  
  return query;
};

/**
 * Valida un formato de correo electrónico
 */
export const validarFormatoEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Encripta una contraseña usando bcrypt
 */
export const encriptarPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

/**
 * Compara una contraseña con un hash
 */
export const compararPassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};

/**
 * Genera un JWT token para un usuario
 */
export const generarToken = (user: IUser): string => {
  const payload = {
    id: user._id,
    rol: user.rol
  };
  
  return jwt.sign(
    payload,
    process.env.JWT_SECRET || 'tu_clave_secreta',
    { expiresIn: '24h' }
  );
};

/**
 * Genera un objeto de respuesta de autenticación
 */
export const generarAuthResponse = (user: IUser): IAuthResponse => {
  const token = generarToken(user);
  
  return {
    token,
    user: {
      id: user._id.toString(),
      nombre: user.nombre,
      email: user.email,
      rol: user.rol
    }
  };
}; 