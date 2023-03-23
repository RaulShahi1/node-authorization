const Product = require("../../models/productModel");

exports.getAllProducts = async (req, res, next) => {
  const allProducts = await Product.find({}).populate("createdBy");
  if (!allProducts || allProducts.length < 1) {
    return res.status(400).send("No Products Found.");
  }
  res.status(200).json(allProducts);
};

exports.addProduct = async (req, res, next) => {
  const { name, price, description } = req.body;
  try {
    const newProduct = await Product.create({
      name,
      price,
      description,
      createdBy: req.user,
    });

    res.status(200).json(newProduct);
  } catch (err) {
    console.log("Could not add product", err);
    res.status(500).send("Could not add product");
  }
};

exports.updateProduct = async (req, res, next) => {
  const productId = req.params.productId;
  const { name, price, description } = req.body;

  try {
    let updatedProduct = await Product.findById(productId).populate(
      "createdBy"
    );

    if (!updatedProduct) {
      console.log("No product found");
      return res.status(400).json("No product found");
    }

    if (
      req.user.isAdmin ||
      updatedProduct.createdBy._id.toString() === req.user._id.toString()
    ) {
      updatedProduct.name = name;
      updatedProduct.price = price;
      updatedProduct.description = description;
      await updatedProduct.save();
    } else {
      throw new Error("Product Can Only Be Updated By Admin or the owner.");
    }
    res.status(200).json(updatedProduct);
  } catch (err) {
    console.log("Could not update product=>", err);
    res.status(500).send("Could not update product");
  }
};

exports.deleteProduct = async (req, res, next) => {
  const productId = req.params.productId;

  try {
    const deletedProduct = await Product.findById(productId).populate(
      "createdBy"
    );
    if (!deletedProduct) {
      console.log("No product found");
      return res.status(400).json("No product found");
    }
    if (
      req.user.isAdmin ||
      deletedProduct.createdBy._id.toString() === req.user._id.toString()
    ) {
      await Product.deleteOne({ _id: productId });
    } else {
      throw new Error("Product Can Only Be Deleted By Admin or the owner.");
    }

    res.status(200).send("Product deleted succesfully.");
  } catch (err) {
    console.log("error", err);
    res.status(500).send("Could not delete product.");
  }
};
