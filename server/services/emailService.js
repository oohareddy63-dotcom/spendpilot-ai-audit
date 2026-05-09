const { Resend } = require("resend");

/**
 * Send the audit report email to the lead.
 * Gracefully no-ops if RESEND_API_KEY is not configured.
 */
async function sendAuditEmail({ email, aiSummary, summary, shareUrl }) {
  if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === "your_resend_api_key") {
    console.warn("Resend API key not configured — skipping email send.");
    return { skipped: true };
  }

  // Lazy-initialize so missing key at module load doesn't crash the server
  const resend = new Resend(process.env.RESEND_API_KEY);

  const monthly = summary?.totalCurrentMonthly?.toFixed(0) ?? 0;
  const savings = summary?.totalMonthlySavings?.toFixed(0) ?? 0;
  const annual = summary?.totalAnnualSavings?.toFixed(0) ?? 0;
  const pct = summary?.savingsPercent ?? 0;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Your SpendPilot AI Audit Report</title>
</head>
<body style="margin:0;padding:0;background:#060816;font-family:Inter,Arial,sans-serif;color:#ffffff;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#060816;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#0d1030;border:1px solid rgba(255,255,255,0.08);border-radius:16px;overflow:hidden;">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#6366f1,#8b5cf6);padding:32px 40px;">
              <h1 style="margin:0;font-size:24px;font-weight:800;color:#ffffff;letter-spacing:-0.5px;">
                SpendPilot AI Audit
              </h1>
              <p style="margin:8px 0 0;color:rgba(255,255,255,0.8);font-size:14px;">
                Your personalized AI spend optimization report
              </p>
            </td>
          </tr>

          <!-- Savings hero -->
          <tr>
            <td style="padding:32px 40px 0;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background:rgba(52,211,153,0.1);border:1px solid rgba(52,211,153,0.25);border-radius:12px;padding:24px;text-align:center;">
                    <p style="margin:0 0 4px;font-size:13px;color:rgba(255,255,255,0.5);text-transform:uppercase;letter-spacing:1px;">Identified Annual Savings</p>
                    <p style="margin:0;font-size:40px;font-weight:800;color:#34d399;letter-spacing:-1px;">$${annual}</p>
                    <p style="margin:4px 0 0;font-size:14px;color:rgba(255,255,255,0.5);">$${savings}/month · ${pct}% reduction from $${monthly}/mo</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- AI Summary -->
          <tr>
            <td style="padding:28px 40px 0;">
              <h2 style="margin:0 0 12px;font-size:16px;font-weight:700;color:#ffffff;">AI Optimization Analysis</h2>
              <p style="margin:0;font-size:14px;line-height:1.8;color:rgba(255,255,255,0.65);">
                ${(aiSummary || "").replace(/\n/g, "<br/>")}
              </p>
            </td>
          </tr>

          <!-- Share link -->
          ${shareUrl ? `
          <tr>
            <td style="padding:28px 40px 0;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background:rgba(99,102,241,0.1);border:1px solid rgba(99,102,241,0.25);border-radius:10px;padding:20px;">
                    <p style="margin:0 0 8px;font-size:13px;color:rgba(255,255,255,0.5);">Your shareable report link</p>
                    <a href="${shareUrl}" style="color:#a5b4fc;font-size:14px;font-weight:600;word-break:break-all;">${shareUrl}</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>` : ""}

          <!-- Footer -->
          <tr>
            <td style="padding:32px 40px;border-top:1px solid rgba(255,255,255,0.06);margin-top:28px;">
              <p style="margin:0;font-size:12px;color:rgba(255,255,255,0.25);text-align:center;">
                © 2026 SpendPilot · Built for the Credex AI Challenge<br/>
                You received this because you requested an AI spend audit.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  try {
    const result = await resend.emails.send({
      from: "SpendPilot <onboarding@resend.dev>",
      to: email,
      subject: `Your AI Spend Audit — $${annual}/yr savings identified`,
      html,
    });
    return { success: true, id: result.id };
  } catch (error) {
    console.error("Email send failed:", error.message);
    return { success: false, error: error.message };
  }
}

module.exports = { sendAuditEmail };
