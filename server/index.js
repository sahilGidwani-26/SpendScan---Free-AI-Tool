require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const rateLimit = require("express-rate-limit");

const auditRoutes = require("./routes/audit");
const leadRoutes = require("./routes/leads");
const summaryRoutes = require("./routes/summary");

const app = express();

// Middleware
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://spendscan-ai-tool-1.onrender.com"
  ],
  credentials: true
}));
app.use(express.json({ limit: "10kb" }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50,
  message: { error: "Too many requests, please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api/", limiter);

// Routes
app.use("/api/audit", auditRoutes);
app.use("/api/leads", leadRoutes);
app.use("/api/summary", summaryRoutes);

// Health check
app.get("/api/health", (req, res) => res.json({ status: "ok", ts: Date.now() }));

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/ai-spend-audit")
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

module.exports = app;
