/**
 * Module dependencies.
 */

import express = require('express');
import debug = require('debug');
import http = require('http');
import smoonet = require('../lib/socket/smoonet');

var app: express.Express = require('../app');
var dbg: debug.Debugger = debug("smoo:server");

/**
 * Get port from environment and store in Express.
 */

var port:string = normalizePort(process.env.PORT || '3000');
app.set('port', port);

/**
 * Create HTTP server.
 */

var server: http.Server = http.createServer(app);

var smoo: smoonet.SmooNet = new smoonet.SmooNet(server);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val:string):string {
  var port: number = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port.toString();
  }

  return null;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error:any): void {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() :void {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  dbg('Listening on ' + bind);
}
