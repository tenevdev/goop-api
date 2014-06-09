var path = require('path'),
  rootPath = path.normalize(__dirname + '/..'),
  env = process.env.NODE_ENV || 'development',
  productionDbPath = process.env.MONGOLAB_URI || 'mongodb://localhost/goop-production';

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
    db: productionDbPath
  }
};

// Expose configuration for the current environment
module.exports = config[env];