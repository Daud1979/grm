const User = require('../models/User'); 
const fs = require('fs'); 
const path = require('path'); 
const publicPath = path.join(__dirname, '..', 'public');

exports.home = (req, res) => {
    const carouselPath = path.join(publicPath, 'images', 'carrusel');     
    fs.readdir(carouselPath, (err, files) => {
        if (err) {
            console.error('🔴 Error al leer el directorio del carrusel:', err);        
            return res.render('home', {              
                carouselImages: [], // Envía un array vacío si hay un error
                error: 'No se pudieron cargar las imágenes del carrusel.'
            });
        }     
        const imageFiles = files.filter(file => {
            return ['.jpg', '.jpeg', '.png', '.gif'].includes(path.extname(file).toLowerCase());
        });      
        const carouselImages = imageFiles.map(file => `/images/carrusel/${file}`);        
        res.render('home', {
            title: 'Página de Inicio',
            carouselImages: carouselImages
        });
    });
};

// exports.informacion = (req, res) => {
//     const publicPath = path.join(__dirname, '..', 'public');
// const carouselPath = path.join(publicPath, 'images', 'plantel');
//     fs.readdir(carouselPath, (err, files) => {
//         if (err) {
//             console.error('🔴 Error al leer el directorio de imágenes:', err);
//             return res.render('home', {
//                 title: 'Página de Inicio',
//                 carouselImages: [], // Puedes enviar un array vacío si hay un error
//                 imageGridItems: [], // También envía un array vacío para la nueva grid
//                 error: 'No se pudieron cargar las imágenes.'
//             });
//         }

//         // Filtra solo los archivos de imagen
//         const imageFiles = files.filter(file => {
//             return ['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(path.extname(file).toLowerCase());
//         });

//         // --- ¡Esta es la parte clave para la nueva cuadrícula! ---
//         // Construye un array de objetos con la info para cada item de la grid
//         const imageGridItems = imageFiles.map((file, index) => {
//             const baseName = path.basename(file, path.extname(file)); // Nombre del archivo sin extensión
//             return {
//                 src: `/images/plantel/${file}`, // Ruta que el navegador usará
//                 title: `Imagen ${index + 1}: ${baseName.replace(/-/g, ' ')}`.toUpperCase(), // Título dinámico
//                 description: `Esta es la descripción para la imagen ${index + 1}. Aquí puedes añadir detalles sobre su contenido o relevancia.`
//             };
//         });
//         // --------------------------------------------------------

//         // Si tienes la otra galería (carouselImages) también, asegúrate de pasarla:
//         const carouselImages = imageFiles.map(file => `/images/plantel/${file}`);


//         res.render('informacion', {
           
//             carouselImages: carouselImages, // Para tu carrusel existente si aún lo usas
//             imageGridItems: imageGridItems // ¡Este es el nuevo array para la grid!
//         });
//     });
// };


const Docente = require('../models/Docente');

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