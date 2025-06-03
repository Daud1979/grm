const mongoose = require('mongoose');

// Define el esquema para un documento de Apoderado
const ApoderadoSchema = new mongoose.Schema({
    ci: {
        type: String,
        required: true,
        unique: true,  // Un CI debe ser único por apoderado
        trim: true
    },
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    apellidos: {
        type: String,
        required: true,
        trim: true
    },
    // Referencia a los alumnos que tiene a su cargo (relación N:N)
    hijos: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Alumno'
    }]
}, {
    timestamps: true // Agrega automáticamente createdAt y updatedAt
});

// Crea el modelo a partir del esquema
const Apoderado = mongoose.model('Apoderado', ApoderadoSchema);

// Exporta el modelo para su uso en otras partes del proyecto
module.exports = Apoderado;
