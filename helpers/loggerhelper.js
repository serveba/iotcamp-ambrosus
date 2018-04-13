const winston = require('winston');
const settings = require('../config/settings');
const os = require('os');

// default configuration for test and production environments
// let logger = new winston.Logger({
//   transports: [
//     new winston.transports.File({
//       level: 'info',
//       filename: settings.LOG_FILE,
//       handleExceptions: true,
//       json: false,
//       maxsize: 10*1024*1024, //10MB
//       maxFiles: 10,
//       colorize: true,
//       humanReadableUnhandledException: true
//     })
//   ],
//   exitOnError: false
// });

let logger = new winston.Logger({
    transports: [
      new winston.transports.Console({
        level: 'debug',
        humanReadableUnhandledException: true,
        handleExceptions: true,
        timestamp: true,
        json: false,
        colorize: true
      })
    ],
    exitOnError: false
  });

module.exports = logger;
