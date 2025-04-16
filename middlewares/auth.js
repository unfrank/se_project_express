const jwt = require("jsonwebtoken");
const { UNAUTHORIZED } = require("../utils/errors");
const { JWT_SECRET } = require("../utils/config");
const token = jwt.sign({ _id: user._id }, JWT_SECRET);

module.exports = (req, res, next) => {
  const token = req.headers.authorization?.replace("Bearer ", "");

  if (!token) {
    return res.status(UNAUTHORIZED).send({ message: "Authorization required" });
  }

  try {
    req.user = jwt.verify(token, JWT_SECRET);
    return next();
  } catch (err) {
    return res.status(UNAUTHORIZED).send({ message: "Invalid token" });
  }
};
