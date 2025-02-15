const bcrypt = require("bcryptjs");
const User = require("../models/user");
const {
  BAD_REQUEST,
  CONFLICT,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
} = require("../utils/errors");

module.exports.createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;

  if (!email || !password) {
    return res
      .status(BAD_REQUEST)
      .send({ message: "Email and password are required" });
  }

  bcrypt
    .hash(password, 10)
    .then((hashedPassword) =>
      User.create({ name, avatar, email, password: hashedPassword })
    )
    .then((user) => {
      const userWithoutPassword = {
        _id: user._id,
        name: user.name,
        avatar: user.avatar,
        email: user.email,
      };
      res.status(201).send(userWithoutPassword);
    })
    .catch((err) => {
      console.error("Error in createUser:", err);

      if (err.code === 11000) {
        return res
          .status(409)
          .send({ message: "User with this email already exists" });
      }
      if (err.name === "ValidationError") {
        return res.status(400).send({ message: "Invalid user data" });
      }

      res.status(500).send({ message: "An error has occurred on the server" });
    });
};

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch(() =>
      res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "Internal server error" })
    );
};

module.exports.getUser = (req, res) => {
  const { userId } = req.params;

  return User.findById(userId)
    .orFail(() => {
      const error = new Error("User not found");
      error.statusCode = NOT_FOUND;
      throw error;
    })
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === "CastError") {
        return res.status(BAD_REQUEST).send({ message: "Invalid ID format" });
      }
      if (err.statusCode === NOT_FOUND) {
        return res.status(NOT_FOUND).send({ message: err.message });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An error has occurred on the server" });
    });
};
