import mongoose, { Schema, Document } from 'mongoose';

export interface IMesa extends Document {
  numero: number;
  nombre: string;
  capacidad: number;
  estado: 'disponible' | 'ocupada' | 'reservada';
  createdAt: Date;
  updatedAt: Date;
}

const MesaSchema: Schema = new Schema(
  {
    numero: {
      type: Number,
      required: [true, 'El número de mesa es obligatorio'],
      unique: true
    },
    nombre: {
      type: String,
      required: [true, 'El nombre de la mesa es obligatorio'],
      trim: true
    },
    capacidad: {
      type: Number,
      required: [true, 'La capacidad de la mesa es obligatoria'],
      default: 4
    },
    estado: {
      type: String,
      required: [true, 'El estado de la mesa es obligatorio'],
      enum: ['disponible', 'ocupada', 'reservada'],
      default: 'disponible'
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model<IMesa>('Mesa', MesaSchema); 