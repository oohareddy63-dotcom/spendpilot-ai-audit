const Lead = require("../models/Lead");
const Audit = require("../models/Audit");
const { sendAuditEmail } = require("../services/emailService");

const saveLead = async (req, res) => {
  try {
    const { email, company, role, teamSize, auditId, honeypot } = req.body;

    // ── Honeypot anti-spam check ─────────────────────────────────────────────
    // The `honeypot` field is a hidden input that humans never fill.
    // If it contains any value, this is almost certainly a bot submission.
    if (honeypot) {
      // Return 200 to not tip off bots, but don't save anything
      return res.json({ success: true });
    }

    // Basic email validation
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: "Valid email is required" });
    }

    // Save lead
    const lead = await Lead.create({ email, company, role, teamSize, auditId });

    // Fetch the associated audit for the email
    let aiSummary = "";
    let auditSummary = null;
    let shareUrl = null;

    if (auditId) {
      try {
        const audit = await Audit.findOne({ shareId: auditId });
        if (audit) {
          aiSummary = audit.aiSummary || "";
          auditSummary = audit.summary;
          shareUrl = `${process.env.CLIENT_URL || "http://localhost:5173"}/share/${auditId}`;
        }
      } catch (dbErr) {
        console.warn("Could not fetch audit for email:", dbErr.message);
      }
    }

    // Send confirmation email (non-blocking)
    const emailResult = await sendAuditEmail({
      email,
      aiSummary,
      summary: auditSummary,
      shareUrl,
    });

    res.json({
      success: true,
      lead: { id: lead._id, email: lead.email },
      emailSent: emailResult?.success ?? false,
    });
  } catch (error) {
    console.error("Lead save error:", error);
    res.status(500).json({ error: "Lead save failed" });
  }
};

module.exports = { saveLead };
