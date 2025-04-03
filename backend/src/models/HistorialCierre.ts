import mongoose, { Schema, Document } from 'mongoose';

export interface IHistorialCierre extends Document {
  cajaInicial: number;
  cajaFinal: number;
  efectivoReal: number;
  efectivoCalculado: number;
  diferencia: number;
  ventasEfectivo: number;
  ventasTarjeta: number;
  totalVentas: number;
  totalIngresado: number;
  usuarioApertura: mongoose.Types.ObjectId;
  usuarioCierre?: mongoose.Types.ObjectId;
  fechaApertura: Date;
  fechaCierre?: Date;
  abierto: boolean;
  observaciones?: string;
}

const historialCierreSchema = new Schema<IHistorialCierre>(
  {
    cajaInicial: {
      type: Number,
      required: [true, 'La caja inicial es requerida'],
      min: [0, 'La caja inicial no puede ser negativa']
    },
    cajaFinal: {
      type: Number,
      default: 0,
      min: [0, 'La caja final no puede ser negativa']
    },
    efectivoReal: {
      type: Number,
      default: 0,
      min: [0, 'El efectivo real no puede ser negativo']
    },
    efectivoCalculado: {
      type: Number,
      default: 0
    },
    diferencia: {
      type: Number,
      default: 0
    },
    ventasEfectivo: {
      type: Number,
      default: 0
    },
    ventasTarjeta: {
      type: Number,
      default: 0
    },
    totalVentas: {
      type: Number,
      default: 0
    },
    totalIngresado: {
      type: Number,
      default: 0
    },
    usuarioApertura: {
      type: Schema.Types.ObjectId,
      ref: 'Usuario',
      required: [true, 'El usuario de apertura es requerido']
    },
    usuarioCierre: {
      type: Schema.Types.ObjectId,
      ref: 'Usuario'
    },
    fechaApertura: {
      type: Date,
      default: Date.now
    },
    fechaCierre: {
      type: Date
    },
    abierto: {
      type: Boolean,
      default: true
    },
    observaciones: {
      type: String
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

// Crear índices para mejorar el rendimiento en consultas
historialCierreSchema.index({ abierto: 1 });
historialCierreSchema.index({ fechaApertura: -1 });
historialCierreSchema.index({ fechaCierre: -1 });
historialCierreSchema.index({ usuarioApertura: 1 });
historialCierreSchema.index({ usuarioCierre: 1 });

// Método para calcular la diferencia
historialCierreSchema.pre('save', function(next) {
  if (this.cajaFinal !== null && this.cajaInicial !== null) {
    this.diferencia = this.cajaFinal - this.cajaInicial - this.totalVentas;
  }
  next();
});

export default mongoose.model<IHistorialCierre>('HistorialCierre', historialCierreSchema); 