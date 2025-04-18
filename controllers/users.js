const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { CREATED } = require("../utils/errors");
const { JWT_SECRET } = require("../utils/config");

const {
  BadRequestError,
  UnauthorizedError,
  NotFoundError,
  ConflictError,
} = require("../errors");

module.exports.createUser = async (req, res, next) => {
  try {
    const { name, avatar = "", email, password } = req.body;

    if (!name || !email || !password) {
      return next(new BadRequestError("All fields are required"));
    }

    if (avatar && !validator.isURL(avatar)) {
      return next(new BadRequestError("Invalid avatar URL format"));
    }

    if (!validator.isEmail(email)) {
      return next(new BadRequestError("Invalid email format"));
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new ConflictError("User already exists"));
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      avatar,
      email,
      password: hashedPassword,
    });

    return res.status(CREATED).send({
      _id: user._id,
      name: user.name,
      avatar: user.avatar,
      email: user.email,
    });
  } catch (err) {
    return next(err);
  }
};

module.exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return next(new UnauthorizedError("Incorrect email or password"));
    }

    const matched = await bcrypt.compare(password, user.password);
    if (!matched) {
      return next(new UnauthorizedError("Incorrect email or password"));
    }
    const token = jwt.sign({ _id: user._id.toString() }, JWT_SECRET, {
      expiresIn: "7d",
    });
    const { _id, name, avatar } = user;

    return res.send({
      token,
      user: { _id, name, avatar, email: user.email },
    });
  } catch (err) {
    return next(err);
  }
};

module.exports.getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return next(new NotFoundError("User not found"));
    }

    return res.status(200).send({
      _id: user._id,
      name: user.name,
      avatar: user.avatar,
      email: user.email,
    });
  } catch (err) {
    return next(err);
  }
};

module.exports.updateUser = async (req, res, next) => {
  try {
    const { name, avatar = "" } = req.body;

    if (!name) {
      return next(new BadRequestError("Name is required"));
    }

    if (avatar && !validator.isURL(avatar)) {
      return next(new BadRequestError("Invalid avatar URL format"));
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { name, avatar },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return next(new NotFoundError("User not found"));
    }

    return res.status(200).send({
      _id: updatedUser._id,
      name: updatedUser.name,
      avatar: updatedUser.avatar,
    });
  } catch (err) {
    return next(err);
  }
};
