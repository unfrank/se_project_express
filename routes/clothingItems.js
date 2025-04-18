const express = require("express");
const auth = require("../middlewares/auth");
const {
  getClothingItems,
  getClothingItem,
  createClothingItem,
  deleteClothingItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItems");
const {
  validateCardBody,
  validateItemId,
} = require("../middlewares/validation");

const router = express.Router();

router.get("/", getClothingItems);
router.get("/:itemId", validateItemId, getClothingItem);
router.post("/", auth, validateCardBody, createClothingItem);
router.delete("/:itemId", auth, validateItemId, deleteClothingItem);
router.put("/:itemId/likes", auth, validateItemId, likeItem);
router.delete("/:itemId/likes", auth, validateItemId, dislikeItem);

module.exports = router;
