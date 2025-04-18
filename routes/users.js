const express = require("express");
const auth = require("../middlewares/auth");
const { getCurrentUser, updateUser } = require("../controllers/users");
const { validateUserUpdate } = require("../middlewares/validation");

const router = express.Router();

router.get("/me", auth, getCurrentUser);
router.patch("/me", auth, validateUserUpdate, updateUser);

module.exports = router;
