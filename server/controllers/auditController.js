const { runAudit } = require("../services/auditEngine");

const generateAudit = async (req, res) => {
  try {
    const { tools, teamSize, useCase } = req.body;

    if (!tools || !Array.isArray(tools) || tools.length === 0) {
      return res.status(400).json({ error: "tools array is required" });
    }

    const result = runAudit({ tools, teamSize, useCase });
    res.json(result);
  } catch (error) {
    console.error("Audit error:", error);
    res.status(500).json({ error: "Audit generation failed" });
  }
};

module.exports = { generateAudit };
