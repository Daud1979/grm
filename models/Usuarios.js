const mongoose = require('mongoose');

const UsuariosSchema = new mongoose.Schema({
    tipo: {
        type: String,
        enum: ['administrador'],
        required: true
    },
    usuario: {
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
    password: {
        type: String,
        required: true
    },
    fecharegistro: {
        type: Date,
        default: Date.now
    },
    estado: {
        type: Number,
        enum: [0, 1], // 0 = inactivo, 1 = activo
        default: 1
    }
});

// Este modelo se llamará 'Usuarios' y MongoDB usará automáticamente la colección 'usuarios'
const Usuarios = mongoose.model('usuarios', UsuariosSchema);

module.exports = Usuarios;

