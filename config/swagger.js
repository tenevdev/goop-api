var swagger = require('swagger-node-express'),
  cors = require('cors'),
  express = require('express');

module.exports = function(app) {

  var corsOptions = {
    credentials: true,
    origin: function(origin, callback) {
      if (origin === undefined) {
        callback(null, false);
      } else {
        // change wordnik.com to your allowed domain.
        var match = origin.match('/^(.*)?localhost(:[0-9]+)?/');
        var allowed = (match !== null && match.length > 0);
        callback(null, allowed);
      }
    }
  };

  app.use(cors(corsOptions));

  swagger.setAppHandler(app);
  var models = require('../swagger/models'),
    resources = require('../swagger/resources');

  swagger.addModels(models)
    .addGet(resources.classes.getAll)
    .addGet(resources.classes.getById)
    .addPost(resources.classes.post)
    .addPut(resources.classes.update)
    .addDelete(resources.classes.delete)
    .addGet(resources.users.getById);

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

  // Configures the app's base path and api version.
  swagger.configureSwaggerPaths('', '/api/v0', '');
  swagger.configure('http://localhost:3000', '0.0.1');

  var docs_handler = express.static(__dirname + '/../public/components/swagger-ui/');
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