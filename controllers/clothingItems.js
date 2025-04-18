const validator = require("validator");
const mongoose = require("mongoose");
const ClothingItem = require("../models/clothingItem");

const { BadRequestError, ForbiddenError, NotFoundError } = require("../errors");

module.exports.getClothingItems = (req, res, next) =>
  ClothingItem.find({})
    .then((items) => res.send(items))
    .catch(next);

module.exports.getClothingItem = (req, res, next) => {
  const { itemId } = req.params;

  return ClothingItem.findById(itemId)
    .orFail(() => {
      throw new NotFoundError("Item not found");
    })
    .then((item) => res.send(item))
    .catch((err) => {
      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid item ID format"));
      }
      return next(err);
    });
};

module.exports.createClothingItem = (req, res, next) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;

  if (!name || !weather || !imageUrl) {
    return next(new BadRequestError("All fields are required"));
  }

  if (!validator.isURL(imageUrl)) {
    return next(new BadRequestError("Invalid image URL format"));
  }

  return ClothingItem.create({ name, weather, imageUrl, owner })
    .then((item) => res.status(201).send(item))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return next(new BadRequestError("Invalid data"));
      }
      return next(err);
    });
};

module.exports.deleteClothingItem = (req, res, next) => {
  const { itemId } = req.params;

  return ClothingItem.findById(itemId)
    .orFail(() => {
      throw new NotFoundError("Item not found");
    })
    .then((item) => {
      if (!item.owner.equals(req.user._id)) {
        throw new ForbiddenError(
          "You do not have authorization to delete this item"
        );
      }
      return ClothingItem.findByIdAndDelete(itemId);
    })
    .then(() => res.status(200).send({ message: "Item deleted successfully" }))
    .catch((err) => {
      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid item ID format"));
      }
      return next(err);
    });
};

module.exports.likeItem = (req, res, next) => {
  const { itemId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    return next(new BadRequestError("Invalid item ID format"));
  }

  return ClothingItem.findByIdAndUpdate(
    itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true, runValidators: true }
  )
    .orFail(() => {
      throw new NotFoundError("Item not found");
    })
    .then((updatedItem) => res.send(updatedItem))
    .catch((err) => {
      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid item ID format"));
      }
      return next(err);
    });
};

module.exports.dislikeItem = (req, res, next) => {
  const { itemId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    return next(new BadRequestError("Invalid item ID format"));
  }

  return ClothingItem.findByIdAndUpdate(
    itemId,
    { $pull: { likes: req.user._id } },
    { new: true, runValidators: true }
  )
    .orFail(() => {
      throw new NotFoundError("Item not found");
    })
    .then((updatedItem) => res.send(updatedItem))
    .catch((err) => {
      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid item ID format"));
      }
      return next(err);
    });
};
