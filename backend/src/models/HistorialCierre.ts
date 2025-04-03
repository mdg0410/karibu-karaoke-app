import mongoose, { Schema, Document } from 'mongoose';

export interface IHistorialCierre extends Document {
  fechaCierre: Date;
  totalGeneral: number;
  comentarios: string;
  usuarioId: mongoose.Types.ObjectId;
  nombreUsuario: string;
  rolUsuario: string;
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
      required: [true, 'El total general es obligatorio'],
      min: [0, 'El total no puede ser negativo']
    },
    comentarios: {
      type: String,
      trim: true
    },
    usuarioId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'El usuario que realiza el cierre es obligatorio']
    },
    nombreUsuario: {
      type: String,
      required: [true, 'El nombre del usuario es obligatorio']
    },
    rolUsuario: {
      type: String,
      required: [true, 'El rol del usuario es obligatorio'],
      enum: ['trabajador', 'admin']
    }
  },
  {
    timestamps: true
  }
);

// Índices para mejorar las búsquedas
HistorialCierreSchema.index({ fechaCierre: -1 });
HistorialCierreSchema.index({ usuarioId: 1 });

export default mongoose.model<IHistorialCierre>('HistorialCierre', HistorialCierreSchema); 