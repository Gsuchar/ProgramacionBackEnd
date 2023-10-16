
// IGNORAR, LO DESHABILITE TODO LO DE QUE TENIA DE LOGGER




// import winston from "winston";
// import dotenv from "dotenv";

// dotenv.config();

// let loggerTransport;

// if (process.env.LOGGER_MODE === "dev") {
//   loggerTransport = new winston.transports.Console({
//     level: "debug",
//     format: winston.format.combine(
//       winston.format.colorize({ all: true }),
//       winston.format.simple()
//     ),
//   });
// } else {
//   loggerTransport = new winston.transports.File({
//     filename: "./errors.log",
//     level: "info",
//     format: winston.format.simple(),
//   });
// }

// const logger = winston.createLogger({
//   transports: [loggerTransport],
// });

// export const addLogger = (req, res, next) => {
//   req.logger = logger;
//   /* req.logger.info(
//     `${req.method} on ${req.url} - ${new Date().toLocaleTimeString()}`
//   ); */
//   next();
// };

