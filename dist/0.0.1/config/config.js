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
    db: 'mongodb://heroku_app26159087:4o635kch5gsb4bnj0r3dj4qs3g@ds043348.mongolab.com:43348/heroku_app26159087'
  }
};

// Expose configuration for the current environment
module.exports = config[env];