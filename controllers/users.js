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

    console.log("🟡 Received /signup request with:", {
      name,
      avatar,
      email,
      password: password ? "HIDDEN" : "MISSING",
    });

    if (!name || !email || !password) {
      console.log("❌ Missing fields in signup");
      return res
        .status(BAD_REQUEST)
        .send({ message: "All fields are required" });
    }

    if (avatar && !validator.isURL(avatar)) {
      console.log("❌ Invalid avatar URL:", avatar);
      return res
        .status(BAD_REQUEST)
        .send({ message: "Invalid avatar URL format" });
    }

    if (!validator.isEmail(email)) {
      console.log("❌ Invalid email:", email);
      return res.status(BAD_REQUEST).send({ message: "Invalid email format" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("❌ Email already in use:", email);
      return res.status(CONFLICT).send({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("🟡 Password hashed, creating user...");

    const user = await User.create({
      name,
      avatar,
      email,
      password: hashedPassword,
    });

    console.log("✅ User successfully created:", user._id);

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
    console.error("❌ Unexpected error during signup:", err);
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
    console.log("🟡 Fetching current user:", req.user._id);

    const user = await User.findById(req.user._id);
    if (!user) {
      console.log("❌ User not found");
      return res.status(NOT_FOUND).send({ message: "User not found" });
    }

    console.log("✅ User found:", user._id);
    res.status(200).send({
      _id: user._id,
      name: user.name,
      avatar: user.avatar,
      email: user.email,
    });
  } catch (err) {
    console.error("❌ Unexpected error fetching user:", err);
    res.status(INTERNAL_SERVER_ERROR).send({ message: "Server error" });
  }
};

module.exports.updateUser = async (req, res) => {
  try {
    const { name, avatar = "" } = req.body;
    console.log("🟡 Update request for user:", req.user._id);

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
      console.log("❌ User not found during update");
      return res.status(NOT_FOUND).send({ message: "User not found" });
    }

    console.log("✅ User profile updated:", updatedUser._id);
    res.status(200).send({
      _id: updatedUser._id,
      name: updatedUser.name,
      avatar: updatedUser.avatar,
    });
  } catch (err) {
    console.error("❌ Unexpected error updating user:", err);
    res.status(INTERNAL_SERVER_ERROR).send({ message: "Server error" });
  }
};
