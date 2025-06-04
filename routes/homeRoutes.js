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
const { verificarAdmin, verificarDocente,  verificarApoderado} = require('../middlewares/verificarSesion');



//VER
router.get('/GRMCarrusel',verificarAdmin,homeController.carrusel);
router.get('/GRMEvento',verificarAdmin,homeController.evento);
router.get('/GRMNoticia',verificarAdmin,homeController.noticia);
router.get('/GRMCurso',verificarAdmin,homeController.curso);
router.get('/GRMPromociones',verificarAdmin,homeController.promocion);
router.get('/GRMDocente',verificarAdmin,homeController.docente);
router.get('/GRMEstudiante',verificarAdmin,homeController.estudiante);
//ELIMINAR
router.post('/carrusels',verificarAdmin,homeController.eliminarcarrusel); 
router.post('/noticias',verificarAdmin,homeController.eliminarnoticia);
router.post('/eventos',verificarAdmin,homeController.eliminarevento);
router.post('/cursos',verificarAdmin,homeController.eliminarcurso);
router.post('/promocion',verificarAdmin,homeController.eliminarpromocion);
router.post('/docente',verificarAdmin,homeController.eliminardocente);
//REGISTRAR
router.post('/registrarcarrusel',verificarAdmin,  upload.single('imagen'), homeController.registrarcarrusel);
router.post('/registrarnoticia',verificarAdmin,  upload.single('imagen'), homeController.registrarnoticia);
router.post('/registrarevento',verificarAdmin,  upload.single('imagen'), homeController.registrarevento);
router.post('/registrarcursos',verificarAdmin,  upload.fields([    { name: 'imagen', maxCount: 1 },  { name: 'imagen2', maxCount: 1 }, { name: 'imagen3', maxCount: 1 } ]),  homeController.registrarcursos);
router.post('/registrarpromocion',verificarAdmin,  upload.single('imagen'), homeController.registrarpromocion);
router.post('/registrardocente',verificarAdmin,  upload.single('imagen'), homeController.registrardocente);
//OBTENER CURSO
router.post('/obtenercurso',verificarAdmin,homeController.obtenercurso); 
router.post('/obtenerdocente',verificarAdmin,homeController.obtenerdocente); 
router.post('/modificarcurso',verificarAdmin,  upload.fields([    { name: 'imagen', maxCount: 1 },  { name: 'imagen2', maxCount: 1 }, { name: 'imagen3', maxCount: 1 } ]),  homeController.modificarcurso);
router.post('/modificardocente',verificarAdmin,  upload.single('imagen') ,  homeController.modificardocente);
//GESTION CURSO
router.post('/registrarcurso',verificarAdmin,homeController.registrarcurso);
router.post('/registraralumno',verificarAdmin,homeController.registraralumno);
router.post('/eliminaralumno',verificarAdmin,homeController.eliminaralumno);
router.post('/acciones',verificarDocente, homeController.acciones);//es para docente
router.post('/registrarincidencia',verificarDocente,upload.single('imagen'), homeController.registrarincidencia);
router.post('/eliminarincidencia',verificarDocente,homeController.eliminarincidencia);
router.get('/incidenciasarchivadas',verificarDocente,homeController.archivo);
router.get('/acciones',verificarDocente, homeController.acciones);//es get para el menu
router.get('/datosdocente',verificarDocente,homeController.datosdocente);
router.post('/datosdocente',verificarDocente,upload.single('imagenFile'), homeController.modifcardatosdocente);

router.post('/homeApoderado',verificarApoderado,homeController.homeApoderado);
router.get('/homeApoderado',verificarApoderado,homeController.homeApoderado);
router.post('/cambiarestadoincidencia',verificarApoderado,homeController.cambiarestadoincidencia);
router.get('/datosapoderado',verificarApoderado, homeController.datosapoderado);
router.post('/datosapoderado',verificarApoderado, homeController.modificardatosapoderado);
router.get('/cerrarsesion',verificarApoderado,homeController.cerrarsesion);
module.exports = router;
