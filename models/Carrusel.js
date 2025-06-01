const mongoose = require('mongoose');

// Define el esquema para un documento de Carrusel
const carruselSchema = new mongoose.Schema({
    nombreImagen: {
        type: String,
        required: false,
        trim: true
    },
    fechaRegistro: {
        type: Date,
        default: Date.now
    }
});

// Crea el modelo usando el nombre de colección explícito "carrusel"
const Carrusel = mongoose.model('Carrusel', carruselSchema, 'carrusel');

// Exporta el modelo para que pueda ser utilizado en otros archivos
module.exports = Carrusel;
