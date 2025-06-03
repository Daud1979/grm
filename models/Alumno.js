const mongoose = require('mongoose');

// Define el esquema para un documento de Alumno
const AlumnoSchema = new mongoose.Schema({
    ci_alumno: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    nombre: {
        type: String,
        required: true,
        trim: true
    }, 
    curso: {
        type: String,
        required: true,
        trim: true // Asegura que no haya espacios adicionales
    },
    // Referencia a uno o más apoderados (relación N:N)
    apoderados: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Apoderado'
    }]
}, {
    timestamps: true // Agrega automáticamente createdAt y updatedAt
});

// Crea el modelo a partir del esquema
const Alumno = mongoose.model('Alumno', AlumnoSchema);

// Exporta el modelo para que pueda ser utilizado en otros archivos (como los controladores)
module.exports = Alumno;
