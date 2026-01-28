const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },

    password: {
      type: String,
      default: null
    },

    provider: {
      type: String,
      enum: ["local", "google", "github"],
      default: "local"
    },

    isEmailVerified: {
      type: Boolean,
      default: false
    },

    emailOtp: {
      type: String
    },

    emailOtpExpires: {
      type: Date
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
