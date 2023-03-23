const Cart = require("../../models/cartModel");

exports.getCartItems = async (req, res, next) => {
  try {
    const allCartItems = await Cart.findOne({ userId: req.user._id })
      .populate("userId")
      .populate("products.productId");
    if (!allCartItems || allCartItems.length < 1) {
      return res.send("No products added in cart.");
    }
    res.status(200).json(allCartItems);
  } catch (err) {
    console.log("Could not load cart items.", err);
    res.status(500).send("Could not load cart items.");
  }
};

exports.addProductInCart = async (req, res, next) => {
  const productId = req.body.productId;
  try {
    const userCart = await Cart.findOne({ userId: req.user._id });
    if (!userCart) {
      const newCart = await Cart.create({
        userId: req.user._id,
        products: [{ productId: productId, quantity: 1 }],
      });
      return res.status(201).json(newCart);
    } else {
      const productExists = userCart.products.find(
        (item) => item.productId.toString() === productId
      );
      if (productExists) {
        productExists.quantity = productExists.quantity + 1;
      } else {
        userCart.products.push({ productId: productId, quantity: 1 });
      }
    }
    const updatedCart = await userCart.save();
    res.status(201).json(updatedCart);
  } catch (err) {
    console.log("Could not add product in the cart.", err);
    res.status(500).send("Could not update cart items.");
  }
};

exports.removeItemFromCart = async (req, res, next) => {
  const productId = req.params.productId;
  try {
    let userCart = await Cart.findOne({ userId: req.user._id });
    if (!userCart) {
      return res
        .status(400)
        .send("No items added in the cart. Deletion cannot be done.");
    }
    const existingProduct = userCart.products.find(
      (item) => item.productId.toString() === productId
    );
    if (!existingProduct) {
      return res
        .status(400)
        .send("Product not found in the cart. Deletion failed.");
    }
    if (existingProduct.quantity === 1) {
      userCart.products = userCart.products.filter(
        (item) => item.productId.toString() !== productId
      );
    } else {
      existingProduct.quantity = existingProduct.quantity - 1;
    }
    const updatedCart = await userCart.save();
    res.status(200).json(updatedCart);
  } catch (err) {
    console.log("Could not remove product from cart.", err);
    res.status(500).send("Could not delete cart items.");
  }
};
