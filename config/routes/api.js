module.exports = function(app, passport) {

  var apiVersion = 1,
    router = require('express').Router(),
    apiPath = '/api/v' + apiVersion,
    classes = require('../app/controllers/api/classes'),
    users = require('../app/controllers/api/users'),
    authorize = require('./routes_middleware/authorize');

  // Auth
  var classAuth = [authorize.class.isAuthorized];

  // API

  // Middleware for all requests

  // Check request for API key every time to make the API internal
  router.use(function(req, res, next) {

    // Check API key here
    if (authorize.API.key(req.body.apiKey) || authorize.API.key(req.query.apiKey)) {
      // Give access
      req.isAdmin = true;
    }

    next();
  });

  // Class routes

  router.param('classId', classes.load);

  router.route('/classes')
    .get(classes.getAll)
    .post(authorize.requiresLogin, classes.post)
    .delete(authorize.user.isAuthorizedAdministrator, classes.deleteAll);

  router.route('/classes/:classId')
    .get(classes.getById)
    .delete(passport.authenticate('local', {
      session: false
    }), classAuth, classes.delete)
    .put(passport.authenticate('local', {
      session: false
    }), classAuth, classes.update);

  //User routes

  router.param('userId', users.load);

  router.route('/users/:userId')
    .get(users.getById)
    .delete(passport.authenticate('local', {
      session: false
    }), authorize.user.isAuthorized, users.delete)
    .put(
      passport.authenticate('local', {
        session: false
      }), users.update);

  router.route('/users/:userId/classes')
    .get(users.getClasses)
    .delete(passport.authenticate('local', {session: false}), authorize.user.isAuthorized, users.deleteClasses);

  router.route('/users')
    .get(authorize.user.isAuthorizedAdministrator, users.getAll)
    .post(users.post);

  // Prepend the api path to all routes
  app.use(apiPath, router);
};