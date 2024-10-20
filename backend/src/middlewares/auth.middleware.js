const jwt = require("jsonwebtoken");
const handleResponse = require("../utils/response.util");

// Middleware function to authenticate the user
const authenticate = (req, res, next) => {
  // Get the token from the Authorization header
  const authHeader = req.headers.authorization;

  // Check if the Authorization header exists and starts with 'Bearer'
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return handleResponse(
      res,
      401,
      "error",
      "No token provided. Authorization denied."
    );
  }

  // Extract the token
  const token = authHeader.split(" ")[1];

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach the decoded user information to req.user
    req.user = decoded;

    // Continue to the next middleware/route handler
    next();
  } catch (error) {
    return handleResponse(res, 401, "error", "Invalid token");
  }
};

module.exports = authenticate;
