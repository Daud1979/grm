
const AlumnoSchema = new mongoose.Schema({
 ci_alumno:  { 
    type: String,
    required: true,
    unique: true },
  nombre:     { 
    type: String,
    required: true },
  curso:      { 
    type: String,
    required: true },           
  apoderados: [{ type: Schema.Types.ObjectId, ref: 'Apoderado' }]
}, { timestamps: true });

// Crea el modelo a partir del esquema. 'Docente' será el nombre de la colección en MongoDB (pluralizado automáticamente a 'docentes').
const Alumno = mongoose.model('Alumno', CursoSchema);

// Exporta el modelo para que pueda ser utilizado en otros archivos (como los controladores)
module.exports =Alumno;