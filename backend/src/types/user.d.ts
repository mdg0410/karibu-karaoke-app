import { Document } from 'mongoose';

// Interfaz para respuesta de API de un usuario
export interface IUserResponse {
  id: string;
  nombre: string;
  email: string;
  telefono: string;
  rol: 'cliente' | 'trabajador' | 'admin';
  createdAt: Date;
  updatedAt: Date;
}

// Interfaz para crear un nuevo usuario
export interface IUserCreate {
  nombre: string;
  email: string;
  password: string;
  telefono: string;
  rol?: 'cliente' | 'trabajador' | 'admin';
}

// Interfaz para actualizar un usuario existente
export interface IUserUpdate {
  nombre?: string;
  email?: string;
  telefono?: string;
  password?: string;
  rol?: 'cliente' | 'trabajador' | 'admin';
}

// Interfaz para request de login
export interface IUserLogin {
  email: string;
  password: string;
}

// Interfaz para respuesta de autenticación
export interface IAuthResponse {
  token: string;
  user: {
    id: string;
    nombre: string;
    email: string;
    rol: string;
  };
}

// Interfaz para filtros de búsqueda de usuarios
export interface IUserFilters {
  nombre?: string;
  email?: string;
  rol?: 'cliente' | 'trabajador' | 'admin';
  fechaDesde?: Date;
  fechaHasta?: Date;
}

// Interfaz para paginación y ordenamiento
export interface IUserPaginationOptions {
  page: number;
  limit: number;
  sortBy?: string;
  order?: 'asc' | 'desc';
}

// Interfaz para resultado paginado
export interface IPaginatedUserResult {
  usuarios: IUserResponse[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
} 