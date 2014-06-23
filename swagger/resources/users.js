var sw = require('swagger-node-express'),
  param = require('../../node_modules/swagger-node-express/lib/paramTypes.js'),
  url = require('url'),
  swe = sw.errors;

var dataProvider = require('../services');

exports.getById = {
  spec: {
    description: 'Operations about classes',
    path: '/users/{userId}',
    method: 'GET',
    summary: 'Find user by ID',
    notes: 'Returns a user based on ID',
    type: 'User',
    nickname: 'getById',
    produces: ['application/json'],
    parameters: [param.path('userId', 'ID of user that needs to be fetched',
      'number')],
    responseMessages: [swe.invalid('userId'), swe.notFound('user')]
  },
  action: function(req, res) {
    if (!req.params.userId) {
      throw swe.invalid('userId', res);
    }
    var id = parseInt(req.params.userId);
    var user = dataProvider.users.getById(id);

    if (user) res.send(JSON.stringify(user));
    else throw swe.notFound('user', res);
  }
};

exports.post = {
  spec: {
    path: '/users',
    notes: 'adds a user',
    summary: 'Add a new user',
    method: 'POST',
    parameters: [
      param.body('user',
        'User object with email and password required properties that needs to be added',
        'User')
    ],
    responseMessages: [swe.invalid('email'), swe.invalid('user')],
    nickname: 'post'
  },
  action: function(req, res) {
    if (req.body.user) {
      var userObj = req.body.user;
      if (dataProvider.users.getByEmail(userObj))
        throw swe.invalid('email');
      else if (userObj && userObj.password) {
        dataProvider.users.post(userObj);
        res.send(201);
      } else {
        throw swe.invalid('user', res);
      }
    } else {
      throw swe.invalid('user', res);
    }
  }
};

exports.update = {
  spec: {
    path: '/users/{userId}',
    notes: 'updates a user',
    method: 'PUT',
    summary: 'Update an existing user',
    parameters: [
      param.path('userId', 'ID of user that needs to be updated', 'number'),
      param.body('user', 'User object to be updated', 'User'),
    ],
    responseMessages: [swe.invalid('userId'), swe.notFound('user'), swe.invalid(
      'user')],
    nickname: 'update'
  },
  action: function(req, res) {
    if (req.body.user && req.params.userId) {
      var user = req.body.user;
      user.id = parseInt(req.params.userId, 10);
      if (dataProvider.users.update(user))
        res.send(200);
      else {
        throw swe.notFound('user', res);
      }
    } else if (req.params.userId) {

      throw swe.invalid('user', res);
    } else {
      throw swe.invalid('userId', res);
    }
  }
};

exports.delete = {
  spec: {
    path: '/users/{userId}',
    notes: 'removes a user',
    method: 'DELETE',
    summary: 'Remove an existing user',
    parameters: [param.path('userId', 'ID of user that needs to be removed',
      'number')],
    responseMessages: [swe.invalid('userId'), swe.notFound('user')],
    nickname: 'delete'
  },
  action: function(req, res) {
    if (req.params.userId) {
      var id = parseInt(req.params.classId, 10);
      if (dataProvider.users.delete(id))
        res.send(204);
      else
        throw swe.notFound('user');
    } else {
      throw swe.invalid('userId', res);
    }
  }
};

exports.deleteClasses = {
  spec: {
    path: '/users/{userId}/classes',
    notes: 'removes all classes for a user',
    method: 'DELETE',
    summary: 'Remove all classes for an existing user',
    parameters: [param.path('userId',
      'ID of user whose classes should be removed',
      'number')],
    responseMessages: [swe.invalid('userId'), swe.notFound('user')],
    nickname: 'deleteClasses'
  },
  action: function(req, res) {
    if (req.params.userId) {
      var id = parseInt(req.params.classId, 10);
      if (dataProvider.users.deleteClasses(id))
        res.send(204);
      else
        throw swe.notFound('user');
    } else {
      throw swe.invalid('userId', res);
    }
  }
};

exports.getClasses = {
  spec: {
    path: '/users/{userId}/classes',
    notes: 'alternative for /classes?author=userId',
    method: 'GET',
    summary: 'Return all classes for an existing user',
    parameters: [param.path('userId',
      'ID of user whose classes should be fetched',
      'number')],
    responseMessages: [swe.invalid('userId'), swe.notFound('user')],
    nickname: 'getClasses'
  },
  action: function(req, res) {
    if (req.params.userId) {
      var id = parseInt(req.params.classId, 10);
      var classes = dataProvider.users.getClasses(id);
      if (classes)
        res.send(JSON.stringify(classes));
      else
        throw swe.notFound('user');
    } else {
      throw swe.invalid('userId', res);
    }
  }
};