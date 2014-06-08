var path = require('path'),
  rootPath = path.normalize(__dirname + '/..'),
  env = process.env.NODE_ENV || 'development';

var config = {
  development: {
    root: rootPath,
    app: {
      name: 'goop'
    },
    port: 3000,
    db: 'mongodb://localhost/goop-development'
  },

  test: {
    root: rootPath,
    app: {
      name: 'goop'
    },
    port: 3000,
    db: 'mongodb://localhost/goop-test'
  },

  production: {
    root: rootPath,
    app: {
      name: 'goop'
    },
    port: 3000,
    db: 'mongodb://localhost/goop-production'
  }
};

// Expose configuration for the current environment
module.exports = config[env];