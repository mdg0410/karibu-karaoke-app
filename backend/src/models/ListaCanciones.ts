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

export interface IListaCanciones extends Document {
  canciones: number[];
  numeroMesa: number;
  clienteId: mongoose.Types.ObjectId;
  estadoReproduccion: 'pendiente' | 'en reproduccion' | 'finalizado';
  estadoPago: 'pendiente' | 'pagado' | 'gratis';
  createdAt: Date;
}

const listaCancionesSchema = new Schema(
  {
    canciones: {
      type: [Number],
      required: [true, 'Las canciones son obligatorias'],
      validate: {
        validator: function(v: number[]) {
          return v.length > 0 && v.length <= 3;
        },
        message: 'El combo debe tener entre 1 y 3 canciones'
      }
    },
    numeroMesa: {
      type: Number,
      required: [true, 'El número de mesa es obligatorio'],
      ref: 'Mesa'
    },
    clienteId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'El cliente es obligatorio']
    },
    estadoReproduccion: {
      type: String,
      enum: ['pendiente', 'en reproduccion', 'finalizado'],
      default: 'pendiente'
    },
    estadoPago: {
      type: String,
      enum: ['pendiente', 'pagado', 'gratis'],
      default: 'pendiente'
    }
  },
  {
    timestamps: true
  }
);

// Índices para mejorar las búsquedas
listaCancionesSchema.index({ numeroMesa: 1 });
listaCancionesSchema.index({ clienteId: 1 });
listaCancionesSchema.index({ estadoReproduccion: 1 });
listaCancionesSchema.index({ estadoPago: 1 });

export default mongoose.model<IListaCanciones>('ListaCanciones', listaCancionesSchema); 