import mongoose, { Document, Schema } from 'mongoose';

export interface IPedidoCanciones extends Document {
  clienteId: mongoose.Types.ObjectId;
  mesaId: mongoose.Types.ObjectId;
  canciones: number[];
  fechaCreacion: Date;
  estadoCancion: 'pendiente' | 'reproduciendo' | 'completada';
  estadoEspecial: number; // 0: pagada, 1: pendiente, 2: no pagada
}

const pedidoCancionesSchema = new Schema<IPedidoCanciones>({
  clienteId: {
    type: Schema.Types.ObjectId,
    ref: 'Cliente',
    required: true
  },
  mesaId: {
    type: Schema.Types.ObjectId,
    ref: 'Mesa',
    required: true
  },
  canciones: {
    type: [Number],
    required: true,
    validate: {
      validator: function(arr: number[]) {
        return arr.length > 0 && arr.length <= 3;
      },
      message: 'Debe incluir entre 1 y 3 canciones'
    }
  },
  fechaCreacion: {
    type: Date,
    default: Date.now
  },
  estadoCancion: {
    type: String,
    enum: ['pendiente', 'reproduciendo', 'completada'],
    default: 'pendiente'
  },
  estadoEspecial: {
    type: Number,
    enum: [0, 1, 2],
    default: 1
  }
});

// Índices para optimizar búsquedas
pedidoCancionesSchema.index({ clienteId: 1 });
pedidoCancionesSchema.index({ mesaId: 1 });
pedidoCancionesSchema.index({ fechaCreacion: -1 });
pedidoCancionesSchema.index({ estadoCancion: 1 });
pedidoCancionesSchema.index({ estadoEspecial: 1 });

export default mongoose.model<IPedidoCanciones>('PedidoCanciones', pedidoCancionesSchema); 