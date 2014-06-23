var express = require('express'),
  mongoose = require('mongoose'),
  fs = require('fs'),
  config = require('./config/config'),
  passport = require('passport');

var connect = function() {
  var options = {
    server: {
      socketOptions: {
        keepAlive: 1
      }
    }
  };

  mongoose.connect(config.db, options);
};

// Connect to database
connect();

// Handle connection errors
mongoose.connection.on('error', function() {
  throw new Error('unable to connect to database at ' + config.db);
});

// Reconnect when disconnected
mongoose.connection.on('disconnected', function() {
  connect();
});

// Require all models
var modelsPath = __dirname + '/app/models';
fs.readdirSync(modelsPath).forEach(function(file) {
  if (file.indexOf('.js') >= 0) {
    require(modelsPath + '/' + file);
  }
});

// Configure passport
require('./config/passport')(passport, config);

var app = express();

// Configure express middleware before routes
require('./config/express')(app, config, passport);

// Configure routes
require('./config/routes/web')(app);
require('./config/routes/api')(app, passport);

//Configure swagger
require('./config/swagger')(app, config);

// Handle not found on application level (maybe should go inside routes)
app.use(function(req, res) {
  res.status(404).render('404', {
    title: '404'
  });
});

// Port on localhost is 3000
var port = process.env.PORT || 3000;

// Start the application
app.listen(port);

// Expose application
exports = module.exports = app;