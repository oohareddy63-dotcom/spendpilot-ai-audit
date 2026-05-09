const mongoose = require("mongoose");

const AuditSchema = new mongoose.Schema({
  tools: { type: Array, required: true },
  teamSize: { type: String },
  useCase: { type: String },
  recommendations: { type: Array, default: [] },
  flags: { type: Array, default: [] },
  summary: { type: Object },
  aiSummary: { type: String, default: "" },
  shareId: { type: String, unique: true, index: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Audit", AuditSchema);
