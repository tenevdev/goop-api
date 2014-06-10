var mongoose = require('mongoose');

exports.index = function(req, res) {
  res.render('home/index', {
    title: 'Goop Web API'
  });
};