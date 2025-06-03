const mongoose = require('mongoose');
const { Schema } = mongoose;

const ApoderadoSchema = new Schema({
  ci:         { 
    type: String,
    required: true,
    unique: true },
  nombre:     { 
    type: String,
    required: true },
  apellidos:  { 
    type: String, 
    required: true },
  hijos:      [{ type: Schema.Types.ObjectId, ref: 'Alumno' }]   // ← relación N-a-N
}, { timestamps: true });

const Apoderado = mongoose.model('Apoderado', ApoderadoSchema);
module.exports =Apoderado;

