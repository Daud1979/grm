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

// ✅ Usar multer para poder leer campos enviados con FormData
router.post(
  '/verificarcarrusel',
  upload.single('imagen'), // ⬅️ esto le dice a multer que esperas el campo 'imagen'
  homeController.verificarcarrusel
);

module.exports = router;
