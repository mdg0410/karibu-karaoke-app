import mongoose, { Document, Schema } from 'mongoose';
import { EstadoReproduccion, EstadoPago } from '../types/listaCancion';

export interface IListaCanciones extends Document {
  canciones: number[];
  numeroMesa: number;
  clienteId: mongoose.Types.ObjectId;
  estadoReproduccion: EstadoReproduccion;
  estadoPago: EstadoPago;
  createdAt: Date;
  updatedAt: Date;
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
        message: 'La lista debe tener entre 1 y 3 canciones'
      }
    },
    numeroMesa: {
      type: Number,
      required: [true, 'El número de mesa es obligatorio'],
      ref: 'Mesa'
    },
    clienteId: {
      type: Schema.Types.ObjectId,
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
listaCancionesSchema.index({ createdAt: -1 });

export default mongoose.model<IListaCanciones>('ListaCanciones', listaCancionesSchema); 