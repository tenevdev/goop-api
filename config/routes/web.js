module.exports = function(app) {

  var express = require('express'),
    router = express.Router();

  // Views router

  var home = require('../../app/controllers/web/home'),
    docs = require('../../app/controllers/web/api-docs');

  router.route('/').get(home.index);
  router.route('/home').get(home.index);

  router.route('/docs')
    .get(docs.index);

  app.use('/', router);
};