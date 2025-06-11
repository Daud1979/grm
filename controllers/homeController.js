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
const Curso=require('../models/Curso');
const sharp = require('sharp');
const Apoderado = require('../models/Apoderado');
const Alumno = require('../models/Alumno');
const Incidencia = require('../models/Incidencia');
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
    const docentes = await Docente.find({estado:1});

    // Carpeta donde deben vivir las imágenes de los docentes
    const plantelDir = path.join(__dirname, '..', 'public', 'images', 'plantel');

    // Construye las tarjetas comprobando si la imagen existe
    const imageGridItems = await Promise.all(
      docentes.map(async (docente) => {
        let src = '/images/default.jpg';                     // valor por defecto

        if (docente.nombreImagen && docente.nombreImagen.trim() !== '') {
          const absPath = path.join(plantelDir, docente.nombreImagen);
src = `/images/plantel/${docente.nombreImagen}`;

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
  const { tipo, usuario, passwrd } = req.body;

   if (tipo == 'administrador')
   {
    try {
    const usuarioEncontrado = await Usuarios.findOne({
       tipo: tipo,
       usuario:usuario,
       password: passwrd,
       estado: 1
    });

    if (usuarioEncontrado) {
      req.session.idAdmin = usuarioEncontrado._id;
      req.session.Tipo ='administrador';
      const carruselDocs = await Carrusels.find();   // usa el modelo correcto
      const dirPublic = path.join(__dirname, '..', 'public', 'images', 'carrusel');
      const imagenes  = carruselDocs
        .filter(doc => fss.existsSync(path.join(dirPublic, doc.nombreImagen)))
        .map(doc => ({
          nombre: doc.nombreImagen,
          url   : '/images/carrusel/' + doc.nombreImagen,
          fecha : doc.fechaRegistro
        }));

        return res.json({ existe: 1 });
    } else {
      return res.json({ existe: 0 });
    }
    }
    catch (error)
    {
      console.error('Error al verificar el inicio de sesión:', error);
      return res.status(500).json({ error: 'Error en el servidor' });
    }
  }
  else if (tipo =='docente')
  {
     try {
    const usuarioEncontrado = await Docente.findOne({
       usuario:usuario,
       passwrd: passwrd,
       estado:1
    });

    if (usuarioEncontrado) {
      req.session.idDocente = usuarioEncontrado._id;
      req.session.Tipo ='docente';
      return res.json({ existe: 2, usuario:usuarioEncontrado });
    } else {
      return res.json({ existe: 0 });
    }
    }
    catch (error)
    {
      console.error('Error al verificar el inicio de sesión:', error);
      return res.status(500).json({ error: 'Error en el servidor' });
    }

  }
  else if(tipo=='tutor')
  {    
    try {
      const usuarioEncontrado = await Apoderado.findOne({
      usuario:usuario,
      passwrd: passwrd,
      
    });   
    if (usuarioEncontrado) {
      req.session.idApoderado = usuarioEncontrado._id;
      req.session.Tipo ='tutor';
      return res.json({ existe: 3, usuario:usuarioEncontrado });
    } else {
      return res.json({ existe: 0 });
    }
    }
    catch (error)
    {
      console.error('Error al verificar el inicio de sesión:', error);
      return res.status(500).json({ error: 'Error en el servidor' });
    }
  }
  else
  {
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
          fecha : doc.fechaRegistro,
          id: doc._id.toString(),
        }));

      // 2.3- Renderizar la vista
      return res.render('homeadmin', {
        carrusel: imagenes
      });
};
exports.eliminarcarrusel = async (req, res) => {
  try {
    const { id } = req.body;
    const documento = await Carrusels.findOne({_id:id});
    nombreImagen=documento.nombreImagen;
    const resultado = await Carrusels.deleteOne({ nombreImagen:nombreImagen });
    if (resultado.deletedCount === 0) {
      console.warn(`No se encontró ${nombreImagen} en la colección carrusel.`);
    }
    const rutaImagen = path.join(__dirname, '..', 'public', 'images', 'carrusel', nombreImagen);
    if (fss.existsSync(rutaImagen)) {
      fss.unlinkSync(rutaImagen);
      console.log(`Imagen ${nombreImagen} eliminada del disco`);
    } else {
      console.log(`Imagen ${nombreImagen} no existe en el disco`);
    }
    return res.json({ existe: 1 });
  } catch (error) {
    console.error('Error al eliminar carrusel:', error);
    return res.json({ existe: 0 });
  }
};

exports.registrarcarrusel = async (req, res) => {
  console.log('as');
  try {
    const archivo = req.file; // viene de multer

    if (!archivo) {
      return res.status(400).json({ error: 'Falta la imagen' });
    }

    // 1. Generar nombre automático
    const fecha = new Date();
    const formatoFecha = fecha.toISOString().replace(/[-T:.Z]/g, '').slice(0, 17); // YYYYMMDDHHMMSSmmm
    const letrasAleatorias = Array.from({ length: 3 }, () =>
      String.fromCharCode(97 + Math.floor(Math.random() * 26)) // letras minúsculas aleatorias
    ).join('');
    const nombreGenerado = `${formatoFecha}_grm${letrasAleatorias}.jpg`.toLowerCase();

    // 2. Verificar si ya existe (opcional: poco probable si es aleatorio)
    const existe = await Carrusels.findOne({
      nombreImagen: { $regex: `^${nombreGenerado}$`, $options: 'i' }
    });

    if (existe) {
      return res.json({ existe: 0 }); // Evita duplicado (aunque es raro)
    }

    // 3. Guardar imagen en disco
    const destinoDir = path.join(__dirname, '..', 'public', 'images', 'carrusel');
    const destinoPath = path.join(destinoDir, nombreGenerado);

    await fs.mkdir(destinoDir, { recursive: true });

    await sharp(archivo.buffer)
      .jpeg({ quality: 80 })
      .toFile(destinoPath);

    // 4. Guardar en la base de datos
    await Carrusels.create({ nombreImagen: nombreGenerado });

    return res.json({ existe: 1, nombreImagen: nombreGenerado });
  } catch (err) {
    console.error('Error registrar carrusel:', err);
    return res.json({ existe: 0 });
  }
};
/* FIN CARRUSEL */

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
    const { titulo, descripcion } = req.body;
    const archivo = req.file;

    if (!titulo || !descripcion || !archivo) {
      return res.status(400).json({ error: 'Faltan datos' });
    }

    // 1. Generar nombre automático para la imagen
    const fecha = new Date();
    const formatoFecha = fecha.toISOString().replace(/[-T:.Z]/g, '').slice(0, 17); // YYYYMMDDHHMMSSmmm
    const letrasAleatorias = Array.from({ length: 3 }, () =>
      String.fromCharCode(97 + Math.floor(Math.random() * 26))
    ).join('');
    const nombreGenerado = `${formatoFecha}_grm${letrasAleatorias}.jpg`.toLowerCase();

    // 2. Verificar si ya existe (opcional)
    const existe = await Noticia.findOne({
      nombreImagen: { $regex: `^${nombreGenerado}$`, $options: 'i' }
    });

    if (existe) {
      return res.json({ existe: 0 });
    }

    // 3. Guardar imagen
    const destinoDir = path.join(__dirname, '..', 'public', 'images', 'noticias');
    const destinoPath = path.join(destinoDir, nombreGenerado);

    await fs.mkdir(destinoDir, { recursive: true });

    await sharp(archivo.buffer)
      .jpeg({ quality: 80 })
      .toFile(destinoPath);

    // 4. Guardar noticia en base de datos
    await Noticia.create({
      nombreImagen: nombreGenerado,
      titulo,
      descripcion,
      fechaRegistro: new Date()
    });

    return res.json({ existe: 1, nombreImagen: nombreGenerado });
  } catch (err) {
    console.error('Error registrarnoticia:', err);
    return res.status(500).json({ existe: 0, error: 'Error del servidor' });
  }
};

/*FIN NOTICIAS*/

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
    const { titulo, descripcion } = req.body;
    const archivo = req.file;

    if (!titulo || !descripcion || !archivo) {
      return res.status(400).json({ error: 'Faltan datos' });
    }

    // 1. Generar nombre de imagen automáticamente
    const fecha = new Date();
    const formatoFecha = fecha.toISOString().replace(/[-T:.Z]/g, '').slice(0, 17); // YYYYMMDDHHMMSSmmm
    const letrasAleatorias = Array.from({ length: 3 }, () =>
      String.fromCharCode(97 + Math.floor(Math.random() * 26))
    ).join('');
    const nombreGenerado = `${formatoFecha}_grm${letrasAleatorias}.jpg`.toLowerCase();

    // 2. Verificar si ya existe (poco probable)
    const existe = await Evento.findOne({
      nombreImagen: { $regex: `^${nombreGenerado}$`, $options: 'i' }
    });

    if (existe) {
      return res.json({ existe: 0 });
    }

    // 3. Guardar imagen en disco
    const destinoDir = path.join(__dirname, '..', 'public', 'images', 'eventos');
    const destinoPath = path.join(destinoDir, nombreGenerado);

    await fs.mkdir(destinoDir, { recursive: true });

    await sharp(archivo.buffer)
      .jpeg({ quality: 80 })
      .toFile(destinoPath);

    // 4. Guardar evento en base de datos
    await Evento.create({
      nombreImagen: nombreGenerado,
      titulo,
      descripcion,
      fechaRegistro: new Date()
    });

    return res.json({ existe: 1, nombreImagen: nombreGenerado });
  } catch (err) {
    console.error('Error registrarevento:', err);
    return res.status(500).json({ existe: 0, error: 'Error del servidor' });
  }
};

/*FIN EVENTOS*/

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
exports.registrarcursos = async (req, res) => {

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
exports.obtenercurso = async (req,res)=>{
  const id=req.body.id;
  const resultado = await GestionActual.find({_id:id});

  return res.json({resultado});
}
exports.modificarcurso = async (req, res) => {
  try {
    const { titulo, descripcion,id } = req.body;

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

    /* 6) Procesar opcionales (idx 2 y 3) ----------------------------------- */
    const nombreImg2 = req.files.imagen2 && req.files.imagen2[0]
      ? await procesarImagen(req.files.imagen2[0], 2)
      : null;

    const nombreImg3 = req.files.imagen3 && req.files.imagen3[0]
      ? await procesarImagen(req.files.imagen3[0], 3)
      : null;

    /* 7) Guardar en la BD -------------------------------------------------- */

await GestionActual.findByIdAndUpdate(id, {
  Curso: titulo,
  descripcion: descripcion,
  nombreImagenDos: nombreImg2,
  nombreImagenTres: nombreImg3,
  fechaRegistro: now
});

    return res.json({ existe: 1 });
  } catch (err) {
    console.error('Error registrarcurso:', err);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }

};
/*FIN CURSOS*/

/*PROMOCION*/
exports.promocion = async (req, res) => {
  const resultado = await Promociones.find();
  const dirPublic = path.join(__dirname, '..', 'public', 'images', 'promociones');
  const imagenes  = resultado
  .filter(doc => fss.existsSync(path.join(dirPublic, doc.nombreImagen)))
  .map(doc => ({
          nombre: doc.nombreImagen,
          url   : '/images/promociones/' + doc.nombreImagen,
          descripcion:doc.descripcion,
          titulo:doc.titulo,
          id:doc._id.toString()
        }));
      return res.render('promocionesadmin', {
        carrusel: imagenes
      });
};
exports.eliminarpromocion = async (req, res) => {
 try {
    const { id } = req.body;
    if (!id) {
      return res.status(400).send('Nombre de imagen faltante');
    }
    const documento =await Promociones.findOne({ _id: id });
    await Promociones.deleteOne({ _id: id });
    const rutaImagen = path.join(__dirname, '..', 'public', 'images', 'promociones', documento.nombreImagen);
    if (fss.existsSync(rutaImagen)) {
        fss.unlinkSync(rutaImagen);
    }

    return res.json({existe:1});
  } catch (error) {
    console.error('Error al eliminar carrusel:', error);
    return res.json({existe:0});
  }
};
exports.registrarpromocion = async (req, res) => {
  try {
    const { titulo, descripcion } = req.body;
    const archivo = req.file;

    if (!titulo || !descripcion || !archivo) {
      return res.status(400).json({ error: 'Faltan datos' });
    }

    // 1. Generar nombre único automático
    const fecha = new Date();
    const formatoFecha = fecha.toISOString().replace(/[-T:.Z]/g, '').slice(0, 17); // YYYYMMDDHHmmssSSS
    const letrasAleatorias = Array.from({ length: 3 }, () =>
      String.fromCharCode(97 + Math.floor(Math.random() * 26))
    ).join('');
    const nombreGenerado = `${formatoFecha}_grm${letrasAleatorias}.jpg`.toLowerCase();

    // 2. Verificar si ya existe (muy poco probable)
    const existe = await Promociones.findOne({
      nombreImagen: { $regex: `^${nombreGenerado}$`, $options: 'i' }
    });

    if (existe) {
      return res.json({ existe: 0 });
    }

    // 3. Guardar imagen
    const destinoDir = path.join(__dirname, '..', 'public', 'images', 'promociones');
    const destinoPath = path.join(destinoDir, nombreGenerado);

    await fs.mkdir(destinoDir, { recursive: true });

    await sharp(archivo.buffer)
      .jpeg({ quality: 80 })
      .toFile(destinoPath);

    // 4. Guardar promoción en BD
    await Promociones.create({
      nombreImagen: nombreGenerado,
      titulo,
      descripcion
    });

    return res.json({ existe: 1, nombreImagen: nombreGenerado });
  } catch (err) {
    console.error('Error registrarpromocion:', err);
    return res.status(500).json({ existe: 0, error: 'Error del servidor' });
  }
};

/*FIN PROMOCION*/

/* DOCENTE*/
exports.docente = async (req, res) => {
  const resultado = await Docente.find();

  const dirPublic = path.join(__dirname, '..', 'public', 'images', 'plantel');
  const imagenes  = resultado
  .filter(doc => fss.existsSync(path.join(dirPublic, doc.nombreImagen)))
  .map(doc => ({
          nombre:doc.nombre,
          nombreImagen: doc.nombreImagen,
          url   : '/images/plantel/' + doc.nombreImagen,
          descripcion:doc.descripcion,
          usuario:doc.usuario,
          passwrd:doc.passwrd,
          estado:(doc.estado==1?'Habilitado':'Deshabilitado'),
          id:doc._id.toString()
        }));
      return res.render('docenteadmin', {
        carrusel: imagenes
      });
};

exports.eliminardocente = async (req, res) => {
 try {
    const { id } = req.body;
    if (!id) {
      return res.status(400).send('Nombre de imagen faltante');
    }
    const documento =await Docente.findOne({ _id: id });
    await Docente.deleteOne({ _id: id });
    const rutaImagen = path.join(__dirname, '..', 'public', 'images', 'plantel', documento.nombreImagen);
    if (fss.existsSync(rutaImagen)) {
        fss.unlinkSync(rutaImagen);
    }

    return res.json({existe:1});
  } catch (error) {
    console.error('Error al eliminar carrusel:', error);
    return res.json({existe:0});
  }
};

exports.obtenerdocente = async (req, res) => {
  try {
    const id = req.body.id;
    const docente = await Docente.findById(id);

    if (!docente) {
      return res.status(404).json({ error: 'Docente no encontrado' });
    }

    // Construir la URL pública de la imagen
    const imagenURL = docente.nombreImagen
      ? `/images/plantel/${docente.nombreImagen}`
      : null;

    // Retornar los datos con la ruta de imagen incluida
    return res.json({
      resultado: {
        ...docente.toObject(),  // convierte el documento Mongoose a objeto plano
        imagenURL
      }
    });
  } catch (error) {
    console.error('Error al obtener el docente:', error);
    return res.status(500).json({ error: 'Error del servidor' });
  }
};

exports.registrardocente = async (req, res) => {

  try {
    let { ci, nombre, descripcion, usuario, passwrd } = req.body;
    const archivo = req.file;

    if (!archivo) {
      return res.status(400).json({ error: 'Faltan datos' });
    }

    const existebs = await Docente.findOne({ ci: ci });
    if (existebs) {
      return res.json({ existe: 2 }); // ya está en la base de datos
    }

    // 🔽 Generar nombre de archivo
    const now = new Date();
    const hhmmssmmm =
      String(now.getHours()).padStart(2, '0') +
      String(now.getMinutes()).padStart(2, '0') +
      String(now.getSeconds()).padStart(2, '0') +
      String(now.getMilliseconds()).padStart(3, '0');

    const nombreNormalizado = `${ci}-${hhmmssmmm}.jpg`;

    // 🔽 Guardar archivo
    const destinoDir = path.join(__dirname, '..', 'public', 'images', 'plantel');
    const destinoPath = path.join(destinoDir, nombreNormalizado);
    await fs.mkdir(destinoDir, { recursive: true });

    await sharp(archivo.buffer)
      .jpeg({ quality: 80 })
      .toFile(destinoPath);

    // 🔽 Guardar en la base de datos
    await Docente.create({
      ci,
      nombre,
      descripcion,
      nombreImagen: nombreNormalizado,
      usuario,
      passwrd
    });

    return res.json({ existe: 1 });
  } catch (err) {
    console.error('Error verificarcarrusel:', err);
    return res.json({ existe: 0 });
  }
};

exports.modificardocente = async (req, res) => {
  try {
    const {
      id,
      ci,
      nombre,
      descripcion,
      usuario,
      passwrd,
      estado,
      nombreImagen  // nombre anterior
    } = req.body;

    const docente = await Docente.findById(id);
    if (!docente) {
      return res.status(404).json({ error: 'Docente no encontrado' });
    }

    // Verifica si se subió una nueva imagen
    let nombreImagenFinal = nombreImagen; // si no hay nueva, se mantiene la anterior

    if (req.files && req.files.imagen && req.files.imagen[0]) {
      // Eliminar imagen anterior si existe y es diferente
      if (docente.nombreImagen && docente.nombreImagen !== nombreImagen) {
        const rutaAnterior = path.join(__dirname, '..', 'public', 'images', 'plantel', docente.nombreImagen);
        if (fss.existsSync(rutaAnterior)) {
          fss.unlinkSync(rutaAnterior);
        }
      }

      // Generar nombre único a partir del nombre del docente
      const slugify = str =>
        str.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

      const now = new Date();
      const tms =
        String(now.getMinutes()).padStart(2, '0') +
        String(now.getSeconds()).padStart(2, '0') +
        String(now.getMilliseconds()).padStart(3, '0');

      const slug = slugify(nombre);
      const nombreFinal = `${slug}-${tms}.jpg`;

      const destinoDir = path.join(__dirname, '..', 'public', 'images', 'plantel');
      await fs.mkdir(destinoDir, { recursive: true });

      const destino = path.join(destinoDir, nombreFinal);

      // Procesar y guardar imagen
      await sharp(req.files.imagen[0].buffer)
        .jpeg({ quality: 80 })
        .toFile(destino);

      nombreImagenFinal = nombreFinal;
    }

    // Actualizar en base de datos
    await Docente.findByIdAndUpdate(id, {
      ci,
      nombre,
      descripcion,
      nombreImagen: nombreImagenFinal,
      usuario,
      passwrd,
      estado,
    });

    return res.json({ existe: 1 });
  } catch (err) {
    console.error('Error al modificar docente:', err);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

/*FIN DOCENTE*/

/*ESTUDIANTES */
exports.estudiante = async (req, res) => {
  try {
    const carrusel = await Curso.find(); // Si es necesario para la vista

    // Traer todos los alumnos y sus apoderados
    const alumnos = await Alumno.find()
      .populate('apoderados') // trae los datos de los apoderados relacionados
      .lean(); // para que sea más rápido y compatible con la vista

    res.render('estudiantesadmin', { carrusel, alumnos });
  } catch (error) {
    console.error("Error al cargar estudiantes:", error);
    res.status(500).send("Error al cargar estudiantes.");
  }
};

/*FIN ESTUDIANTE */

exports.registrarcurso=async(req,res)=>{
  const {curso}=req.body;
  const resultado =await Curso.findOne({curso:curso.toUpperCase()});

  if (!resultado)
  {
    await Curso.create({curso:curso.toUpperCase()});
    carrusels = await Curso.find();
    return  res.json({existe:1,carrusel:carrusels});
  }
  else{
    return res.json({existe:0,carrusel:''});
  }

}
exports.registraralumno = async (req, res) => {
  try {
    const body = req.body;
  console.log(req.body);
    const apoderados = [];
    const alumnos = [];

    // Parsear y limpiar apoderados
    Object.keys(body).forEach(key => {
      const match = key.match(/^apoderados\[(\d+)\]\[(\w+)\]$/);
      if (match) {
        const index = parseInt(match[1]);
        const field = match[2];
        apoderados[index] = apoderados[index] || {};
        apoderados[index][field] = (body[key] || '').trim();
      }
    });

    // Parsear y limpiar alumnos
    Object.keys(body).forEach(key => {
      const match = key.match(/^alumnos\[(\d+)\]\[(\w+)\]$/);
      if (match) {
        const index = parseInt(match[1]);
        const field = match[2];
        alumnos[index] = alumnos[index] || {};
        alumnos[index][field] = (body[key] || '').trim();
      }
    });

    const apoderadosFiltrados = apoderados.filter(a => a && a.ci);
    const alumnosFiltrados = alumnos.filter(a => a && a.ci_alumno);

    // Guardamos los IDs de alumnos creados/actualizados
    const alumnoIds = [];

    for (const alumnoData of alumnosFiltrados) {
      let alumno = await Alumno.findOne({ ci_alumno: alumnoData.ci_alumno });

      if (!alumno) {
        alumno = new Alumno({
          ci_alumno: alumnoData.ci_alumno,
          nombre: alumnoData.nombre,
          curso: alumnoData.curso,
          apoderados: [] // se llenará luego
        });
        await alumno.save();
        console.log("Alumno registrado:", alumno.ci_alumno);
      } else {
        // Actualizar si ya existe
        alumno.nombre = alumnoData.nombre;
        alumno.curso = alumnoData.curso;
        await alumno.save();
        console.log("Alumno actualizado:", alumno.ci_alumno);
      }

      alumnoIds.push(alumno._id);
    }

    for (const apoderadoData of apoderadosFiltrados) {
      let apoderado = await Apoderado.findOne({ ci: apoderadoData.ci });

      if (!apoderado) {
        apoderado = new Apoderado({
          ci: apoderadoData.ci,
          nombre: apoderadoData.nombre,
          apellidos: apoderadoData.apellidos,
          usuario:apoderadoData.ci,
          passwrd:apoderadoData.ci,
          hijos: alumnoIds
        });
        await apoderado.save();
        console.log("Apoderado registrado:", apoderado.ci);
      } else {
        // Actualiza los datos y agrega hijos sin duplicar
        apoderado.nombre = apoderadoData.nombre;
        apoderado.apellidos = apoderadoData.apellidos;
        apoderado.hijos = [...new Set([...apoderado.hijos, ...alumnoIds])];
        await apoderado.save();
        console.log("Apoderado actualizado:", apoderado.ci);
      }

      // Asociar apoderado con alumnos (evitar duplicados)
      for (const alumnoId of alumnoIds) {
        const alumno = await Alumno.findById(alumnoId);
        if (!alumno.apoderados.includes(apoderado._id)) {
          alumno.apoderados.push(apoderado._id);
          await alumno.save();
        }
      }
    }

    return res.redirect('/GRMEstudiante');

  } catch (error) {
    console.error("Error en registro:", error);
    return res.status(500).send("Ocurrió un error al registrar los datos.");
  }
};
exports.eliminaralumno = async (req, res) => {
  try {
    const { id } = req.body;

    const alumno = await Alumno.findById(id).populate('apoderados');
    if (!alumno) return res.status(404).json({ mensaje: 'Alumno no encontrado' });


    const apoderadoIds = alumno.apoderados.map(ap => ap._id);

    // 3. Eliminar al alumno
    await Alumno.findByIdAndDelete(id);


    for (const apoderadoId of apoderadoIds) {
      const apoderado = await Apoderado.findById(apoderadoId);

      if (!apoderado) continue;

      apoderado.hijos = apoderado.hijos.filter(hijoId => hijoId.toString() !== id);

      if (apoderado.hijos.length === 0) {

        await Apoderado.findByIdAndDelete(apoderadoId);
      } else {

        await apoderado.save();
      }
    }

    return res.json({exito:1 });

  } catch (error) {
    console.error('Error al eliminar alumno:', error);
    return res.status(500).json({ mensaje: 'Error en el servidor' });
  }
};
/*DOCENTES*/
exports.acciones = async (req, res) => {
  const usuario = await Docente.findOne({ _id: req.session.idDocente });
  const id = req.session.idDocente;

  const alumno = await Alumno.find()
    .populate('apoderados')
    .lean();

  let incidencias = await Incidencia.find({ estado: 0, docente: id })
    .populate('alumno')
    .lean();

  // Agregar la URL de la imagen
  incidencias = incidencias.map(inc => {
    if (inc.nombreImagen) {
      inc.imagenUrl = `/images/incidencia/${inc.nombreImagen}`;
    } else {
      inc.imagenUrl = '/images/default.jpg'; // imagen por defecto
    }
    return inc;
  });
  
  res.render('homedocente', { usuario, alumno, incidencias });
};


exports.registrarincidencia = async (req, res) => {
  try {
    const idpr = req.session.idDocente;
    console.log(req.body);
    const { titulo, motivo, acciones, fecha, id } = req.body;
    const archivo = req.file;

    let nombreImagenGenerado = null;

    if (archivo) {
      // Generar nombre aleatorio con fecha y letras
      const fechaActual = new Date();
      const timestamp = fechaActual
        .toISOString()
        .replace(/[-T:.Z]/g, '')
        .slice(0, 17); // YYYYMMDDHHmmssSSS

      const letras = Array.from({ length: 3 }, () =>
        String.fromCharCode(97 + Math.floor(Math.random() * 26))
      ).join('');

      nombreImagenGenerado = `${timestamp}_grm${letras}.jpg`.toLowerCase();

      // Guardar imagen
      const destinoDir = path.join(__dirname, '..', 'public', 'images', 'incidencia');
      const destinoPath = path.join(destinoDir, nombreImagenGenerado);

      await fs.mkdir(destinoDir, { recursive: true });

      await sharp(archivo.buffer)
        .jpeg({ quality: 80 })
        .toFile(destinoPath);
    }

    // Crear nueva incidencia incluyendo la imagen si se subió
    const nueva = new Incidencia({
      titulo,
      motivo,
      acciones,
      fecha,
      alumno: id,
      docente: idpr,
      nombreImagen: nombreImagenGenerado // puede ser null si no se subió imagen
    });

    await nueva.save();
    res.json({ existe: 1 });
  } catch (error) {
    console.error('Error al guardar incidencia:', error);
    res.status(500).json({ existe: 0, error: 'Error del servidor' });
  }
};

exports.eliminarincidencia = async(req,res)=>{

  const {id} = req.body;
  await Incidencia.deleteOne({ _id: id });
   return res.json({existe:1});
}
exports.archivo = async(req,res)=>{
  const usuario = Docente.findOne({_id:req.session.idDocente});
 const alumno = await Alumno.find()
      .populate('apoderados') // trae los datos de los apoderados relacionados
      .lean(); // para que sea más rápido y compatible con la vista
  let incidencias =await Incidencia.find({estado:1,docente: req.session.idDocente }).populate('alumno').lean();
 incidencias = incidencias.map(inc => {
    if (inc.nombreImagen) {
      inc.imagenUrl = `/images/incidencia/${inc.nombreImagen}`;
    } else {
      inc.imagenUrl = '/images/default.jpg'; // imagen por defecto
    }
    return inc;
  });  
res.render('archivodocente',{usuario, incidencias });
}
exports.datosdocente = async (req, res) => {
  try {
    const usuario = await Docente.findOne({ _id: req.session.idDocente }).lean();

    if (!usuario) {
      return res.status(404).send('Docente no encontrado');
    }

    // Agregar URL de imagen
    usuario.imagenUrl = usuario.nombreImagen
      ? `/images/plantel/${usuario.nombreImagen}`
      : '/images/default.jpg';
    docente=usuario;    
    res.render('datosdocente', { docente });
  } catch (err) {
    console.error('Error al obtener datos del docente:', err);
    res.status(500).send('Error del servidor');
  }
};

exports.modifcardatosdocente = async (req, res) => {
  try {
      const id = req.session.idDocente;
    const { ci, nombre, descripcion, usuario, passwrd } = req.body;
    const archivo = req.file;

    const docente = await Docente.findById(id);
    console.log(docente);
    if (!docente) {
      return res.status(404).send('Docente no encontrado');
    }

    let nombreImagenActual = docente.nombreImagen;

    if (archivo) {
      // Si se subió una nueva imagen, genera un nuevo nombre
      const nuevoNombreImagen = `${ci}-${Date.now()}.jpg`.toLowerCase();
      const rutaDestino = path.join(__dirname, '..', 'public', 'images', 'plantel', nuevoNombreImagen);

      // Guardar la nueva imagen
      await fs.mkdir(path.dirname(rutaDestino), { recursive: true });
      await sharp(archivo.buffer)
        .jpeg({ quality: 80 })
        .toFile(rutaDestino);

      // Eliminar la imagen anterior si existe
      if (nombreImagenActual) {
        const rutaAnterior = path.join(__dirname, '..', 'public', 'images', 'plantel', nombreImagenActual);
        try {
          await fs.unlink(rutaAnterior);
        } catch (err) {
          console.warn('No se pudo eliminar la imagen anterior o no existe:', err.message);
        }
      }

      // Asignar el nuevo nombre
      nombreImagenActual = nuevoNombreImagen;
    }

    // Actualizar datos
    await Docente.findByIdAndUpdate(id, {
      ci,
      nombre,
      descripcion,
      usuario,
      passwrd,
      nombreImagen: nombreImagenActual
    });

    res.redirect('/datosdocente');
  } catch (error) {
    console.error('Error al modificar datos del docente:', error);
    res.status(500).send('Error al modificar datos.');
  }
};
/*AQUI APODERADO*/


exports.homeApoderado = async (req, res) => {
  try {
    const id = req.session.idApoderado;

    // Buscar apoderado y sus hijos
    const apoderado = await Apoderado.findById(id)
      .populate('hijos')
      .lean();

    if (!apoderado || !apoderado.hijos || apoderado.hijos.length === 0) {
      return res.render('homeapoderado', {
        apoderado,
        hijos: [],
        incidencias: []
      });
    }

    const idsHijos = apoderado.hijos.map(h => h._id);

    // Buscar incidencias de los hijos
   const incidencias = await Incidencia.find({
  alumno: { $in: idsHijos },
  estado: { $in: 0 } // si quieres ambos estados
    })
    .populate('alumno')
    .sort({ fecha: -1 }) // ← ordena por fecha descendente
    .lean();
    // Agregar imagenUrl si tiene nombreImagen
    const incidenciasConImagen = incidencias.map(i => {
      if (i.nombreImagen) {
        i.imagenUrl = `/images/incidencia/${i.nombreImagen}`;
      } else {
        i.imagenUrl = null;
      }
      return i;
    });
  ///////////////////////////////////
  const incidencias2 = await Incidencia.find({
  alumno: { $in: idsHijos },
  estado: { $in: 1 } // si quieres ambos estados
    })
    .populate('alumno')
    .sort({ fecha: -1 }) // ← ordena por fecha descendente
    .lean();
    // Agregar imagenUrl si tiene nombreImagen
    const incidenciasConImagen2 = incidencias2.map(i => {
      if (i.nombreImagen) {
        i.imagenUrl = `/images/incidencia/${i.nombreImagen}`;
      } else {
        i.imagenUrl = null;
      }
      return i;
    });
  //////////////////////////////////
    res.render('homeapoderado', {
      apoderado,
      hijos: apoderado.hijos,
      incidencias: incidenciasConImagen,
      incidencias2: incidenciasConImagen2
    });

  } catch (error) {
    console.error('Error al cargar homeApoderado:', error);
    res.status(500).send('Error en el servidor');
  }
};

exports.cambiarestadoincidencia = async (req, res) => {
  try {
    const { id } = req.body;

    const resultado = await Incidencia.updateOne(
      { _id: id },
      { $set: { estado: 1 } }
    );

    if (resultado.modifiedCount > 0) {
      return res.json({ existe: 1 });
    } else {
      return res.json({ existe: 0 });
    }
  } catch (error) {
    console.error('Error al cambiar estado de incidencia:', error);
    return res.status(500).json({ error: 'Error del servidor' });
  }
};

exports.datosapoderado = async(req,res)=>{
   const id = req.session.idApoderado;
   const apoderado = await Apoderado.findById(id).select('-hijos');
   res.render('datosapoderado', {apoderado});
}

exports.modificardatosapoderado = async (req, res) => {
  try {
    const id = req.session.idApoderado;

    const { ci, nombre, apellidos, usuario, passwrd } = req.body;
    console.log('Datos recibidos:', { ci, nombre, apellidos, usuario, passwrd });

    const result = await Apoderado.findByIdAndUpdate(id, {
      ci, nombre, apellidos, usuario, passwrd
    }, {
      new: true,
      runValidators: true
    });

    console.log('Resultado del update:', result);

    const apoderado = await Apoderado.findById(id).select('-hijos');
    res.render('datosapoderado', { apoderado });

  } catch (error) {
    console.error('Error al modificar datos del apoderado:', error);
    res.status(500).send('Error al modificar datos.');
  }
};

exports.cerrarsesion = async (req, res) => {
  req.session.destroy(async (err) => {
    if (err) {
      console.error('Error al cerrar sesión:', err);
      return res.status(500).send('Error al cerrar sesión');   }

    res.clearCookie('connect.sid');
    cargarDatosHome(res);
    
  });
};

async function cargarDatosHome(res) {
  const carouselPath = path.join(publicPath, 'images', 'carrusel');
  let carouselImages = [];
  let imageGridItems = [];
  let imageGridItemsNoticia = [];

  try {
    const files = await fs.readdir(carouselPath);
    carouselImages = files
      .filter(f => ['.jpg', '.jpeg', '.png', '.gif'].includes(path.extname(f).toLowerCase()))
      .map(f => `/images/carrusel/${f}`);

    const eventos = await Evento.find().lean();
    imageGridItems = eventos.map(ev => {
      const archivo = ev.nombreImagen?.trim() ? ev.nombreImagen : 'default.jpg';
      return {
        imagePath: `/images/eventos/${archivo}`,
        titulo: ev.titulo,
        description: ev.descripcion
      };
    });

    const noticias = await Noticia.find().lean();
    imageGridItemsNoticia = noticias.map(ev => {
      const archivo = ev.nombreImagen?.trim() ? ev.nombreImagen : 'default.jpg';
      return {
        imagePath: `/images/noticias/${archivo}`,
        titulo: ev.titulo,
        description: ev.descripcion
      };
    });

    // ✅ Renderiza la vista directamente desde esta función
    res.render('home', { carouselImages, imageGridItems, imageGridItemsNoticia });
  } catch (err) {
    console.error('❌ Error preparando datos para home:', err.message);
    res.status(500).send('Error al cargar la página principal');
  }
}

exports.verificarSesionAdmin = (req, res, next) => {
  if (req.session.idAdmin) {
    return next(); // Usuario autenticado, puede continuar
  }
  return res.redirect('/home'); // O responde con un código 401 si es una API
};