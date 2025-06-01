const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homeController');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

router.get('/', homeController.home);
router.get('/informacion',homeController.informacion);
router.get('/cursoactual',homeController.cursoactual);
router.get('/promociones',homeController.promociones);
router.get('/iniciosesion',homeController.iniciosesion);

router.post('/verificariniciosesion',homeController.verificariniciosesion);
router.post('/carruselfotos',homeController.redireccionar);
router.post('/carruselfoto',homeController.eliminarcarrusel);
router.post( '/verificarcarrusel',  upload.single('imagen'), homeController.verificarcarrusel);

router.get('/evento',homeController.evento);
router.get('/noticia',homeController.noticia);
router.get('/curso',homeController.curso);

 router.post('/eventos',homeController.eliminarevento);//eliminar
 router.post('/noticias',homeController.eliminarnoticia);//eliminar
 router.post('/cursos',homeController.eliminarcurso);//eliminar
// router.post('/noticias',homeController.noticias);
// // ✅ Usar multer para poder leer campos enviados con FormData

router.post( '/registrarevento',  upload.single('imagen'), homeController.registrarevento);
router.post( '/registrarnoticia',  upload.single('imagen'), homeController.registrarnoticia);
router.post('/registrarcurso',
  upload.fields([
    { name: 'imagen', maxCount: 1 },   // obligatoria
    { name: 'imagen2', maxCount: 1 },  // opcional
    { name: 'imagen3', maxCount: 1 }   // opcional
  ]),
  homeController.registrarcurso
);
// router.post( '/verificareventos',  upload.single('imagen'), homeController.verificareventos);
module.exports = router;
