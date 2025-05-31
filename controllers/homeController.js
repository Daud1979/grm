const User = require('../models/User'); 
const fs = require('fs').promises; 
const path = require('path'); 
const publicPath = path.join(__dirname, '..', 'public');
const Docente = require('../models/Docente');
const Evento = require('../models/Eventos');
const Noticia = require('../models/Noticias');




exports.home = async (req, res) => {
  const carouselPath = path.join(publicPath, 'images', 'carrusel');
  let carouselImages = [];
  let imageGridItems = [];
 let imageGridItemsNoticia=[];
  try {
    // ✅ Leer imágenes del carrusel
    const files = await fs.readdir(carouselPath);
    carouselImages = files
      .filter(f => ['.jpg', '.jpeg', '.png', '.gif'].includes(path.extname(f).toLowerCase()))
      .map(f => `/images/carrusel/${f}`);

    // ✅ Obtener eventos
    const eventos = await Evento.find().lean();
    imageGridItems = eventos.map(ev => {
      const archivo = ev.nombreImagen?.trim() ? ev.nombreImagen : 'default.jpg';

      return {
        imagePath: `/images/eventos/${archivo}`,
        title: ev.nombre,
        description: ev.descripcion
      };
    });
    // Obtener Noticias
    const noticias = await Noticia.find().lean();
    imageGridItemsNoticia = noticias.map(ev => {
      const archivo = ev.nombreImagen?.trim() ? ev.nombreImagen : 'default.jpg';

      return {
        imagePath: `/images/noticias/${archivo}`,
        title: ev.nombre,
        description: ev.descripcion
      };
    });
//
  } catch (err) {
    console.error('❌ Error preparando datos para home:', err.message);
    carouselImages = [];
    imageGridItems = [];
     imageGridItemsNoticia= [];
  }

  // ✅ Render fuera de try/catch, como pediste
  res.render('home', {
    carouselImages,
    imageGridItems,
    imageGridItemsNoticia
  });
};





exports.informacion = async (req, res) => {
  try {
    const docentes = await Docente.find().lean();

    // Carpeta donde deben vivir las imágenes de los docentes
    const plantelDir = path.join(__dirname, '..', 'public', 'images', 'plantel');

    // Construye las tarjetas comprobando si la imagen existe
    const imageGridItems = await Promise.all(
      docentes.map(async (docente) => {
        let src = '/images/default.jpg';                     // valor por defecto

        if (docente.nombreImagen && docente.nombreImagen.trim() !== '') {
          const absPath = path.join(plantelDir, docente.nombreImagen);
src = `/images/plantel/${docente.nombreImagen}`;
         console.log(src);
        }

        return {
          imagePath:src,
          title: docente.nombre,
          description: docente.descripcion,
        };
      })
    );

    res.render('informacion', { imageGridItems });
  } catch (error) {
    console.error('❌ Error al obtener docentes:', error.message);
    res.render('informacion', { imageGridItems: [] });
  }
};




exports.gestionactual = (req,res)=>{
    res.render('gestionactual');
}