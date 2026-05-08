const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
const auditRoutes = require("./routes/auditRoutes");
app.use("/api/audit", auditRoutes);

app.get("/", (req, res) => {
  res.json({ message: "SpendPilot API Running" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});

module.exports = app;
