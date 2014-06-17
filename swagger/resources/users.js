var sw = require('swagger-node-express'),
  param = require('../../node_modules/swagger-node-express/lib/paramTypes.js'),
  url = require('url'),
  swe = sw.errors;

var dataProvider = require('../services').users;

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
      'string')],
    responseMessages: [swe.invalid('userId'), swe.notFound('user')]
  },
  action: function(req, res) {
    if (!req.params.userId) {
      throw swe.invalid('userId');
    }
    var id = parseInt(req.params.userId);
    var user = dataProvider.getById(id);

    if (user) res.send(JSON.stringify(user));
    else throw swe.notFound('user', res);
  }
};

// exports.getAll = {
//   'spec': {
//     description: 'Operations about classes',
//     path: '/classes',
//     method: 'GET',
//     summary: 'Get all classes',
//     notes: 'Returns all classes',
//     type: 'Class',
//     nickname: 'getAll',
//     produces: ['application/json'],
//     parameters: [
//       param.query('limit', 'The maximum number of classes to take', 'number',
//         false, null, 10),
//       param.query('offset', 'The number of classes to skip', 'number',
//         false, null, 0),
//       param.query('name', 'Filter classes by name', 'string',
//         false),
//       param.query('author', 'Filter classes by author ID', 'string',
//         false),
//       param.query('inherits', 'Filter classes by parent ID', 'string',
//         false)
//     ]
//   },
//   'action': function(req, res) {
//     var classes = dataProvider.getAll();
//     res.send(JSON.stringify(classes));
//   }
// };

// exports.post = {
//   'spec': {
//     path: '/classes',
//     notes: 'adds a class to the store',
//     summary: 'Add a new class',
//     method: 'POST',
//     parameters: [
//       param.body('class', 'Class object that needs to be added', 'Class'),
//       param.body('author',
//         'Author ID if not present in class object declaration', 'string'),
//     ],
//     responseMessages: [swe.invalid('name'), swe.invalid('author')],
//     nickname: 'post'
//   },
//   'action': function(req, res) {
//     var classObj = req.body.class || req.body;
//     if (req.body.author)
//       classObj.author = author;

//     if (!classObj || !classObj.name) {
//       throw swe.invalid('name');
//     } else if (!classObj.author) {
//       throw swe.invalid('author');
//     } else {
//       dataProvider.post(body);
//       res.send(200);
//     }
//   }
// };

// exports.update = {
//   spec: {
//     path: '/classes/{classId}',
//     notes: 'updates a class in the store',
//     method: 'PUT',
//     summary: 'Update an existing class',
//     parameters: [
//       param.body('class', 'Class object that needs to be updated', 'Class'),
//       param.body('user', 'User object that is the owner of this class', 'User'),
//     ],
//     responseMessages: [swe.invalid('classId'), swe.notFound('class'), swe.invalid(
//       'input')],
//     nickname: 'update'
//   },
//   action: function(req, res) {
//     var body = req.body;
//     if (!body || !body.name) {
//       throw swe.invalid('class');
//     } else {
//       dataProvider.update(body);
//       res.send(200);
//     }
//   }
// };

// exports.delete = {
//   'spec': {
//     path: '/classes/{classId}',
//     notes: 'removes a class from the store',
//     method: 'DELETE',
//     summary: 'Remove an existing class',
//     parameters: [param.path('classId', 'ID of class that needs to be removed',
//       'string')],
//     responseMessages: [swe.invalid('classId'), swe.notFound('class')],
//     nickname: 'delete'
//   },
//   'action': function(req, res) {
//     var id = parseInt(req.params.classId);
//     dataProvider.deleteById(id);
//     res.send(204);
//   }
// };