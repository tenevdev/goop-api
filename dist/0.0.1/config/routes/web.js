module.exports = function(app) {

  var express = require('express'),
  router = express.Router();

  // Views router

  var home = require('../../app/controllers/web/home');
  
  router.route('/').get(home.index);
  router.route('/home').get(home.index);

  app.use('/', router);
};