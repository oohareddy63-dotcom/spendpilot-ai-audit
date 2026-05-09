const { runAudit } = require("../services/auditEngine");
const { generateAISummary } = require("../services/aiSummaryService");
const Audit = require("../models/Audit");
const { v4: uuidv4 } = require("uuid");

const generateAudit = async (req, res) => {
  try {
    const { tools, teamSize, useCase } = req.body;

    if (!tools || !Array.isArray(tools) || tools.length === 0) {
      return res.status(400).json({ error: "tools array is required" });
    }

    // 1. Run rule-based audit engine
    const auditResult = runAudit({ tools, teamSize, useCase });

    // 2. Generate AI summary (with graceful fallback)
    const aiSummary = await generateAISummary(auditResult);
    auditResult.aiSummary = aiSummary;

    // 3. Persist to MongoDB (non-blocking — don't fail the request if DB is down)
    let shareId = uuidv4();
    try {
      const saved = await Audit.create({
        tools,
        teamSize,
        useCase,
        recommendations: auditResult.recommendations,
        flags: auditResult.flags,
        summary: auditResult.summary,
        aiSummary,
        shareId,
      });
      shareId = saved.shareId;
    } catch (dbErr) {
      console.warn("DB save failed (non-fatal):", dbErr.message);
    }

    auditResult.shareId = shareId;

    res.json(auditResult);
  } catch (error) {
    console.error("Audit error:", error);
    res.status(500).json({ error: "Audit generation failed" });
  }
};

// GET /api/audit/:shareId — public share endpoint
const getAuditByShareId = async (req, res) => {
  try {
    const audit = await Audit.findOne(
      { shareId: req.params.shareId },
      // Exclude any fields that could contain PII
      "-__v"
    );
    if (!audit) {
      return res.status(404).json({ error: "Report not found" });
    }
    // Return only public-safe fields
    res.json({
      tools: audit.tools,
      recommendations: audit.recommendations,
      flags: audit.flags,
      summary: audit.summary,
      aiSummary: audit.aiSummary,
      shareId: audit.shareId,
      createdAt: audit.createdAt,
    });
  } catch (error) {
    console.error("Share fetch error:", error);
    res.status(500).json({ error: "Failed to fetch report" });
  }
};

module.exports = { generateAudit, getAuditByShareId };
