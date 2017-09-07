const winston = require('winston');

const LOGS_DIR = '../logs/';
const LOG_FILE_NAME = 'robot_core.log';

const logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({
      level: 'silly',
      timestamp: true,
      colorize: true,
    }),
    new (winston.transports.File)({
      level: 'silly',
      filename: `${LOGS_DIR}${LOG_FILE_NAME}`,
      timestamp: true,
      json: false,
      options: {
        flags: 'a+',
      },
    }),
  ],
});

module.exports = logger;
