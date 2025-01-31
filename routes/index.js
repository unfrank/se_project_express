const express = require("express");
const usersRouter = require("./users");
const clothingItemsRouter = require("./clothingItems");
const { NOT_FOUND } = require("../utils/errors"); // Import NOT_FOUND constant

const router = express.Router();

router.use("/users", usersRouter);
router.use("/items", clothingItemsRouter);

router.use((req, res) => {
  res.status(NOT_FOUND).send({ message: "Requested resource not found" });
});

module.exports = router;
