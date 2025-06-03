// models/Falta.js
const FaltaSchema = new Schema({
  alumno:     { type: Schema.Types.ObjectId, ref: 'Alumno',   required: true },
  profesor:   { type: Schema.Types.ObjectId, ref: 'Profesor', required: true },
  comentario: { type: String, required: true },
  fecha:      { type: Date,   default: Date.now }             // puedes guardar solo la fecha
}, { timestamps: true });

module.exports = mongoose.model('Falta', FaltaSchema);
