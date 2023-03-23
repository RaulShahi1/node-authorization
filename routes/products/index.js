const express = require("express");
const router = express.Router();
const productController = require("../../controllers/productController/index");
const verifyToken = require("../../middleware/auth");

router.use(verifyToken);
router
  .route("/")
  .get(productController.getAllProducts)
  .post(productController.addProduct);
router
  .route("/:productId")
  .patch(productController.updateProduct)
  .delete(productController.deleteProduct);

module.exports = router;
