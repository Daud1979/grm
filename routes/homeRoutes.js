const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homeController');
router.get('/', homeController.home);
router.get('/informacion',homeController.informacion);
router.get('/gestionactual',homeController.gestionactual);

module.exports = router;