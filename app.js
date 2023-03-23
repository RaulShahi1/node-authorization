const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const authRoutes = require("./routes/auth/auth");
const productRoutes = require("./routes/products/index");
const cartRoutes = require("./routes/cart/cart");

const app = express();

app.use(express.json());

mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PW}@cluster0.miyty1x.mongodb.net?retryWrites=true&w=majority`
  )
  .then(
    app.listen(5000, (err, suc) => {
      console.log("Server running on port 5000");
    })
  )
  .catch((err) => console.log(err));

app.use("/", authRoutes);
app.use("/products", productRoutes);
app.use("/cart", cartRoutes);
