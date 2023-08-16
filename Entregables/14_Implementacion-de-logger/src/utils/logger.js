import winston from "winston";

const logger = winston.createLogger({
  transports: [
    new winston.transports.Console({
      level: "info",
      format: winston.format.colorize({ all: true }),
    }),
    new winston.transports.File({
      filename: "./errors.log",
      level: "warn",
      format: winston.format.simple(),
    }),
  ],
});

export const addLogger = (req, res, next) => {
  req.logger = logger;
  /* req.logger.info(
    `${req.method} on ${req.url} - ${new Date().toLocaleTimeString()}`
  ); */
  next();
};

/* req.logger.info(
    `${req.method} on ${req.url} - ${new Date().toLocaleTimeString()}`
  ); */