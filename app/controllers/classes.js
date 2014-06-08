var mongoose = require('mongoose'),
  Class = mongoose.model('Class');
// Helpers

function getFilterFromQuery(queryObject) {
  var filterCriteria = {};
  for (var key in queryObject) {
    if (queryObject.hasOwnProperty(key)) {
      if (key === 'name' || key === 'author' || key === 'inherits') {
        filterCriteria[key] = queryObject[key];
      }
    }
  }

  return filterCriteria;
}

// GET

// Get all classes
exports.getAll = function(req, res, next) {
  var options = {
    filter: {},
    limit: req.query.limit || 10,
    offset: req.query.offset || 0
  };

  options.filter = getFilterFromQuery(req.query);

  Class.getAll(options, function(err, data) {
    if (err) {
      res.json(500, err);
      return next(err);
    }
    res.json(200, data);
  });
};

// Get the class with the given id
exports.getById = function(req, res, next) {
  // Called after load
  if (req.class)
    res.json(200, req.class);
  next();
};

// Load the class with the given id into the request
exports.load = function(req, res, next, id) {
  //var User = mongoose.model('User');

  // Data is populated with author.name and inherits.name
  Class.getById(id, function(err, data) {
    if (err) {
      res.json(500, err);
      next(err);
    } else if (data) {
      req.class = data;
      next();
    } else {
      res.json(404, 'Resource not found');
      next(new Error('Resource not found'));
    }

  });
};

// POST

exports.post = function(req, res) {
  var classDoc = new Class(req.body);
  if(req.user)
    classDoc.author = req.user.id;

  classDoc.save(function(err, data) {
    if (err) {
      res.json(500, err);
      return err;
    }
    // Set location header
    res.location('class/' + data.id);
    res.json(201, data);
  });
};

// DELETE

exports.deleteAll = function(req, res) {
  // Remove all classes
  Class.remove({}, function(err) {
    if (err) {
      res.json(500, err);
    }
    res.json(200, {
      message: 'Removed all classes'
    });
  });
};

exports.delete = function(req, res) {
  
  req.class.remove(function(err) {
    if (err) {
      res.json(500, err);
      return err;
    }
    res.json(200, {
      message: 'The resource has been removed'
    });
  });

  // Class.findByIdAndRemove(req.class.id, function(err) {
  //   if (err) {
  //     res.json(500, err);
  //     return err;
  //   }
  //   res.json(200, {
  //     message: 'The resource has been removed'
  //   });
  // });

};

// PUT
exports.update = function(req, res, next) {
   Class.findByIdAndUpdate(req.params.classId, req.body.class, {select: '-__v'}, function(err, data) {
    if (err) {
      res.json(500, err);
      next(err);
    } else {
      res.json(200, data);
      next();
    }
  });
};