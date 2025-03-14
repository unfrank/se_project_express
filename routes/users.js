// const express = require("express");
// const auth = require("../middlewares/auth");
// const { getCurrentUser, updateUser } = require("../controllers/users");

// const router = express.Router();

// router.get("/me", auth, getCurrentUser);
// router.patch("/me", auth, updateUser);

// module.exports = router;

//! remake

const express = require("express");
const auth = require("../middlewares/auth");
const { getCurrentUser, updateUser } = require("../controllers/users");

const router = express.Router();

router.get("/me", auth, getCurrentUser);
router.patch("/me", auth, updateUser);

module.exports = router;
