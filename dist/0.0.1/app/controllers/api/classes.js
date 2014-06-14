var mongoose = require('mongoose'),
  Class = mongoose.model('Class');

// Helpers

/**
 * @method getFilterFromQuery
 * @private
 * @param {Object} queryObject - Usually a request query
 * @return {Object} - A filter object
 */
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

/**
 * Get all classes.
 *
 * @method getAll
 * @param {Request} req - Express request
 * @param {Number} [req.query.limit=10] - The maximum number of classes to take
 * @param {Number} [req.queryoffset=0] - The number of classes to skip before taking
 * @param {String} [req.queryname] - Filter classes by name
 * @param {String} [req.query.author] - Filter classes by author id
 * @param {String} [req.query.inherits] - Filter classes by parent id
 * @param {Object} res - Express response
 * @param {Function} next
 */
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

/**
 * Get the class with the given id
 *
 * @method getById
 * @param {Object} req - Express request
 * @param {Object} req.class - The class to be returned
 * @param {Object} res - Express response
 * @param {Function} next
 */
exports.getById = function(req, res, next) {
  // Called after load
  if (req.class)
    res.json(200, req.class);
  next();
};

/**
 * Load the class with the given id into the request
 *
 * @method load
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 * @param {Function} next
 * @param {String} id - Class id
 */
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

/**
 * Create a new class
 *
 * @method post
 * @param {Object} req - Express request
 * @param {Object} req.body.class - The class to be created
 * @param {Object} [req.body.user] - The user who creates this class
 * @param {Object} res - Express response
 */
exports.post = function(req, res) {
  var classDoc = new Class(req.body.class);
  if (req.user)
    classDoc.author = req.body.user.id;

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

/**
 * Delete all classes
 *
 * @method deleteAll
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 */
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

/**
 * Delete a class
 *
 * @method delete
 * @param {Object} req - Express request
 * @param {Object} req.class - The class to be deleted
 * @param {Object} res - Express response
 */
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

/**
 * Update a class
 *
 * @method update
 * @param {Object} req - Express request
 * @param {Object} req.body.class - The updated class object
 * @param {Object} req.params.classId - The id of the class to be updated
 * @param {Object} res - Express response
 * @param {Function} next
 */
exports.update = function(req, res, next) {
  Class.findByIdAndUpdate(req.params.classId, req.body.class, {
    select: '-__v'
  }, function(err, data) {
    if (err) {
      res.json(500, err);
      next(err);
    } else {
      res.json(200, data);
      next();
    }
  });
};