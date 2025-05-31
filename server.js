// Cargar variables de entorno
require('dotenv').config();

// Módulos externos
const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const methodOverride = require('method-override');
const path = require('path'); // 'path' es global en CommonJS

// Conexión a base de datos
const dbConnect = require('./config/db');

// Inicializar app
const app = express();

// Conectar a la base de datos (asegúrate de que dbConnect es una función CommonJS)
dbConnect();

// Configurar vistas (si usas EJS u otro motor de plantillas)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware para parsear datos de formularios (body-parser)
app.use(express.urlencoded({ extended: false })); // Para datos x-www-form-urlencoded
app.use(express.json()); // Para datos JSON (si también los manejas)

// Middleware para permitir métodos HTTP como PUT/DELETE (desde formularios)
app.use(methodOverride('_method'));

// ✅ Middleware para servir archivos estáticos (CSS, JS, imágenes, etc.)
// Todo lo que esté en 'public' será accesible directamente desde la raíz del dominio
app.use(express.static(path.join(__dirname, 'public')));

// ⚠️ DEBUG opcional: muestra la ruta pública configurada en la consola del servidor
console.log("Ruta de archivos estáticos configurada a:", path.join(__dirname, 'public'));

// Configuración de sesiones
app.use(session({
    secret: process.env.SESSION_SECRET || 'mi_secreto_muy_seguro_y_largo_por_defecto', // ⚠️ En producción, usa un valor largo y complejo del .env
    resave: false, // Evita guardar la sesión si no ha cambiado
    saveUninitialized: false, // Evita guardar sesiones nuevas que no han sido modificadas
    store: MongoStore.create({ // connect-mongo es un módulo híbrido, create() funciona
        mongoUrl: process.env.MONGODB_URI, // URL de conexión a tu base de datos MongoDB
        collectionName: 'sessions' // Nombre de la colección para almacenar las sesiones
    })
}));

// Middleware para mensajes flash (notificaciones de éxito/error)
app.use(flash());

// Variables locales disponibles en todas las vistas (middlewares de respuesta)
app.use((req, res, next) => {
    res.locals.success = req.flash('success'); // Mensajes de éxito
    res.locals.error = req.flash('error');   // Mensajes de error
    res.locals.user = req.session.user || null; // Usuario logeado (si existe)
    next(); // Pasa al siguiente middleware o ruta
});

// Rutas de la aplicación
// ✅ Como has cambiado a app.use('/', homeRoutes), tus rutas homeRoutes serán la raíz
const homeRoutes = require('./routes/homeRoutes');
app.use('/', homeRoutes);


// Puerto de escucha del servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
    console.log(`✨ Accede a la página de inicio en: http://localhost:${PORT}/`); // Mensaje útil
});