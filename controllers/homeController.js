const User = require('../models/User');
exports.home = (req, res) => {
    res.render('home', { title: 'Página de Inicio' });  
};
