import mongoose, { Schema, Document } from 'mongoose';

export interface IProducto extends Document {
  nombre: string;
  categoria: string;
  precio: number;
  imagenURL: string;
  cantidad: number;
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
    cantidad: {
      type: Number,
      default: 0,
      min: [0, 'La cantidad no puede ser negativa']
    },
    estado: {
      type: String,
      enum: ['disponible', 'agotado', 'oculto'],
      default: 'disponible'
    }
  },
  {
    timestamps: true,
    collection: 'products'
  }
);

export default mongoose.model<IProducto>('Product', ProductoSchema); 