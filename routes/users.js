const express = require("express");
const auth = require("../middlewares/auth");

const {
  getCurrentUser,
  updateUser,
  createUser,
  login,
} = require("../controllers/users");

const router = express.Router();

router.post("/signup", createUser);
router.post("/signin", login);
router.get("/me", auth, getCurrentUser);
router.patch("/me", auth, updateUser);

module.exports = router;
