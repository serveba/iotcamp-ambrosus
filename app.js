// for measuring bootstrapping time
const init = (new Date()).getTime();

/**
 *  MODULE DEPENDENCIES
 * -----------------------------------------------------------------------------
 **/
const http          = require('http');
const express       = require('express');
const path          = require('path');
const cookieParser  = require('cookie-parser');
const bodyParser    = require('body-parser');
const cons          = require('consolidate');
const fs            = require('fs');

const settings    = require('./config/settings');
const logger      = require('./helpers/loggerhelper');
const routes = require('./routes/index');
const port = 3333;

const app = express();

app.set('port', port);
app.set('views', path.join(__dirname, 'views'));
app.engine('dust', cons.dust);
app.set('view engine', 'dust');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


fs.readFile('./config/banner.txt', 'utf8', function (err,data) {
  if (err) {
    return console.log(err);
  }

  logger.info(`>> START UP TIME: ${((new Date()).getTime() - init)} ms`);
  console.log(data);
});

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/**/
app.use('/', routes);


/**
 * ERROR MANAGEMENT
 * ------------------------------------------------------------------------------
 * error management
 * implement good error handling: this below is not optimal // -mm
 **/
function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = (typeof port === 'string') ? 'Pipe ' + port : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
  case 'EACCES':
    console.error(bind + ' requires elevated privileges');
    //process.exit(1);
    break;
  case 'EADDRINUSE':
    console.error(bind + ' is already in use');
    //process.exit(1);
    break;
  default:
    throw error;
  }
}

/**
 * Event listener for HTTP server 'listening' event.
 */
function onListening() {
  var addr = server.address();
  var bind = (typeof addr === 'string') ? 'pipe ' + addr : 'port ' + addr.port;
  logger.info('>> LISTENING ON ' + bind);
}


/**
 * RUN
 * ------------------------------------------------------------------------
 * this starts up the server and configures its listeners
 **/
const server  = http.createServer(app);

server.on('error', onError);
server.on('listening', onListening);

server.listen(port);

process.on('unhandledRejection', function(reason, p){
  logger.error('Possibly Unhandled Rejection at: Promise ', p, ' reason: ', reason);
});

//for RESTFull API unit testing
module.exports = app;
