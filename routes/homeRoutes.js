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
router.get('/GRMDocente',homeController.docente);
router.get('/GRMEstudiante',homeController.estudiante);
//ELIMINAR
router.post('/carrusels',homeController.eliminarcarrusel); 
router.post('/noticias',homeController.eliminarnoticia);
router.post('/eventos',homeController.eliminarevento);
router.post('/cursos',homeController.eliminarcurso);
router.post('/promocion',homeController.eliminarpromocion);
router.post('/docente',homeController.eliminardocente);
//REGISTRAR
router.post('/registrarcarrusel',  upload.single('imagen'), homeController.registrarcarrusel);
router.post('/registrarnoticia',  upload.single('imagen'), homeController.registrarnoticia);
router.post('/registrarevento',  upload.single('imagen'), homeController.registrarevento);
router.post('/registrarcurso',  upload.fields([    { name: 'imagen', maxCount: 1 },  { name: 'imagen2', maxCount: 1 }, { name: 'imagen3', maxCount: 1 } ]),  homeController.registrarcurso);
router.post('/registrarpromocion',  upload.single('imagen'), homeController.registrarpromocion);
router.post('/registrardocente',  upload.single('imagen'), homeController.registrardocente);
//OBTENER CURSO
router.post('/obtenercurso',homeController.obtenercurso); 
router.post('/obtenerdocente',homeController.obtenerdocente); 
router.post('/modificarcurso',  upload.fields([    { name: 'imagen', maxCount: 1 },  { name: 'imagen2', maxCount: 1 }, { name: 'imagen3', maxCount: 1 } ]),  homeController.modificarcurso);
router.post('/modificardocente',  upload.single('imagen') ,  homeController.modificardocente);
//GESTION CURSO
router.post('/registrarcurso',homeController.registrarcurso);
router.post('/registraralumno',homeController.registraralumno);
module.exports = router;
