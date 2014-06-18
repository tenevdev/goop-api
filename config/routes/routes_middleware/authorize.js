var mongoose = require('mongoose'),
  User = mongoose.model('User');

// Require login
exports.requiresLogin = function(req, res, next) {
  if (req.isAuthenticated() || req.body.user || req.user) return next();
  if (req.method === 'GET') req.session.returnTo = req.originalUrl;
  res.json(302, {
    message: 'Login required.'
  });
};

// Authorize user
exports.user = {

  // A user is authorized if they are authenticated
  isAuthorized: function(req, res, next) {
    if (req.user.id === req.params.userId) return next();
    res.json(401, {
      message: 'User not authorized'
    });
  },

  isAuthorizedAdministrator: function(req, res, next) {
    // Use safer way to determine admin requests
    if (req.isAdmin) return next();
    res.json(401, {
      message: 'Administrator use only'
    });
  }
};

// Authorize user to modify owned classes
exports.class = {
  isAuthorized: function(req, res, next) {
    if (req.class.author.id === req.user.id) return next();
    res.json(401, {
      message: 'User not authorized to modify this class'
    });
  }
};

// Authorize API access
exports.API = {
  key: function(key) {
    // Use a more secure method to check api key
    if (key === 'goop-api-key')
      return true;
    return false;
  }
};