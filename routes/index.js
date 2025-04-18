const express = require("express");
const usersRouter = require("./users");
const clothingItemsRouter = require("./clothingItems");
const { NotFoundError } = require("../errors");

const { createUser, login } = require("../controllers/users");
const {
  validateUserBody,
  validateLoginBody,
} = require("../middlewares/validation");

const router = express.Router();

router.post("/signup", validateUserBody, createUser);
router.post("/signin", validateLoginBody, login);

router.use("/items", clothingItemsRouter);
router.use("/users", usersRouter);

router.use((req, res, next) => {
  next(new NotFoundError("Requested resource not found"));
});

module.exports = router;
