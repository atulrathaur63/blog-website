const express = require("express");
const router = express.Router();
const { loginAdmin, getMe, seedAdmin } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

// Public routes
router.post("/login", loginAdmin);
router.post("/seed", seedAdmin); // ⚠️ Disable or remove after initial setup

// Protected routes
router.get("/me", protect, getMe);

module.exports = router;
