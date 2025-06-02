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




//VER
router.get('/GRMCarrusel',homeController.carrusel);
router.get('/GRMEvento',homeController.evento);
router.get('/GRMNoticia',homeController.noticia);
router.get('/GRMCurso',homeController.curso);
router.get('/GRMPromociones',homeController.promocion);
//ELIMINAR
router.post('/carrusels',homeController.eliminarcarrusel); 
router.post('/noticias',homeController.eliminarnoticia);
router.post('/eventos',homeController.eliminarevento);
router.post('/cursos',homeController.eliminarcurso);
router.post('/promocion',homeController.eliminarpromocion);
//REGISTRAR
router.post('/registrarcarrusel',  upload.single('imagen'), homeController.registrarcarrusel);
router.post('/registrarnoticia',  upload.single('imagen'), homeController.registrarnoticia);
router.post('/registrarevento',  upload.single('imagen'), homeController.registrarevento);
router.post('/registrarcurso',  upload.fields([    { name: 'imagen', maxCount: 1 },  { name: 'imagen2', maxCount: 1 }, { name: 'imagen3', maxCount: 1 } ]),  homeController.registrarcurso);
router.post('/registrarpromocion',  upload.single('imagen'), homeController.registrarpromocion);
//OBTENER CURSO
router.post('/obtenercurso',homeController.obtenercurso); 
router.post('/modificarcurso',  upload.fields([    { name: 'imagen', maxCount: 1 },  { name: 'imagen2', maxCount: 1 }, { name: 'imagen3', maxCount: 1 } ]),  homeController.modificarcurso);

module.exports = router;
