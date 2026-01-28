const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");

console.log("Auth routes loaded");

router.post("/signup", authController.signup);
router.post("/verify-email", authController.verifyEmailOtp);

module.exports = router;
