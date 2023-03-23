const mongoose = require("mongoose");
const { encryptPassword } = require("../utils/encrypt");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, unique: true },
  password: { type: String, select: false },
  isAdmin: { type: Boolean, default: false },
  token: String,
});

userSchema.pre("save", function (next) {
  if (this.email && this.isModified("email")) {
    this.email = this.email.toLowerCase();
  }
  if (this.password && this.isModified("password")) {
    this.password = encryptPassword(this.password, 10);
  }
  next();
});

module.exports = new mongoose.model("User", userSchema);
