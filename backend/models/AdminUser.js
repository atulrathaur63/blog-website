const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

/**
 * Admin User Schema
 * Only one admin user exists for this personal blog.
 * Password is hashed before saving using bcrypt.
 */
const adminUserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
    },
    name: {
      type: String,
      default: "Admin",
    },
  },
  { timestamps: true }
);

// ── Pre-save hook: hash password if modified ──────────────────────────────────
adminUserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// ── Instance method: compare plain text password with hashed ─────────────────
adminUserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("AdminUser", adminUserSchema);
