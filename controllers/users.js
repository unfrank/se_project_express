const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const User = require("../models/user");

const {
  BAD_REQUEST,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
  UNAUTHORIZED,
  CONFLICT,
} = require("../utils/errors");

const { JWT_SECRET } = require("../utils/config");

module.exports.createUser = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(BAD_REQUEST)
      .send({ message: "Email and password are required" });
  }

  if (!validator.isEmail(email)) {
    return res.status(BAD_REQUEST).send({ message: "Invalid email format" });
  }

  bcrypt
    .hash(password, 10)
    .then((hashedPassword) => User.create({ email, password: hashedPassword }))
    .then((user) => {
      res.status(201).send({
        _id: user._id,
        email: user.email,
      });
    })
    .catch((err) => {
      if (err.code === 11000) {
        return res
          .status(CONFLICT)
          .send({ message: "User with this email already exists" });
      }
      res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An error has occurred on the server" });
    });
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;

  User.findOne({ email })
    .select("+password")
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error("Incorrect email or password"));
      }
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return Promise.reject(new Error("Incorrect email or password"));
        }

        const token = jwt.sign({ _id: user._id.toString() }, JWT_SECRET, {
          expiresIn: "7d",
        });

        res.send({ token });
      });
    })
    .catch(() => {
      res.status(UNAUTHORIZED).send({ message: "Incorrect email or password" });
    });
};

module.exports.getCurrentUser = (req, res) => {
  User.findById(req.user._id)
    .orFail(() => {
      const error = new Error("User not found");
      error.statusCode = NOT_FOUND;
      throw error;
    })
    .then((user) => res.status(200).send({ _id: user._id, email: user.email }))
    .catch((err) => {
      if (err.name === "CastError") {
        return res.status(BAD_REQUEST).send({ message: "Invalid ID format" });
      }
      res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An error has occurred on the server" });
    });
};

module.exports.updateUser = (req, res) => {
  const { name, avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .orFail(() => {
      const error = new Error("User not found");
      error.statusCode = NOT_FOUND;
      throw error;
    })
    .then((updatedUser) => {
      res.status(200).send({
        _id: updatedUser._id,
        name: updatedUser.name,
        avatar: updatedUser.avatar,
      });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(BAD_REQUEST).send({ message: "Invalid user data" });
      }
      res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An error has occurred on the server" });
    });
};
