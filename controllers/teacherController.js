import Teacher from '../models/Teacher.js';

export const form = (_, res) => res.render('teachers/form', { teacher: {} });

export const create = async (req, res) => {
  try {
    await Teacher.create(req.body);
    req.flash('success','Profesor guardado');
    res.redirect('/teachers');
  } catch (err) {
    req.flash('error','Error al guardar');
    res.redirect('/teachers/new');
  }
};

export const index = async (_, res) => {
  const teachers = await Teacher.find();
  res.render('teachers/index', { teachers });
};
