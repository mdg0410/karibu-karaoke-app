import { Document } from 'mongoose';

// Interfaz para respuesta de API de una canción
export interface ICancionResponse {
  id: string;
  numeroCancion: number;
  titulo: string;
  artista: string;
  genero: string;
  idioma: string;
  duracion: string;
  estado: 'activa' | 'inactiva';
  popularidad: number;
  fechaAgregada: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

// Interfaz para crear una nueva canción
export interface ICancionCreate {
  numeroCancion: number;
  titulo: string;
  artista: string;
  genero: string;
  idioma: string;
  duracion: string;
  estado?: 'activa' | 'inactiva';
  popularidad?: number;
}

// Interfaz para actualizar una canción existente
export interface ICancionUpdate {
  titulo?: string;
  artista?: string;
  genero?: string;
  idioma?: string;
  duracion?: string;
  estado?: 'activa' | 'inactiva';
  popularidad?: number;
}

// Interfaz para filtros de búsqueda de canciones
export interface ICancionFilters {
  numeroCancion?: number;
  titulo?: string;
  artista?: string;
  genero?: string;
  idioma?: string;
  estado?: 'activa' | 'inactiva';
  popularidadMin?: number;
  popularidadMax?: number;
  busqueda?: string; // Búsqueda de texto general
}

// Interfaz para paginación y ordenamiento
export interface ICancionPaginationOptions {
  page: number;
  limit: number;
  sortBy?: string;
  order?: 'asc' | 'desc';
}

// Interfaz para resultado paginado
export interface IPaginatedCancionResult {
  canciones: ICancionResponse[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
} 