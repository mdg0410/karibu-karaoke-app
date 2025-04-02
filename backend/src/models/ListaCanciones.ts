import mongoose, { Document, Schema } from 'mongoose';

// Interfaz para el documento de canción
export interface ICancion extends Document {
  numeroCancion: number;
  titulo: string;
  artista: string;
  genero: string;
  idioma: string;
  duracion: string;
  estado: 'activa' | 'inactiva';
  popularidad: number;
  fechaAgregada: Date;
}

const listaCancionesSchema = new Schema<ICancion>({
  numeroCancion: {
    type: Number,
    required: true,
    unique: true
  },
  titulo: {
    type: String,
    required: true
  },
  artista: {
    type: String,
    required: true
  },
  genero: {
    type: String,
    required: true
  },
  idioma: {
    type: String,
    required: true
  },
  duracion: {
    type: String, // Formato "MM:SS"
    required: true
  },
  estado: {
    type: String,
    enum: ['activa', 'inactiva'],
    default: 'activa'
  },
  popularidad: {
    type: Number,
    default: 0
  },
  fechaAgregada: {
    type: Date,
    default: Date.now
  }
});

// Índices para mejorar las búsquedas
listaCancionesSchema.index({ numeroCancion: 1 });
listaCancionesSchema.index({ titulo: 1 });
listaCancionesSchema.index({ artista: 1 });
listaCancionesSchema.index({ genero: 1 });

export default mongoose.model<ICancion>('ListaCanciones', listaCancionesSchema); 