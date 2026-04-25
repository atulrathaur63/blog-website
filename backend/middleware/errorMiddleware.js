/**
 * 404 Not Found handler
 * Catches requests to undefined routes.
 */
const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

/**
 * Global error handler
 * Returns a consistent JSON error response.
 * In production, hides stack traces.
 */
const errorHandler = (err, req, res, next) => {
  // Use response status code if already set (not 200), else default to 500
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;

  // Handle specific Mongoose errors
  let message = err.message;

  // Mongoose duplicate key error (e.g., unique slug conflict)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    message = `A post with this ${field} already exists`;
    res.status(400);
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    message = Object.values(err.errors)
      .map((val) => val.message)
      .join(", ");
    res.status(400);
  }

  // Mongoose invalid ObjectId
  if (err.name === "CastError") {
    message = `Invalid ${err.path}: ${err.value}`;
    res.status(400);
  }

  res.status(statusCode || 500).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};

module.exports = { notFound, errorHandler };
