const jwt = require("jsonwebtoken");
const { UnauthorizedError } = require("../errors");
const { JWT_SECRET } = require("../utils/config");

module.exports = (req, res, next) => {
  const token = req.headers.authorization?.replace("Bearer ", "");

  if (!token) {
    return next(new UnauthorizedError("Authorization required"));
  }

  try {
    req.user = jwt.verify(token, JWT_SECRET);
    return next();
  } catch (err) {
    return next(new UnauthorizedError("Invalid token"));
  }
};
