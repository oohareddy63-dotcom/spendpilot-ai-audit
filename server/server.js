const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

app.use(cors({
  origin: [
    process.env.CLIENT_URL || "http://localhost:5173",
    "https://spendpilot-ai-audit.vercel.app",
    /\.vercel\.app$/,
    /\.onrender\.com$/,
    "http://localhost:5173",
  ],
  credentials: true,
}));
app.use(express.json());

// ── MongoDB connection ───────────────────────────────────────────────────────
if (process.env.MONGO_URI && process.env.MONGO_URI !== "your_mongodb_connection_string") {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("✅ MongoDB Connected"))
    .catch((err) => console.warn("⚠️  MongoDB connection failed:", err.message));
} else {
  console.warn("⚠️  MONGO_URI not set — running without database persistence.");
}

// ── Routes ───────────────────────────────────────────────────────────────────
const auditRoutes = require("./routes/auditRoutes");
const leadRoutes = require("./routes/leadRoutes");

app.use("/api/audit", auditRoutes);
app.use("/api/leads", leadRoutes);

app.get("/", (req, res) => {
  res.json({ message: "SpendPilot API Running", version: "1.0.0" });
});

// ── 404 handler ──────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// ── Global error handler ─────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal server error" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

module.exports = app;
