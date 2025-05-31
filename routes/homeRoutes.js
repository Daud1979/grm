const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homeController');
router.get('/', homeController.home);
router.get('/informacion',homeController.informacion);
router.get('/cursoactual',homeController.cursoactual);
router.get('/promociones',homeController.promociones);
router.get('/iniciosesion',homeController.iniciosesion);
module.exports = router;