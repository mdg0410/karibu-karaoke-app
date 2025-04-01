import mongoose, { Schema, Document } from 'mongoose';

export interface ICliente extends Document {
  nombre: string;
  email: string;
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
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model<ICliente>('Cliente', ClienteSchema);
