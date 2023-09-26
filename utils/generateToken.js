const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.generateToken = (data) => {
  const payload = { data };
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};
