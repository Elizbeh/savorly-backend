import winston from 'winston';

// Define custom log levels
const logLevels = {
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    verbose: 4,
    debug: 5,
    silly: 6,
  },
  colors: {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'magenta',
    verbose: 'cyan',
    debug: 'blue',
    silly: 'grey',
  },
};

// Configure the winston logger
const logger = winston.createLogger({
  levels: logLevels.levels,
  transports: [
    // Console transport
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),  // Add color to log levels
        winston.format.timestamp(), // Add timestamp to each log
        winston.format.simple()    // Simple log format
      ),
      level: process.env.NODE_ENV === 'production' ? 'info' : 'debug', // Set log level depending on the environment
    }),

    // File transport (for logs in production)
    new winston.transports.File({
      filename: 'logs/combined.log',
      level: 'info', // Store only info level and above in the file
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      ),
    }),

    // Error file transport
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error', // Only log errors in this file
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      ),
    }),
  ],
});

// Apply colorization for log levels
winston.addColors(logLevels.colors);

// Export the logger to use it in other parts of the application
export default logger;
