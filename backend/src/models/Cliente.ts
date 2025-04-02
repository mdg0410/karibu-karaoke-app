import mongoose, { Schema, Document } from 'mongoose';

export interface ICliente extends Document {
  nombre: string;
  email: string;
  telefono?: string;
  mesaId?: string;
  estado?: string;
  pedidos?: Array<any>;
  canciones?: Array<any>;
  token?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ClienteSchema: Schema = new Schema(
  {
    nombre: {
      type: String,
      required: [true, 'El nombre es obligatorio'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'El email es obligatorio'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Por favor ingrese un email válido']
    },
    telefono: {
      type: String,
      trim: true
    },
    mesaId: {
      type: String,
      ref: 'Mesa'
    },
    estado: {
      type: String,
      enum: ['activo', 'inactivo', 'pendiente'],
      default: 'activo'
    },
    pedidos: [{
      type: Schema.Types.ObjectId,
      ref: 'Pedido'
    }],
    canciones: [{
      type: Schema.Types.ObjectId,
      ref: 'Cancion'
    }],
    token: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model<ICliente>('Cliente', ClienteSchema);
