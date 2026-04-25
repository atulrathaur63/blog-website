const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const AdminUser = require("../models/AdminUser");

/**
 * Generate JWT token for a given user ID.
 */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Login admin user
// @route   POST /api/auth/login
// @access  Public
// ─────────────────────────────────────────────────────────────────────────────
const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    res.status(400);
    throw new Error("Please provide both email and password");
  }

  // Find admin user by email
  const admin = await AdminUser.findOne({ email: email.toLowerCase() });

  if (!admin) {
    res.status(401);
    throw new Error("Invalid credentials");
  }

  // Verify password
  const isMatch = await admin.matchPassword(password);
  if (!isMatch) {
    res.status(401);
    throw new Error("Invalid credentials");
  }

  // Return user info + JWT
  res.json({
    success: true,
    data: {
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      token: generateToken(admin._id),
    },
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Get current logged-in admin profile
// @route   GET /api/auth/me
// @access  Private
// ─────────────────────────────────────────────────────────────────────────────
const getMe = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    data: {
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email,
    },
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Seed/create the admin user (run once during setup)
// @route   POST /api/auth/seed
// @access  Public (disable in production!)
// ─────────────────────────────────────────────────────────────────────────────
const seedAdmin = asyncHandler(async (req, res) => {
  // Disable in production
  if (process.env.NODE_ENV === "production") {
    res.status(403);
    throw new Error("Seeding is disabled in production");
  }

  const existingAdmin = await AdminUser.findOne({});
  if (existingAdmin) {
    res.status(400);
    throw new Error("Admin user already exists");
  }

  const admin = await AdminUser.create({
    name: "Blog Admin",
    email: process.env.ADMIN_EMAIL || "admin@blog.com",
    password: process.env.ADMIN_PASSWORD || "Admin@123",
  });

  res.status(201).json({
    success: true,
    message: "Admin user created successfully",
    data: {
      email: admin.email,
      name: admin.name,
    },
  });
});

module.exports = { loginAdmin, getMe, seedAdmin };
