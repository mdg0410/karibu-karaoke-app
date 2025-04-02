import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  nombre: string;
  email: string;
  password: string;
  role: 'admin' | 'staff' | 'cliente';
  adminToken?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
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
    password: {
      type: String,
      required: [true, 'La contraseña es obligatoria'],
      minlength: [6, 'La contraseña debe tener al menos 6 caracteres']
    },
    role: {
      type: String,
      required: [true, 'El rol es obligatorio'],
      enum: ['admin', 'staff', 'cliente'],
      default: 'cliente'
    },
    adminToken: {
      type: String,
      default: null
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model<IUser>('User', UserSchema); 