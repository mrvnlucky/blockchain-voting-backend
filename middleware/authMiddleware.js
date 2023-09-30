// Import the necessary packages
const jwt = require("jsonwebtoken");
require("dotenv").config();

const secret = process.env.JWT_SECRET;

// Define the authentication middleware
exports.authMiddleware = (req, res, next) => {
  try {
    // Get the token from the request headers
    const token = req.headers.authorization.split(" ")[1];
    // Verify the token
    const decodedToken = jwt.verify(token, secret);

    // Attach the user payload to the request object
    req.user = decodedToken;

    if (req.user.data.role !== "user") {
      return res.status(401).json({
        message: "Authentication failed",
      });
    }

    next();
  } catch (error) {
    console.error(error);
    return res.status(401).send({
      message: "Authentication failed",
    });
  }
};

exports.adminAuthMiddleware = (req, res, next) => {
  try {
    // Get the token from the request headers
    const token = req.headers.authorization.split(" ")[1];

    // Verify the token
    const decodedToken = jwt.verify(token, secret);

    // Attach the user payload to the request object
    req.user = decodedToken;

    if (req.user.data.role !== "admin") {
      return res.status(401).json({
        message: "Admin Authentication failed",
      });
    }
    next();
  } catch (error) {
    console.error(error);
    return res.status(401).send({
      message: "Admin Authentication failed",
    });
  }
};
