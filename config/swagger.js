var swagger = require('swagger-node-express'),
  express = require('express');

module.exports = function(app, config) {

  swagger.setAppHandler(app);
  var models = require('../swagger/models'),
    resources = require('../swagger/resources');

  swagger.addModels(models)
    .addGet(resources.classes.getAll)
    .addGet(resources.classes.getById)
    .addPost(resources.classes.post)
    .addPut(resources.classes.update)
    .addDelete(resources.classes.delete)
    .addGet(resources.users.getById)
    .addGet(resources.users.getClasses)
    .addPost(resources.users.post)
    .addPut(resources.users.update)
    .addDelete(resources.users.delete)
    .addDelete(resources.users.deleteClasses);

  swagger.configureDeclaration('classes', {
    description: 'Operations about classes',
    authorizations: ['oauth2'],
    protocols: ['http'],
    consumes: ['application/json'],
    produces: ['application/json']
  });

  swagger.configureDeclaration('users', {
    description: 'Operations about users',
    authorizations: ['oauth2'],
    protocols: ['http'],
    consumes: ['application/json'],
    produces: ['application/json']
  });

  swagger.setApiInfo({
    title: 'GOOP Node.js REST API',
    description: 'Create reusable javascript classes',
    termsOfServiceUrl: 'http://goop.herokuapp.com/terms/',
    contact: 'goop.support@gmail.com',
    license: 'MIT'
  });

  var url = 'http://goop.herokuapp.com';
  if (config.port === 3000 || config.port === 5000)
    url = 'http://localhost:' + config.port;


  // Configures the app's base path and api version.
  swagger.configureSwaggerPaths('', '/api/v0', '');
  swagger.configure(url, '0.0.1');

  var docs_handler = express.static(config.root +
    '/public/components/swagger-ui/dist');
  app.get(/^\/docs(\/.*)?$/, function(req, res, next) {
    if (req.url === '/docs') { // express static barfs on root url w/o trailing slash
      res.writeHead(302, {
        'Location': req.url + '/'
      });
      res.end();
      return;
    }
    // take off leading /docs so that connect locates file correctly
    req.url = req.url.substr('/docs'.length);
    return docs_handler(req, res, next);
  });

}