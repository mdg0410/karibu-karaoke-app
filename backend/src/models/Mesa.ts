import mongoose, { Schema, Document } from 'mongoose';

interface IHistorialMesa {
  usuarioId: mongoose.Types.ObjectId;
  fechaInicio: Date;
  fechaFin: Date;
  estado: string;
}

export interface IMesa extends Document {
  numero: number;
  capacidad: number;
  estado: 'disponible' | 'ocupada' | 'reservada';
  historial: IHistorialMesa[];
  createdAt: Date;
  updatedAt: Date;
}

const HistorialMesaSchema = new Schema({
  usuarioId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  fechaInicio: {
    type: Date,
    required: true
  },
  fechaFin: {
    type: Date
  },
  estado: {
    type: String,
    required: true
  }
});

const MesaSchema: Schema = new Schema(
  {
    numero: {
      type: Number,
      required: [true, 'El número de mesa es obligatorio'],
      unique: true
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
    },
    historial: [HistorialMesaSchema]
  },
  {
    timestamps: true
  }
);

export default mongoose.model<IMesa>('Mesa', MesaSchema); 