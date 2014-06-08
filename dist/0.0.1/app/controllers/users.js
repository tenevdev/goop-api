var mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Class = mongoose.model('Class');

// Helpers
function getUserFilterFromQuery(queryObject) {
  var filterCriteria = {};
  for (var key in queryObject) {
    if (queryObject.hasOwnProperty(key)) {
      if (key === 'name' || key === 'email') {
        filterCriteria[key] = queryObject[key];
      }
    }
  }

  return filterCriteria;
}

function getClassFilterFromQuery(queryObject) {
  var filterCriteria = {};
  for (var key in queryObject) {
    if (queryObject.hasOwnProperty(key)) {
      if (key === 'name' || key === 'inherits') {
        filterCriteria[key] = queryObject[key];
      }
    }
  }

  return filterCriteria;
}

// GET

// Load the user with the given id into the request
// Used when a userId parameter is passed to the url
exports.load = function(req, res, next, id) {
  if (req.method !== 'PUT') {
    User.getById(id, function(err, data) {
      if (err) {
        res.json(500, err);
        next(err);
      } else if (data) {
        req.user = data;
        next();
      } else {
        res.json(404, 'Resource not found');
        next(new Error('Resource not found'));
      }
    });
  }
  else{
    next();
  }
};

// Send the user as a response
// Runs after a load which injects the user into the request
exports.getById = function(req, res, next) {
  if (req.user) {
    res.json(200, req.user);
    next();
  }
};

// Get all users (maybe should be limited)
exports.getAll = function(req, res, next) {
  // Options object to pass to the model
  var options = {
    filter: {},
    limit: req.query.limit || 10,
    offset: req.query.offset || 0
  };

  // Extract filter from the query for partial response
  options.filter = getUserFilterFromQuery(req.query);

  // Get all users matching the given options
  User.getAll(options, function(err, data) {
    if (err) {
      res.json(500, err);
      return next(err);
    } else if (data) {
      res.json(200, data);
      next();
    } else {
      res.json(404, {
        message: 'Resource not found'
      });
      next();
    }
  });
};

// Get classes for a user
// Runs after a load which injects the user into the request
exports.getClasses = function(req, res, next) {
  var options = {
    filter: {},
    limit: req.query.limit || 10,
    offset: req.query.offset || 0
  };

  options.filter = getClassFilterFromQuery(req.query);

  // Get classes matching the user id and other options
  Class.getByUserId(options, req.user.id, function(err, data) {
    if (err) {
      res.json(500, err);
      next(err);
    } else if (data) {
      res.json(200, data);
      next();
    } else {
      res.json(404, {
        message: 'Resource not found'
      });
      next();
    }
  });
};

// POST

// Create a new user from the request
// The request is coming from the client and nothing is injected
exports.post = function(req, res, next) {
  var userDoc = new User(req.body);

  userDoc.save(function(err, data) {
    if (err) {
      res.json(500, err);
      next(err);
    } else {
      // Set location header
      res.location('user/' + data.id);
      // Send HTTP 201 Created
      res.json(201, data);
    }
  });
};

// DELETE

// Delete a user
// Runs after a load which injects the user into the request
exports.delete = function(req, res, next) {

  req.user.remove(function(err){
    if (err) {
      res.json(500, err);
      next(err);
    } else {
      res.json(200, {
        message: 'Removed succesfully'
      });
      next();
    }
  });

  // User.findByIdAndRemove(req.user.id, function(err) {
  //   if (err) {
  //     res.json(500, err);
  //     next(err);
  //   } else {
  //     res.json(200, {
  //       message: 'Removed succesfully'
  //     });
  //   }
  // });

};

// Delete all classes for a given user
// Runs after a load which injects the user into the request
exports.deleteClasses = function(req, res, next) {

  Class.find({author: req.user.id}).remove(function(err) {
    if (err) {
      res.json(500, err);
      next(err);
    } else {
      res.json(200, {
        message: 'Classes for user ' + req.user.name + 'have been removed'
      });
      next();
    }
  });
};

// PUT

// Update a user (maybe should be limited)
// The request is coming from the client and nothing is injected
exports.update = function(req, res, next) {
  User.findByIdAndUpdate(req.params.userId, req.body, {select: '-__v'}, function(err, data) {
    if (err) {
      res.json(500, err);
      next(err);
    } else {
      res.json(200, data);
      next();
    }
  });
};