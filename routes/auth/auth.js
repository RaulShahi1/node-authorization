const express = require("express");
const authController = require("../../controllers/authController/index");

const router = express.Router();

router.post("/signup", authController.registerUsers);
router.post("/login", authController.postUserLogin);

module.exports = router;
