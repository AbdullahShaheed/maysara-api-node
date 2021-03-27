const winston = require("winston");

module.exports = function () {
  winston.add(new winston.transports.Console());
  winston.add(
    new winston.transports.File({
      filename: "unhandledExceptions.log",
      level: "error",
      handleExceptions: true,
      handleRejections: true,
    })
  );
};
