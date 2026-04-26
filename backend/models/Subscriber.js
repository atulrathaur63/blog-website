const mongoose = require("mongoose");
const validator = require("validator");

const subscriberSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      validate: [validator.isEmail, "Please provide a valid email"],
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Subscriber", subscriberSchema);
