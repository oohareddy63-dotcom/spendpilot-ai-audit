const mongoose = require("mongoose");

const LeadSchema = new mongoose.Schema({
  email: { type: String, required: true, trim: true, lowercase: true },
  company: { type: String, trim: true, default: "" },
  role: { type: String, trim: true, default: "" },
  teamSize: { type: String, default: "" },
  auditId: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Lead", LeadSchema);
