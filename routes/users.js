// const express = require("express");
// const auth = require("../middlewares/auth");

// const { getCurrentUser, updateUser } = require("../controllers/users");

// const router = express.Router();

// router.get("/me", auth, getCurrentUser);
// router.patch("/me", auth, updateUser);

// module.exports = router;

// const express = require("express");
// const auth = require("../middlewares/auth");

// // 🛠 Correct Import
// const userController = require("../controllers/users");

// const router = express.Router();

// // Use userController.getCurrentUser and userController.updateUser explicitly
// router.get("/me", auth, userController.getCurrentUser);
// router.patch("/me", auth, userController.updateUser);

// module.exports = router;

const express = require("express");
const auth = require("../middlewares/auth");
const { getCurrentUser, updateUser } = require("../controllers/users");

const router = express.Router();

router.get("/me", auth, getCurrentUser);
router.patch("/me", auth, updateUser);

module.exports = router;
