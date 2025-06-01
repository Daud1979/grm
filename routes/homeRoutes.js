const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homeController');
router.get('/', homeController.home);
router.get('/informacion',homeController.informacion);
router.get('/cursoactual',homeController.cursoactual);
router.get('/promociones',homeController.promociones);
router.get('/iniciosesion',homeController.iniciosesion);
router.post('/verificariniciosesion',homeController.verificariniciosesion);
router.post('/carruselfotos',homeController.redireccionar);
router.post('/admin/carrusel/eliminar',homeController.eliminarcarrusel)
module.exports = router;