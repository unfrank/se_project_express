const express = require("express");
const usersRouter = require("./users");
const clothingItemsRouter = require("./clothingItems");

const router = express.Router();

router.use("/users", usersRouter);
router.use("/items", clothingItemsRouter);

router.use((req, res) => {
  res.status(404).send({ message: "Requested resource not found" });
});

module.exports = router;
