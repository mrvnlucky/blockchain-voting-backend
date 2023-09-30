const jwt = require("jsonwebtoken");
require("dotenv").config({ path: "../.env" });

exports.generateToken = (data) => {
  const payload = { data };
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};
