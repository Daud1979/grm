// Cargar variables de entorno
import 'dotenv/config';

// Módulos externos
import express from 'express';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import flash from 'connect-flash';
import methodOverride from 'method-override';
import path from 'path';
import { fileURLToPath } from 'url';

// Conexión a base de datos
import dbConnect from './config/db.js';

// Variables de entorno
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Inicializar app
const app = express();
dbConnect();

// Configurar vistas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware para parsear datos
app.use(express.urlencoded({ extended: false }));

// Middleware para métodos como PUT/DELETE
app.use(methodOverride('_method'));

// ✅ Middleware para servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// ⚠️ DEBUG opcional: muestra la ruta pública
console.log("Ruta estática configurada:", path.join(__dirname, 'public'));

// Sesiones y flash
app.use(session({
  secret: process.env.SESSION_SECRET || 'supersecreto', // valor por defecto si no está definido
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI,
    collectionName: 'sessions'
  })
}));
app.use(flash());

// Variables locales disponibles en las vistas
app.use((req, res, next) => {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  res.locals.user = req.session.user || null;
  next();
});

// Rutas
import indexRoutes from './routes/index.js';
import authRoutes from './routes/auth.js';
import teacherRoutes from './routes/teachers.js';
import studentRoutes from './routes/students.js';
import subjectRoutes from './routes/subjects.js';
import userRoutes from './routes/users.js';
import attendanceRoutes from './routes/attendance.js';

app.use('/', indexRoutes);
app.use('/auth', authRoutes);
app.use('/teachers', teacherRoutes);
app.use('/students', studentRoutes);
app.use('/subjects', subjectRoutes);
app.use('/users', userRoutes);
app.use('/attendance', attendanceRoutes);

// Puerto
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});
