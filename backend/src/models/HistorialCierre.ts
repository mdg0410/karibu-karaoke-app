import mongoose, { Schema, Document } from 'mongoose';

export interface IHistorialCierre extends Document {
  fechaCierre: Date;
  totalGeneral: number;
  comentarios: string;
  usuarioId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const HistorialCierreSchema: Schema = new Schema(
  {
    fechaCierre: {
      type: Date,
      required: [true, 'La fecha de cierre es obligatoria']
    },
    totalGeneral: {
      type: Number,
      required: [true, 'El total general es obligatorio']
    },
    comentarios: {
      type: String,
      trim: true
    },
    usuarioId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'El usuario que realiza el cierre es obligatorio']
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model<IHistorialCierre>('HistorialCierre', HistorialCierreSchema); 