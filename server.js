// Cargar variables de entorno
require('dotenv').config();

// Módulos externos
const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const methodOverride = require('method-override');
const path = require('path');

// Conexión a base de datos
const dbConnect = require('./config/db');

// Inicializar app
const app = express();

// Conectar a la base de datos
dbConnect();

// Configurar vistas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware para parsear datos de formularios
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Middleware para PUT/DELETE desde formularios
app.use(methodOverride('_method'));

// ✅ Configuración de sesiones (solo UNA VEZ)
app.use(session({
  secret: process.env.SESSION_SECRET || 'mi_clave_secreta_segura',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 60 * 60 * 1000 }, // 1 hora
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI,
    collectionName: 'sessions'
  })
}));

// Archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));
console.log("Ruta de archivos estáticos configurada a:", path.join(__dirname, 'public'));

// Middleware de flash
app.use(flash());

// Variables disponibles en todas las vistas
app.use((req, res, next) => {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  res.locals.user = req.session.user || null;
  next();
});

// Rutas
const homeRoutes = require('./routes/homeRoutes');
app.use('/', homeRoutes);

// (Opcional) Ruta para verificar sesión
app.get('/ver-sesion', (req, res) => {
  res.json({ idDocente: req.session.idDocente });
});

// Puerto de escucha
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});
