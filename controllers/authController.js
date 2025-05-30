import User from '../models/User.js';

export const loginForm = (_, res) => res.render('auth/login');

export const login = async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user || !(await user.comparePassword(password))) {
    req.flash('error', 'Credenciales inválidas');
    return res.redirect('/auth/login');
  }
  req.session.user = { id: user._id, role: user.role, username: user.username };
  res.redirect('/');
};

export const logout = (req, res) => {
  req.session.destroy(()=> res.redirect('/auth/login'));
};
