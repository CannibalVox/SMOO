import express = require('express');
import path = require('path');
import favicon = require('serve-favicon');
import logger = require('morgan');
import cookieParser = require('cookie-parser');
import bodyParser = require('body-parser');
import envConfig = require('./config/config');
import mongoose = require('mongoose');
import socketio = require('socket.io');

var routes : express.Router = require('./routes/index');

var config = envConfig.createEnvConfig();
var app: express.Express = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.disable('etag');

mongoose.set('debug', true);
mongoose.connect(config.getMongoConnection());

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(__dirname + '/public'));
app.use('/bower_components',  express.static(__dirname + '/bower_components'));

app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req : express.Request, res: express.Response, next: Function) {
  var err:any = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err : any, req: express.Request, res: express.Response, next: Function) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err : any, req: express.Request, res: express.Response, next: Function) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
