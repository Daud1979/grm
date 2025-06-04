const mongoose = require('mongoose');

const InicidenciaSchema = new mongoose.Schema({
    titulo: {
        type: String,
        required: true,
        trim: true    
    },
    acciones: {
        type: String,        
        trim: true
    },
    motivo: {
        type: String,
        trim: true
    },
    fecha: {
        type: Date,
        default: Date.now 
    },
    estado: {
        type: String,
        default: '0'
    },
    nombreImagen:{
        type:String,
        trim: true
    },
    fechaestado: {
        type: Date
    },

    // 🔗 Relación con el alumno
    alumno: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Alumno',
        required: true
    },

    // 🔗 Relación con el docente
    docente: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Docente',
        required: true
    }
}, {
    timestamps: true
});

const Incidencia = mongoose.model('Incidencia', InicidenciaSchema);
module.exports = Incidencia;
