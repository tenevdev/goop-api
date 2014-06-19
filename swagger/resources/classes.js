var sw = require('swagger-node-express');
var param = require('../../node_modules/swagger-node-express/lib/paramTypes.js');
var url = require('url');
var swe = sw.errors;

var dataProvider = require('../services');

// the description will be picked up in the resource listing
exports.getById = {
  spec: {
    description: 'Operations about classes',
    path: '/classes/{classId}',
    method: 'GET',
    summary: 'Find class by ID',
    notes: 'Returns a class based on ID',
    type: 'Class',
    nickname: 'getById',
    produces: ['application/json'],
    parameters: [param.path('classId', 'ID of class that needs to be fetched',
      'string')],
    responseMessages: [swe.invalid('classId'), swe.notFound('class')]
  },
  action: function(req, res) {
    if (!req.params.classId) {
      throw swe.invalid('classId');
    }
    var id = parseInt(req.params.classId);
    var classObj = dataProvider.classes.getById(id);

    if (classObj) res.send(JSON.stringify(classObj));
    else throw swe.notFound('class', res);
  }
};

exports.getAll = {
  'spec': {
    description: 'Operations about classes',
    path: '/classes',
    method: 'GET',
    summary: 'Get all classes',
    notes: 'Returns all classes',
    type: 'Class',
    nickname: 'getAll',
    produces: ['application/json'],
    parameters: [
      param.query('limit', 'The maximum number of classes to take', 'number',
        false, null, 10),
      param.query('offset', 'The number of classes to skip', 'number',
        false, null, 0),
      param.query('name', 'Filter classes by name', 'string',
        false),
      param.query('author', 'Filter classes by author ID', 'string',
        false),
      param.query('inherits', 'Filter classes by parent ID', 'string',
        false)
    ]
  },
  'action': function(req, res) {
    var classes = dataProvider.classes.getAll();
    res.send(JSON.stringify(classes));
  }
};

// exports.findByStatus = {
//   'spec': {
//     path: '/pet/findByStatus',
//     notes: 'Multiple status values can be provided with comma-separated strings',
//     summary: 'Find pets by status',
//     method: 'GET',
//     parameters: [
//       param.query('status', 'Status in the store', 'string', true, ['available',
//         'pending', 'sold'
//       ], 'available')
//     ],
//     type: 'array',
//     items: {
//       $ref: 'Pet'
//     },
//     responseMessages: [swe.invalid('status')],
//     nickname: 'findPetsByStatus'
//   },
//   'action': function(req, res) {
//     var statusString = url.parse(req.url, true).query.status;
//     if (!statusString) {
//       throw swe.invalid('status');
//     }

//     var output = dataProvider.classes.findPetByStatus(statusString);
//     res.send(JSON.stringify(output));
//   }
// };

// exports.findByTags = {
//   'spec': {
//     path: '/pet/findByTags',
//     notes: 'Multiple tags can be provided with comma-separated strings. Use tag1, tag2, tag3 for testing.',
//     summary: 'Find pets by tags',
//     method: 'GET',
//     parameters: [param.query('tags', 'Tags to filter by', 'string', true)],
//     type: 'array',
//     items: {
//       $ref: 'Pet'
//     },
//     responseMessages: [swe.invalid('tag')],
//     nickname: 'findPetsByTags'
//   },
//   'action': function(req, res) {
//     var tagsString = url.parse(req.url, true).query.tags;
//     if (!tagsString) {
//       throw swe.invalid('tag');
//     }
//     var data = dataProvider.classes.findPetByTags(tagsString);
//     sw.setHeaders(res);
//     res.send(JSON.stringify(data));
//   }
// };

exports.post = {
  'spec': {
    path: '/classes',
    notes: 'adds a class to the store',
    summary: 'Add a new class',
    method: 'POST',
    parameters: [
      param.body('class', 'Class object that needs to be added', 'Class'),
      param.body('user',
        'User object with required email and password properties',
        'User'),
    ],
    responseMessages: [swe.invalid('name'), swe.invalid('user')],
    nickname: 'post'
  },
  'action': function(req, res) {
    var classObj = req.body.class;
    if (req.body.user)
      classObj.author = dataProvider.users.getByEmail(req.body.user).id;

    if (!classObj || !classObj.name) {
      throw swe.invalid('name');
    } else if (!classObj.author) {
      throw swe.invalid('user');
    } else {
      dataProvider.classes.post(classObj);
      res.send(200);
    }
  }
};

exports.update = {
  spec: {
    path: '/classes/{classId}',
    notes: 'updates a class in the store',
    method: 'PUT',
    summary: 'Update an existing class',
    parameters: [
      param.body('class', 'Class object that needs to be updated', 'Class'),
      param.body('user',
        'User object with email and password properties that is the owner of this class',
        'User'),
    ],
    responseMessages: [swe.invalid('classId'), swe.invalid('class')],
  nickname: 'update'
},
action: function(req, res) {
  var user = dataProvider.users.getByEmail(req.body.user);
  if (!req.body.class.name) {
    throw swe.invalid('class');
  } else if (user && user.id === req.class.author) {
    dataProvider.classes.update(req.body.class);
    res.send(200);
  } else {
    res.send(400);
  }
}
};

exports.delete = {
  'spec': {
    path: '/classes/{classId}',
    notes: 'removes a class from the store',
    method: 'DELETE',
    summary: 'Remove an existing class',
    parameters: [param.path('classId', 'ID of class that needs to be removed',
      'string')],
    responseMessages: [swe.invalid('classId'), swe.notFound('class')],
    nickname: 'delete'
  },
  'action': function(req, res) {
    var id = parseInt(req.params.classId);
    dataProvider.classes.deleteById(id);
    res.send(204);
  }
};