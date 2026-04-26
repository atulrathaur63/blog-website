const asyncHandler = require("express-async-handler");
const Subscriber = require("../models/Subscriber");

// @desc    Subscribe to newsletter
// @route   POST /api/misc/subscribe
// @access  Public
const subscribe = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    res.status(400);
    throw new Error("Email is required");
  }

  const existingSubscriber = await Subscriber.findOne({ email });

  if (existingSubscriber) {
    res.status(400);
    throw new Error("You are already subscribed!");
  }

  await Subscriber.create({ email });

  res.status(201).json({
    success: true,
    message: "Thank you for subscribing! 🎉",
  });
});

module.exports = { subscribe };
