const express = require("express");
const {
  getClothingItems,
  getClothingItem,
  createClothingItem,
  deleteClothingItem,
  updateClothingItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItems");

const router = express.Router();

router.get("/", getClothingItems);
router.get("/:itemId", getClothingItem);
router.post("/", createClothingItem);
router.delete("/:itemId", deleteClothingItem);
router.patch("/:itemId", updateClothingItem);
router.put("/:itemId/likes", likeItem);
router.delete("/:itemId/likes", dislikeItem);

module.exports = router;
