const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { isStrongPassword } = require("../utils/passwordValidator");
const { generateOtp } = require("../utils/otp");

// EMAIL SIGNUP
exports.signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!isStrongPassword(password)) {
      return res.status(400).json({
        message:
          "Password must be at least 8 characters and include uppercase, lowercase, number, and special character"
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = generateOtp();

    await User.create({
      username,
      email,
      password: hashedPassword,
      provider: "local",
      emailOtp: otp,
      emailOtpExpires: Date.now() + 10 * 60 * 1000
    });

    // TEMP: OTP shown in server console
    console.log("EMAIL OTP:", otp);

    res.status(201).json({
      success: true,
      message: "Signup successful. Please verify email using OTP"
    });
  } catch (error) {
    res.status(500).json({ message: "Signup failed" });
  }
};

// VERIFY EMAIL OTP
exports.verifyEmailOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    if (
      user.emailOtp !== otp ||
      user.emailOtpExpires < Date.now()
    ) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.isEmailVerified = true;
    user.emailOtp = null;
    user.emailOtpExpires = null;
    await user.save();

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      message: "Email verified successfully",
      token
    });
  } catch (error) {
    res.status(500).json({ message: "OTP verification failed" });
  }
};
