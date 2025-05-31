const mongoose = require('mongoose');

// Define el esquema (la estructura) para un documento de Docente
const NoticiaSchema = new mongoose.Schema({
    titulo: {
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
    fechaRegistro: {
        type: Date,
        default: Date.now // Establece la fecha actual por defecto al crear el docente
    }
});

// Crea el modelo a partir del esquema. 'Docente' será el nombre de la colección en MongoDB (pluralizado automáticamente a 'docentes').
const Noticia = mongoose.model('Noticia', NoticiaSchema);

// Exporta el modelo para que pueda ser utilizado en otros archivos (como los controladores)
module.exports = Noticia;