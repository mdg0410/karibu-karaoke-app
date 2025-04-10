import mongoose, { Schema, Document } from 'mongoose';

export interface IEstado extends Document {
  tipo: 'pedido' | 'mesa' | 'cancion';
  nombreEstado: string;
}

const EstadoSchema: Schema = new Schema(
  {
    tipo: {
      type: String,
      required: [true, 'El tipo de estado es obligatorio'],
      enum: ['pedido', 'mesa', 'cancion']
    },
    nombreEstado: {
      type: String,
      required: [true, 'El nombre del estado es obligatorio'],
      trim: true
    }
  },
  {
    timestamps: true
  }
);

// Índice compuesto para asegurar que no haya duplicados de tipo y nombreEstado
EstadoSchema.index({ tipo: 1, nombreEstado: 1 }, { unique: true });

export default mongoose.model<IEstado>('Estado', EstadoSchema); 