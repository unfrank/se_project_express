const { errorLogger } = require("./logger");

module.exports = (err, req, res, next) => {
  errorLogger.error(err);

  const { statusCode = 500, message } = err;

  res.status(statusCode).send({
    message: statusCode === 500 ? "An error occurred on the server" : message,
  });
};
