import mongoose, { Schema, Document } from 'mongoose';

interface IHistorialCambio {
  trabajadorId: mongoose.Types.ObjectId;
  fechaCambio: Date;
  estadoAnterior: string;
  estadoNuevo: string;
  comentario?: string;
}

interface IDetallePedido {
  productoId: mongoose.Types.ObjectId;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

export interface IPedido extends Document {
  numeroMesa: number;
  clienteId: mongoose.Types.ObjectId;
  detalles: IDetallePedido[];
  estado: 'pendiente' | 'en preparacion' | 'entregado' | 'cancelado';
  formaPago: 'efectivo' | 'tarjeta' | null;
  total: number;
  historialCambios: IHistorialCambio[];
  createdAt: Date;
  updatedAt: Date;
  observaciones?: string;
}

const HistorialCambioSchema = new Schema({
  trabajadorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  fechaCambio: {
    type: Date,
    default: Date.now
  },
  estadoAnterior: {
    type: String,
    required: true
  },
  estadoNuevo: {
    type: String,
    required: true
  },
  comentario: {
    type: String,
    trim: true
  }
});

const DetallePedidoSchema = new Schema({
  productoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Producto',
    required: true
  },
  cantidad: {
    type: Number,
    required: true,
    min: [1, 'La cantidad debe ser al menos 1']
  },
  precioUnitario: {
    type: Number,
    required: true,
    min: [0, 'El precio no puede ser negativo']
  },
  subtotal: {
    type: Number,
    required: true,
    min: [0, 'El subtotal no puede ser negativo']
  }
});

const PedidoSchema: Schema = new Schema(
  {
    numeroMesa: {
      type: Number,
      required: [true, 'El número de mesa es obligatorio'],
      ref: 'Mesa'
    },
    clienteId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    detalles: [DetallePedidoSchema],
    estado: {
      type: String,
      enum: ['pendiente', 'en preparacion', 'entregado', 'cancelado'],
      default: 'pendiente'
    },
    formaPago: {
      type: String,
      enum: ['efectivo', 'tarjeta', null],
      default: null
    },
    total: {
      type: Number,
      required: true,
      min: [0, 'El total no puede ser negativo']
    },
    historialCambios: [HistorialCambioSchema],
    observaciones: {
      type: String,
      trim: true,
      maxlength: [500, 'Las observaciones no pueden exceder los 500 caracteres']
    }
  },
  {
    timestamps: true
  }
);

// Middleware para calcular el total automáticamente
PedidoSchema.pre('save', function(next) {
  if (this.isModified('detalles')) {
    this.total = this.detalles.reduce((sum: number, item: IDetallePedido) => sum + item.subtotal, 0);
  }
  next();
});

// Índices para mejorar las búsquedas
PedidoSchema.index({ numeroMesa: 1 });
PedidoSchema.index({ clienteId: 1 });
PedidoSchema.index({ estado: 1 });
PedidoSchema.index({ createdAt: 1 });
PedidoSchema.index({ 'historialCambios.trabajadorId': 1 });

export default mongoose.model<IPedido>('Pedido', PedidoSchema);