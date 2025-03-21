const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const {
  BAD_REQUEST,
  UNAUTHORIZED,
  INTERNAL_SERVER_ERROR,
  CONFLICT,
  NOT_FOUND,
} = require("../utils/errors");
const { JWT_SECRET } = require("../utils/config");
const validator = require("validator");

module.exports.createUser = async (req, res) => {
  try {
    const { name, avatar = "", email, password } = req.body;

    if (!name || !email || !password) {
      return res
        .status(BAD_REQUEST)
        .send({ message: "All fields are required" });
    }

    if (avatar && !validator.isURL(avatar)) {
      return res
        .status(BAD_REQUEST)
        .send({ message: "Invalid avatar URL format" });
    }

    if (!validator.isEmail(email)) {
      return res.status(BAD_REQUEST).send({ message: "Invalid email format" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(CONFLICT).send({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      avatar,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: "7d" });

    res.status(201).send({
      user: {
        _id: user._id,
        name: user.name,
        avatar: user.avatar,
        email: user.email,
      },
      token,
    });
  } catch (err) {
    res.status(INTERNAL_SERVER_ERROR).send({ message: "Server error" });
  }
};

module.exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res
        .status(UNAUTHORIZED)
        .send({ message: "Incorrect email or password" });
    }
    const matched = await bcrypt.compare(password, user.password);
    if (!matched) {
      return res
        .status(UNAUTHORIZED)
        .send({ message: "Incorrect email or password" });
    }
    const token = jwt.sign({ _id: user._id.toString() }, JWT_SECRET, {
      expiresIn: "7d",
    });

    res.send({ user, token });
  } catch (err) {
    res.status(INTERNAL_SERVER_ERROR).send({ message: "Server error" });
  }
};

module.exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(NOT_FOUND).send({ message: "User not found" });
    }

    res.status(200).send({
      _id: user._id,
      name: user.name,
      avatar: user.avatar,
      email: user.email,
    });
  } catch (err) {
    res.status(INTERNAL_SERVER_ERROR).send({ message: "Server error" });
  }
};

module.exports.updateUser = async (req, res) => {
  try {
    const { name, avatar = "" } = req.body;

    if (!name) {
      return res.status(BAD_REQUEST).send({ message: "Name is required" });
    }

    if (avatar && !validator.isURL(avatar)) {
      return res
        .status(BAD_REQUEST)
        .send({ message: "Invalid avatar URL format" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { name, avatar },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(NOT_FOUND).send({ message: "User not found" });
    }

    res.status(200).send({
      _id: updatedUser._id,
      name: updatedUser.name,
      avatar: updatedUser.avatar,
    });
  } catch (err) {
    res.status(INTERNAL_SERVER_ERROR).send({ message: "Server error" });
  }
};
