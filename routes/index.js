const express = require("express");
const auth = require("../middlewares/auth");
const usersRouter = require("./users");
const clothingItemsRouter = require("./clothingItems");
const { createUser, login } = require("../controllers/users");

const router = express.Router();

router.post("/signup", createUser);
router.post("/signin", login);

router.use("/items", clothingItemsRouter);

router.use(auth);
router.use("/users", usersRouter);
router.use("/items", auth, clothingItemsRouter);

router.use((req, res) => {
  res.status(404).send({ message: "Requested resource not found" });
});

module.exports = router;
