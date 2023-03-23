const bcrypt = require("bcryptjs");

exports.encryptPassword = (password, seed) => {
  var salt = bcrypt.genSaltSync(seed);

  return bcrypt.hashSync(password, salt);
};
