const mongoose = require('mongoose');

// Define el esquema (la estructura) para un documento de Docente
const CursoSchema = new mongoose.Schema({
    curso: {
        type: String,
        required: true, // El nombre es obligatorio
        trim: true      // Elimina espacios en blanco al inicio y al final
    },
    fechaRegistro: {
        type: Date,
        default: Date.now // Establece la fecha actual por defecto al crear el docente
    }
});

// Crea el modelo a partir del esquema. 'Docente' será el nombre de la colección en MongoDB (pluralizado automáticamente a 'docentes').
const Curso = mongoose.model('Curso', CursoSchema);

// Exporta el modelo para que pueda ser utilizado en otros archivos (como los controladores)
module.exports =Curso;