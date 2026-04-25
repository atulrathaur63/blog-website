const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const AdminUser = require("../models/AdminUser");

/**
 * Protect middleware
 * Verifies the JWT token from the Authorization header.
 * Attaches the admin user to req.user if valid.
 */
const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Check for Bearer token in Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    try {
      // Extract token from "Bearer <token>"
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach user to request (exclude password)
      req.user = await AdminUser.findById(decoded.id).select("-password");

      if (!req.user) {
        res.status(401);
        throw new Error("Admin user not found");
      }

      next();
    } catch (error) {
      res.status(401);
      throw new Error("Not authorized, invalid token");
    }
  }

  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token provided");
  }
});

module.exports = { protect };
