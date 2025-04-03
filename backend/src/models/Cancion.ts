import mongoose, { Document, Schema } from 'mongoose';

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

const CancionSchema = new Schema(
  {
    numeroCancion: {
      type: Number,
      required: [true, 'El número de canción es obligatorio'],
      unique: true
    },
    titulo: {
      type: String,
      required: [true, 'El título es obligatorio'],
      trim: true
    },
    artista: {
      type: String,
      required: [true, 'El artista es obligatorio'],
      trim: true
    },
    genero: {
      type: String,
      required: [true, 'El género es obligatorio'],
      trim: true
    },
    idioma: {
      type: String,
      required: [true, 'El idioma es obligatorio'],
      trim: true
    },
    duracion: {
      type: String,
      required: [true, 'La duración es obligatoria'],
      match: [/^([0-5]?[0-9]):([0-5][0-9])$/, 'El formato debe ser MM:SS']
    },
    estado: {
      type: String,
      enum: ['activa', 'inactiva'],
      default: 'activa'
    },
    popularidad: {
      type: Number,
      default: 0,
      min: 0
    },
    fechaAgregada: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

// Índices para mejorar las búsquedas
CancionSchema.index({ numeroCancion: 1 });
CancionSchema.index({ titulo: 'text', artista: 'text' });
CancionSchema.index({ genero: 1 });
CancionSchema.index({ idioma: 1 });
CancionSchema.index({ estado: 1 });
CancionSchema.index({ popularidad: -1 });

export default mongoose.model<ICancion>('Cancion', CancionSchema); 