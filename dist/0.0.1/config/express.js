var express = require('express'),
  compress = require('compression'),
  morgan = require('morgan'),
  bodyParser = require('body-parser'),
  methodOverride = require('method-override'),
  favicon = require('serve-favicon'),
  cors = require('cors'),
  // flash = require('connect-flash'),
  env = process.env.NODE_ENV || 'development';

module.exports = function(app, config, passport) {

  app.use(cors());

  app.set('showStackError', true);

  app.use(compress({
    filter: function(req, res) {
      return /json|text|javascript|css/.test(res.getHeader(
        'Content-Type'));
    },
    level: 9
  }));

  app.use(express.static(config.root + '/public'));

  app.set('views', config.root + '/app/views');
  app.set('view engine', 'jade');

  app.use(favicon(config.root + '/public/img/favicon.ico'));

  //if(env == 'development')
    //app.use(morgan('dev'));

  app.use(bodyParser());
  app.use(methodOverride());

  app.use(passport.initialize());

  // app.use(flash());

  if (env === 'development') {
    app.locals.pretty = true;
  }
};