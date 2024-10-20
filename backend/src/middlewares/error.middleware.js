const errorMiddleware = (err, req, res, next) => {
  console.error(err.stack); // Log the stack trace for debugging

  // Set default values for error
  let statusCode = err.statusCode || 500; // Internal server error by default
  let message = err.message || "Server Error";

  // Handle Mongoose Validation Errors
  if (err.name === "ValidationError") {
    statusCode = 400;
    const errors = Object.values(err.errors).map((val) => val.message);
    message = `Validation error: ${errors.join(", ")}`;
  }

  // Handle Duplicate Key Errors (e.g., unique fields like email)
  if (err.code && err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyValue);
    message = `Duplicate field value entered for ${field}. Please use another value.`;
  }

  // Handle CastError (invalid MongoDB ObjectId)
  if (err.name === "CastError") {
    statusCode = 400;
    message = `Resource not found with ID: ${err.value}`;
  }

  // Send error response
  res.status(statusCode).json({
    status: "error",
    message: message,
    data: null,
  });
};

module.exports = errorMiddleware;
