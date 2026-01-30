require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const authRoutes = require("./routes/auth.routes");
const textRoutes=require("./routes/Text.routes");

const app = express(); // ✅ app MUST be created first

// 🔍 DEBUG middleware (for Postman testing)
app.use((req, res, next) => {
  console.log("Incoming:", req.method, req.url);
  next();
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use('/api/text', textRoutes);

// Health check
app.get("/", (req, res) => {
  res.send("TypeAI backend running successfully");
});

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});



