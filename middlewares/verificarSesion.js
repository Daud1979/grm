exports.verificarAdmin = (req, res, next) => {
  if (req.session.idAdmin && req.session.Tipo === 'administrador') {
    return next();
  }
  return res.redirect('/'); // o res.status(403).send('No autorizado');
};

exports.verificarDocente = (req, res, next) => {
  if (req.session.idDocente && req.session.Tipo === 'docente') {
    return next();
  }
  return res.redirect('/');
};

exports.verificarApoderado = (req, res, next) => {
  if (req.session.idApoderado && req.session.Tipo === 'tutor') {
    return next();
  }
  return res.redirect('/');
};
