const express = require("express");
const usersRouter = require("./users");
const clothingItemsRouter = require("./clothingItems");
const { createUser, login } = require("../controllers/users");
const { NOT_FOUND } = require("../utils/errors");

const router = express.Router();

router.post("/signup", createUser);
router.post("/signin", login);

router.use("/items", clothingItemsRouter);
router.use("/users", usersRouter);

// 404 handler
router.use((req, res) => {
  res.status(NOT_FOUND).send({ message: "Requested resource not found" });
});

module.exports = router;
