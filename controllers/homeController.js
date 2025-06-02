const fs = require('fs').promises; 
const fss = require('fs');
const path = require('path'); 
const publicPath = path.join(__dirname, '..', 'public');
const Docente = require('../models/Docente');
const Evento = require('../models/Eventos');
const Noticia = require('../models/Noticias');
const GestionActual = require('../models/GestionActual');
const Promociones = require('../models/Promociones');
const Usuarios=require('../models/Usuarios');
const Carrusels=require('../models/Carrusel');
const sharp = require('sharp');
/*PANTALLA INICIAL */
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
        titulo: ev.titulo,
        description: ev.descripcion
      };
    });
    // Obtener Noticias
    const noticias = await Noticia.find().lean();
    imageGridItemsNoticia = noticias.map(ev => {
      const archivo = ev.nombreImagen?.trim() ? ev.nombreImagen : 'default.jpg';
      return {
        imagePath: `/images/noticias/${archivo}`,
        titulo: ev.titulo,
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
exports.cursoactual = async (req, res) => {
  try {
    const cursos = await GestionActual.find().lean(); 
    const plantelDir = path.join(__dirname, '..', 'public', 'images', 'cursoactual');

    const imageGridItems = await Promise.all(
      cursos.map(async (curso) => {
        let srcUno = '/images/default.jpg';
        let srcDos = '/images/default.jpg';
        let srcTres = '/images/default.jpg';

        if (curso.nombreImagenUno?.trim()) {
          const absPathUno = path.join(plantelDir, curso.nombreImagenUno);
          try {
            await fs.access(absPathUno);
            srcUno = `/images/cursoactual/${curso.nombreImagenUno}`;
          } catch {}
        }

        if (curso.nombreImagenDos?.trim()) {
          const absPathDos = path.join(plantelDir, curso.nombreImagenDos);
          try {
            await fs.access(absPathDos);
            srcDos = `/images/cursoactual/${curso.nombreImagenDos}`;
          } catch {}
        }

        if (curso.nombreImagenTres?.trim()) {
          const absPathTres = path.join(plantelDir, curso.nombreImagenTres);
          try {
            await fs.access(absPathTres);
            srcTres = `/images/cursoactual/${curso.nombreImagenTres}`;
          } catch {}
        }

        return {
          imagePathUno: srcUno,
          imagePathDos: srcDos,
          imagePathTres: srcTres,
          title: curso.Curso,
          description: curso.descripcion,
          fechaRegistro:  curso.fechaRegistro
        };
      })
    );
    console.log(imageGridItems)
    res.render('cursoactual', { imageGridItems });

  } catch (error) {
    console.error('❌ Error al obtener cursos actuales:', error.message);
    res.render('cursoactual', { imageGridItems: [] });
  }
};
exports.promociones = async (req, res) => {
  try {
    const promocion = await Promociones.find().lean();
    const plantelDir = path.join(__dirname, '..', 'public', 'images', 'promociones');

    const imageGridItems = await Promise.all(
      promocion.map(async (curso) => {
        let srcUno = '/images/default.jpg';       

        if (curso.nombreImagen?.trim()) {
          const absPathUno = path.join(plantelDir, curso.nombreImagen);
          try {
            await fs.access(absPathUno);
            srcUno = `/images/promociones/${curso.nombreImagen}`;
          } catch {}
        }
        return {
          imagePathUno: srcUno,         
          title: curso.titulo,
          description: curso.descripcion
         
        };
      })
    );
    console.log(imageGridItems);
    res.render('promociones', { imageGridItems });

  } catch (error) {
    console.error('❌ Error al obtener cursos actuales:', error.message);
    res.render('promociones', { imageGridItems: [] });
  }
};
/*FIN PANTALLA INICIAL */

/*INICIO SESION */
exports.iniciosesion = async (req, res) =>{
  res.render('iniciosesion');
}
exports.verificariniciosesion = async (req, res) => {
  const { seleccion, usuario, passwrd } = req.body;

  // Mapeo del tipo de cuenta
  const tiposValidos = {
    admin: 'administrador',
    tutor: 'apoderado',      // ← asegúrate que este sea el tipo real en tu base
    docente: 'docente'
  };

  const tipo = tiposValidos[seleccion];

  if (!tipo) {
    return res.json({ existe: 0 }); // Tipo no válido
  }
  
  try {
    const usuarioEncontrado = await Usuarios.findOne({
      tipo: tipo,
      usuario:usuario,
      password: passwrd, // 
      estado: 1
    });
    
    if (usuarioEncontrado) {
      return res.json({ existe: 1 });
    } else {
      return res.json({ existe: 0 });
    }
  } catch (error) {
    console.error('Error al verificar el inicio de sesión:', error);
    return res.status(500).json({ error: 'Error en el servidor' });
  }
};
/*FIN INICIO SESION */

/*CARRUSEL */
exports.carrusel = async (req, res) => {
 
      const carruselDocs = await Carrusels.find();   // usa el modelo correcto

      // 2.2- Filtrar imágenes que realmente existan
      const dirPublic = path.join(__dirname, '..', 'public', 'images', 'carrusel');
      const imagenes  = carruselDocs
        .filter(doc => fss.existsSync(path.join(dirPublic, doc.nombreImagen)))
        .map(doc => ({
          nombre: doc.nombreImagen,
          url   : '/images/carrusel/' + doc.nombreImagen,
          fecha : doc.fechaRegistro
        }));

      // 2.3- Renderizar la vista
      return res.render('homeadmin', {       
        carrusel: imagenes
      });
};
exports.eliminarcarrusel = async (req, res) => {
  try {
    const { nombreImagen } = req.body; 
    if (!nombreImagen) {
      return res.status(400).send('Nombre de imagen faltante');
    }   
    const resultado = await Carrusels.deleteOne({ nombreImagen });    
    if (resultado.deletedCount === 0) {
      console.warn(`No se encontró ${nombreImagen} en la colección carrusel.`);
    }
    const rutaImagen = path.join(__dirname, '..', 'public', 'images', 'carrusel', nombreImagen);
    if (fss.existsSync(rutaImagen)) {
      fss.unlinkSync(rutaImagen);
      console.log(`Imagen ${nombreImagen} eliminada del disco`);
    } else {
      console.warn(`Imagen ${nombreImagen} no existe en el disco`);
    }  
    return res.json({ existe: 1 }); 
  } catch (error) {
    console.error('Error al eliminar carrusel:', error);
    return res.json({ existe: 0 }); 
  }
};
exports.registrarcarrusel = async (req, res) => {
  try {
    let { nombreImagen } = req.body;
    const archivo = req.file;                    // viene de multer

    if (!nombreImagen || !archivo) {
      return res.status(400).json({ error: 'Faltan datos' });
    }

    /* 1. Limpieza y normalización */
    nombreImagen = path.basename(nombreImagen.trim());
    const base   = nombreImagen.replace(/\.[^/.]+$/, ''); // sin extensión
    const nombreNormalizado = `${base}.jpg`.toLowerCase();

    /* 2. ¿Existe ya?  (case-insensitive) */
    const existe = await Carrusels.findOne({
      nombreImagen: { $regex: `^${base}\\.jpg$`, $options: 'i' }
    });

    if (existe) {
      return res.json({ existe: 0 });            // ya está en BD
    }

    /* 3. Guardar la imagen como JPG */
    const destinoDir  = path.join(__dirname, '..', 'public', 'images', 'carrusel');
    const destinoPath = path.join(destinoDir, nombreNormalizado);

    // Crea dir si no existe
    await fs.mkdir(destinoDir, { recursive: true });

    // Convierte a JPG (calidad 80) y guarda
    await sharp(archivo.buffer)
      .jpeg({ quality: 80 })
      .toFile(destinoPath);

    /* 4. Inserta en la base de datos */
    await Carrusels.create({ nombreImagen: nombreNormalizado });

    return res.json({ existe: 1 });              // lo acabamos de guardar
  } catch (err) {
    console.error('Error verificarcarrusel:', err);
    return res.json({ existe: 0 }); 
  }
};
/* FIN CARRUSEL */

/*EVENTOS*/
exports.evento= async (req, res) =>{
  const  resultado = await Evento.find();  
  const dirPublic = path.join(__dirname, '..', 'public', 'images', 'eventos');
  const imagenes  = resultado 
  .filter(doc => fss.existsSync(path.join(dirPublic, doc.nombreImagen)))
  .map(doc => ({
          nombre: doc.nombreImagen,
          url   : '/images/eventos/' + doc.nombreImagen,
         fecha: doc.fechaCreacion instanceof Date ? doc.fechaCreacion : new Date(doc.fechaCreacion),
          descripcion:doc.descripcion,
          titulo:doc.titulo,
          id:doc._id.toString()
        }));    
      return res.render('eventosadmin', {        
        carrusel: imagenes
      });
}
exports.eliminarevento = async (req, res) => {   
  try {
    const { id } = req.body;
    if (!id) {
      return res.status(400).send('Nombre de imagen faltante');
    }
    const documento =await Evento.findOne({ _id: id });        
    await Evento.deleteOne({ _id: id });     
    const rutaImagen = path.join(__dirname, '..', 'public', 'images', 'eventos', documento.nombreImagen);     
    if (fss.existsSync(rutaImagen)) {       
        fss.unlinkSync(rutaImagen);       
    }     
    const  resultado = await Evento.find();    
    const dirPublic = path.join(__dirname, '..', 'public', 'images', 'eventos');
    const imagenes  = resultado 
        .filter(doc => fss.existsSync(path.join(dirPublic, doc.nombreImagen)))
        .map(doc => ({
          nombre: doc.nombreImagen,
          url   : '/images/eventos/' + doc.nombreImagen,
         fecha: doc.fechaCreacion instanceof Date ? doc.fechaCreacion : new Date(doc.fechaCreacion),
          descripcion:doc.descripcion,
          titulo:doc.titulo,
          id:doc._id.toString()
        }));  
     return res.json({existe:1});    
  } catch (error) {
    console.error('Error al eliminar carrusel:', error);
    return res.json({existe:0});
  }
};
exports.registrarevento = async (req, res) => {
  try {
    let { nombreImagen,titulo,descripcion } = req.body;
    const archivo = req.file;
    if (!nombreImagen || !archivo) {
      return res.status(400).json({ error: 'Faltan datos' });
    }  
    nombreImagen = path.basename(nombreImagen.trim());
    const base   = nombreImagen.replace(/\.[^/.]+$/, ''); // sin extensión
    const nombreNormalizado = `${base}.jpg`.toLowerCase();
    const existe = await Evento.findOne({
      nombreImagen: { $regex: `^${base}\\.jpg$`, $options: 'i' }
    });
    if (existe) {
      return res.json({ existe: 0 });       
    }  
    const destinoDir  = path.join(__dirname, '..', 'public', 'images', 'eventos');
    const destinoPath = path.join(destinoDir, nombreNormalizado);    
    await fs.mkdir(destinoDir, { recursive: true });  
    await sharp(archivo.buffer)
      .jpeg({ quality: 80 })
      .toFile(destinoPath);   
    await Evento.create({ nombreImagen: nombreNormalizado, descripcion:descripcion, titulo:titulo,fechaRegistro: new Date()  });
    return res.json({ existe: 1 });     
  } catch (err) {
    console.error('Error verificarcarrusel:', err);
    return res.json({ existe: 0 });  
  }
};
/*FIN EVENTOS*/

/*NOTICIAS*/
exports.noticia= async (req, res) =>{
  const  resultado = await Noticia.find();     
  const dirPublic = path.join(__dirname, '..', 'public', 'images', 'noticias');
  const imagenes  = resultado 
        .filter(doc => fss.existsSync(path.join(dirPublic, doc.nombreImagen)))
        .map(doc => ({
          nombre: doc.nombreImagen,
          url   : '/images/noticias/' + doc.nombreImagen,
         fecha: doc.Publicacion,
          descripcion:doc.descripcion,
          titulo:doc.titulo,
          id:doc._id.toString()
        }));      
  return res.render('noticiasadmin', {        
    carrusel: imagenes
  });
}
exports.eliminarnoticia = async (req, res) => {   
  try {
    const { id } = req.body;
    if (!id) {
      return res.status(400).send('Nombre de imagen faltante');
    }
      const documento =await Noticia.findOne({ _id: id });      
      await Noticia.deleteOne({ _id: id });     
      const rutaImagen = path.join(__dirname, '..', 'public', 'images', 'noticias', documento.nombreImagen);     
      if (fss.existsSync(rutaImagen)) {       
        fss.unlinkSync(rutaImagen);       
      }  
      const  resultado = await Noticia.find();   
      const dirPublic = path.join(__dirname, '..', 'public', 'images', 'noticias');
      const imagenes  = resultado 
        .filter(doc => fss.existsSync(path.join(dirPublic, doc.nombreImagen)))
        .map(doc => ({
          nombre: doc.nombreImagen,
          url   : '/images/noticias/' + doc.nombreImagen,
         fecha: doc.fechaCreacion instanceof Date ? doc.fechaCreacion : new Date(doc.fechaCreacion),
          descripcion:doc.descripcion,
          titulo:doc.titulo,
          id:doc._id.toString()
        }));
      return res.json({existe:1});
  } catch (error) {
    console.error('Error al eliminar carrusel:', error);
   return res.json({existe:0});
  }
};
exports.registrarnoticia = async (req, res) => {
  try {
    let { nombreImagen,titulo,descripcion } = req.body;
    const archivo = req.file;
    if (!nombreImagen || !archivo) {
      return res.status(400).json({ error: 'Faltan datos' });
    }
    nombreImagen = path.basename(nombreImagen.trim());
    const base   = nombreImagen.replace(/\.[^/.]+$/, ''); // sin extensión
    const nombreNormalizado = `${base}.jpg`.toLowerCase();
    const existe = await Noticia.findOne({
      nombreImagen: { $regex: `^${base}\\.jpg$`, $options: 'i' }
    });
    if (existe) {
      return res.json({ existe: 0 });      
    }   
    const destinoDir  = path.join(__dirname, '..', 'public', 'images', 'noticias');
    const destinoPath = path.join(destinoDir, nombreNormalizado);
    await fs.mkdir(destinoDir, { recursive: true });
    await sharp(archivo.buffer)
      .jpeg({ quality: 80 })
      .toFile(destinoPath);   
    await Noticia.create({ nombreImagen: nombreNormalizado, descripcion:descripcion, titulo:titulo,fechaRegistro: new Date()  });
    return res.json({ existe: 1 });    
  } catch (err) {
    console.error('Error verificarcarrusel:', err);
    return res.json({ existe: 0 });  
  }
};
/*FIN NOTICIAS*/

/*CURSOS*/
exports.curso = async (req, res) => {
  const resultado = await GestionActual.find();

  const dirPublic = path.join(__dirname, '..', 'public', 'images', 'cursoactual');

  const carrusel = resultado.map(doc => {
    // Verifica cada imagen individualmente
    const imagenes = [];

    if (doc.nombreImagenUno && fss.existsSync(path.join(dirPublic, doc.nombreImagenUno))) {
      imagenes.push('/images/cursoactual/' + doc.nombreImagenUno);
    }
    if (doc.nombreImagenDos && fss.existsSync(path.join(dirPublic, doc.nombreImagenDos))) {
      imagenes.push('/images/cursoactual/' + doc.nombreImagenDos);
    }
    if (doc.nombreImagenTres && fss.existsSync(path.join(dirPublic, doc.nombreImagenTres))) {
      imagenes.push('/images/cursoactual/' + doc.nombreImagenTres);
    }

    return {
      titulo      : doc.Curso,
      descripcion : doc.descripcion,
      url1    : imagenes[0], // array con 1, 2 o 3 imágenes
      url2    : imagenes[1], // array con 1, 2 o 3 imágenes
      url3    : imagenes[2], // array con 1, 2 o 3 imágenes
      id          : doc._id.toString(),
      fecha       : new Date(doc.fechaRegistro).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })
    };
  });

  return res.render('cursosadmin', { carrusel });
};
exports.eliminarcurso = async (req, res) => {   
  try {
    const { id } = req.body;
 console.log(req.body);
    if (!id) {
      return res.status(400).json({ existe: 0, error: 'ID de curso faltante' });
    }

    const documento = await GestionActual.findOne({ _id: id });

    if (!documento) {
      return res.status(404).json({ existe: 0, error: 'Curso no encontrado' });
    }

    // Eliminar de la base de datos
    await GestionActual.deleteOne({ _id: id });

    const dirImagenes = path.join(__dirname, '..', 'public', 'images', 'cursoactual');

    const imagenes = [documento.nombreImagenUno, documento.nombreImagenDos, documento.nombreImagenTres];
    imagenes.forEach(nombre => {
      if (nombre) {
        const ruta = path.join(dirImagenes, nombre);
        if (fss.existsSync(ruta)) {
          fss.unlinkSync(ruta);
        }
      }
    });
 const resultado = await GestionActual.find();

  const dirPublic = path.join(__dirname, '..', 'public', 'images', 'cursoactual');

  const carrusel = resultado.map(doc => {
    // Verifica cada imagen individualmente
    const imagenes = [];

    if (doc.nombreImagenUno && fss.existsSync(path.join(dirPublic, doc.nombreImagenUno))) {
      imagenes.push('/images/cursoactual/' + doc.nombreImagenUno);
    }
    if (doc.nombreImagenDos && fss.existsSync(path.join(dirPublic, doc.nombreImagenDos))) {
      imagenes.push('/images/cursoactual/' + doc.nombreImagenDos);
    }
    if (doc.nombreImagenTres && fss.existsSync(path.join(dirPublic, doc.nombreImagenTres))) {
      imagenes.push('/images/cursoactual/' + doc.nombreImagenTres);
    }

    return {
      titulo      : doc.Curso,
      descripcion : doc.descripcion,
      url1    : imagenes[0], // array con 1, 2 o 3 imágenes
      url2    : imagenes[1], // array con 1, 2 o 3 imágenes
      url3    : imagenes[2], // array con 1, 2 o 3 imágenes
      id          : doc._id.toString(),
      fecha       : new Date(doc.fechaRegistro).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })
    };
  });

   return res.json({ existe: 1 });
   

  } catch (error) {
    console.error('Error al eliminar curso:', error);
     return res.json({ existe: 0 });
  }
};
exports.registrarcurso = async (req, res) => {
  try {
    const { titulo, descripcion } = req.body;

    /* 1) Verificar que la imagen principal exista -------------------------- */
    if (!req.files || !req.files.imagen || req.files.imagen.length === 0) {
      return res.status(400).json({ error: 'La imagen principal es obligatoria' });
    }

    /* 2) Función de ayuda para slug y timestamp --------------------------- */
    const slugify = str =>
      str
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');

    const now  = new Date();
    const tms  =
      String(now.getMinutes()).padStart(2, '0') +
      String(now.getSeconds()).padStart(2, '0') +
      String(now.getMilliseconds()).padStart(3, '0');

    const slug = slugify(titulo);

    /* 3) Carpeta destino --------------------------------------------------- */
    const destinoDir = path.join(__dirname, '..', 'public', 'images', 'cursoactual');
    await fs.mkdir(destinoDir, { recursive: true });

    /* 4) Función genérica para procesar y guardar cada imagen -------------- */
    const procesarImagen = async (file, idx) => {
      const nombreFinal = `${slug}-${tms}-${idx}.jpg`;
      const destino     = path.join(destinoDir, nombreFinal);

      await sharp(file.buffer)
        .jpeg({ quality: 80 })
        .toFile(destino);

      return nombreFinal; // se guarda solo el nombre
    };

    /* 5) Procesar la imagen principal (idx 1) ------------------------------ */
    const nombreImg1 = await procesarImagen(req.files.imagen[0], 1);

    /* 6) Procesar opcionales (idx 2 y 3) ----------------------------------- */
    const nombreImg2 = req.files.imagen2 && req.files.imagen2[0]
      ? await procesarImagen(req.files.imagen2[0], 2)
      : null;

    const nombreImg3 = req.files.imagen3 && req.files.imagen3[0]
      ? await procesarImagen(req.files.imagen3[0], 3)
      : null;

    /* 7) Guardar en la BD -------------------------------------------------- */
    await GestionActual.create({
      Curso            : titulo,
      descripcion,
      nombreImagenUno  : nombreImg1,
      nombreImagenDos  : nombreImg2,
      nombreImagenTres : nombreImg3,
      fechaRegistro    : now
    });

    return res.json({ existe: 1 });
  } catch (err) {
    console.error('Error registrarcurso:', err);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};
/*FIN CURSOS*/