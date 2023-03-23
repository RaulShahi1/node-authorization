const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/userModel");

exports.registerUsers = async (req, res, next) => {
  try {
    //Get user input
    const { firstName, lastName, email, password, isAdmin } = req.body;

    //Validate user input

    if (!(firstName && lastName && email && password)) {
      res.status(400).send("All the inputs are required.");
    }

    //checking if user already exists
    //validate if user exist in our database
    const isOldUser = await User.findOne({ email });
    if (isOldUser) {
      return res
        .status(409)
        .send(
          "User already exists. Please login or use another email to register."
        );
    }

    //encrypt user password

    //create user in database
    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      isAdmin,
    });

    //create token

    const token = jwt.sign(
      { user_id: user._id, email },
      process.env.JWT_SECRET,
      {
        expiresIn: "2h",
      }
    );
    user.token = token;
    res.status(201).json(user);
  } catch (err) {
    console.log(err);
  }
};

exports.postUserLogin = async (req, res, next) => {
  //logic for login
  try {
    // acquiring input data
    const { email, password } = req.body;

    // validating user inputs
    if (!(email && password)) {
      return res.status(400).send("All inputs are required.");
    }

    //validating if user exists in database

    const user = await User.findOne({ email });

    if (user && bcrypt.compare(password, user.password)) {
      //create token
      const token = jwt.sign(
        { user_id: user._id, email },
        process.env.JWT_SECRET,
        {
          expiresIn: "2h",
        }
      );

      //save user token
      user.token = token;

      //user
      return res.status(200).json(user);
    }
    return res.status(400).send("Invalid Credentials.");
  } catch (err) {
    console.log(err);
  }
};
