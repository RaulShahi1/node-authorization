const express = require("express");
const cartController = require("../../controllers/cartController/index");
const verifyToken = require("../../middleware/auth");
const router = express.Router();

router.use(verifyToken);

router
  .route("/")
  .get(cartController.getCartItems)
  .post(cartController.addProductInCart);

router.delete("/:productId", cartController.removeItemFromCart);

module.exports = router;
