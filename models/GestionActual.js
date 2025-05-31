const mongoose = require('mongoose');

const GestionActualSchema = new mongoose.Schema({
  Curso: {
    type: String,
    required: true,
    trim: true
  },
  descripcion: {
    type: String,
    required: true,
    trim: true
  },
  nombreImagenUno: {
    type: String,
    trim: true
  },
  nombreImagenDos: {
    type: String,
    trim: true
  },
  nombreImagenTres: {
    type: String,
    trim: true
  },
  fechaRegistro: {
    type: Date,
    default: Date.now
  }
});

// 👇 Usar nombre exacto de la colección en Atlas
const GestionActual = mongoose.model('GestionActual', GestionActualSchema, 'gestionactual');

module.exports = GestionActual;
