import mongoose from 'mongoose';

const songRequestSchema = new mongoose.Schema({
  clienteId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cliente',
    required: true
  },
  mesaId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Mesa',
    required: true
  },
  canciones: [{
    type: Number,  // Número de la canción
    required: true
  }],
  fechaCreacion: {
    type: Date,
    default: Date.now
  },
  estadoReproduccion: {
    type: String,
    enum: ['pendiente', 'reproduciendo', 'completada', 'cancelada'],
    default: 'pendiente'
  },
  estadoPago: {
    type: Number,
    enum: [0, 1, 2],  // 0: pagada, 1: pendiente, 2: no pagada
    default: 1
  }
});

const SongRequest = mongoose.model('SongRequest', songRequestSchema);

export default SongRequest; 