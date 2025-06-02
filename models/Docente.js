const mongoose = require('mongoose');

// Define el esquema (la estructura) para un documento de Docente
const docenteSchema = new mongoose.Schema({
    ci: {
        type: String,
        required: true, // El nombre es obligatorio
        trim: true      // Elimina espacios en blanco al inicio y al final
    },
    nombre: {
        type: String,
        required: true, // El nombre es obligatorio
        trim: true      // Elimina espacios en blanco al inicio y al final
    },
    descripcion: {
        type: String,
        required: true, // La descripción es obligatoria
        trim: true
    },
    // Solo guardaremos el nombre del archivo de la imagen.
    // La imagen en sí se almacena en el sistema de archivos (public/images/docentes).
    nombreImagen: {
        type: String,
        required: false, // La imagen es opcional (un docente podría no tener una)
        trim: true
    },
    usuario:{
         type: String,
        required: false, // La imagen es opcional (un docente podría no tener una)
        trim: true
    },
    passwrd:{
          type: String,
        required: false, // La imagen es opcional (un docente podría no tener una)
        trim: true
    },
    tipo:{
        type: String,
        required: false, // La imagen es opcional (un docente podría no tener una)
        trim: true,
        default:'docente'        
    },
    fechaRegistro: {
        type: Date,
        default: Date.now // Establece la fecha actual por defecto al crear el docente
    },
    estado: {
        type: Number,
        enum: [0, 1], // 0 = inactivo, 1 = activo
        default: 1
    }
});

// Crea el modelo a partir del esquema. 'Docente' será el nombre de la colección en MongoDB (pluralizado automáticamente a 'docentes').
const Docente = mongoose.model('Docente', docenteSchema);

// Exporta el modelo para que pueda ser utilizado en otros archivos (como los controladores)
module.exports = Docente;