const Visit = require("../models/Visit");
const asyncHandler = require("express-async-handler");

/**
 * Tracks daily visits.
 * Increments the count for the current day (YYYY-MM-DD).
 */
const trackVisit = asyncHandler(async (req, res, next) => {
  // Only track public GET requests that are not image or static file requests
  if (req.method === "GET" && !req.path.startsWith("/api/auth") && !req.path.startsWith("/uploads")) {
    const today = new Date().toISOString().split("T")[0];
    
    // Use findOneAndUpdate with upsert to avoid race conditions
    await Visit.findOneAndUpdate(
      { date: today },
      { $inc: { count: 1 } },
      { upsert: true, new: true }
    );
  }
  next();
});

module.exports = { trackVisit };
