import mongoose, { Schema, Document } from 'mongoose';

export interface IProducto extends Document {
  nombre: string;
  categoria: string;
  precio: number;
  imagenURL: string;
  stock: number;
  estado: 'disponible' | 'agotado' | 'oculto';
  createdAt: Date;
  updatedAt: Date;
}

const ProductoSchema: Schema = new Schema(
  {
    nombre: {
      type: String,
      required: [true, 'El nombre del producto es obligatorio'],
      trim: true
    },
    categoria: {
      type: String,
      required: [true, 'La categoría del producto es obligatoria'],
      trim: true
    },
    precio: {
      type: Number,
      required: [true, 'El precio del producto es obligatorio'],
      min: [0, 'El precio no puede ser negativo']
    },
    imagenURL: {
      type: String,
      default: 'default-producto.jpg'
    },
    stock: {
      type: Number,
      required: [true, 'El stock es obligatorio'],
      min: [0, 'El stock no puede ser negativo'],
      default: 0
    },
    estado: {
      type: String,
      enum: ['disponible', 'agotado', 'oculto'],
      default: 'disponible'
    }
  },
  {
    timestamps: true
  }
);

// Índices para mejorar las búsquedas
ProductoSchema.index({ categoria: 1 });
ProductoSchema.index({ estado: 1 });
ProductoSchema.index({ stock: 1 });

export default mongoose.model<IProducto>('Producto', ProductoSchema); 