const axios = require("axios");

/**
 * Generate a professional AI spend optimization summary using OpenAI.
 * Falls back to a rule-based summary if the API call fails or key is missing.
 */
async function generateAISummary(auditData) {
  const { summary, recommendations, flags } = auditData;

  // Build a concise prompt
  const recLines = (recommendations || [])
    .map(
      (r) =>
        `- ${r.tool} (${r.currentPlan} → ${r.recommendedPlan}): save $${r.monthlySavings}/mo — ${r.reason}`
    )
    .join("\n");

  const flagLines = (flags || [])
    .map((f) => `- [${f.type}] ${f.message}`)
    .join("\n");

  const prompt = `You are a financial advisor specializing in SaaS cost optimization.
A company has completed an AI tool spend audit. Write a concise, professional 3-paragraph executive summary (max 180 words) of their results.
Be specific, financially precise, and actionable. Do not use bullet points — write in flowing prose.

Audit data:
- Team size: ${summary?.teamSize || "unknown"}
- Use case: ${summary?.useCase || "unknown"}
- Current monthly spend: $${summary?.totalCurrentMonthly || 0}
- Identified monthly savings: $${summary?.totalMonthlySavings || 0} (${summary?.savingsPercent || 0}% reduction)
- Annual savings opportunity: $${summary?.totalAnnualSavings || 0}

Recommendations:
${recLines || "None"}

Additional flags:
${flagLines || "None"}

Write the summary now:`;

  // Only attempt OpenAI if key is configured
  if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== "your_openai_api_key") {
    try {
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-4o-mini",
          messages: [{ role: "user", content: prompt }],
          max_tokens: 300,
          temperature: 0.7,
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
            "Content-Type": "application/json",
          },
          timeout: 10000,
        }
      );
      return response.data.choices[0].message.content.trim();
    } catch (error) {
      console.warn("OpenAI API call failed, using fallback summary:", error.message);
    }
  }

  // ── Fallback: rule-based summary ────────────────────────────────────────────
  return buildFallbackSummary(summary, recommendations, flags);
}

/**
 * Deterministic fallback summary — no external API required.
 * Produces a professional paragraph based purely on the audit numbers.
 */
function buildFallbackSummary(summary, recommendations, flags) {
  const monthly = summary?.totalCurrentMonthly || 0;
  const savings = summary?.totalMonthlySavings || 0;
  const annual = summary?.totalAnnualSavings || 0;
  const pct = summary?.savingsPercent || 0;
  const recCount = (recommendations || []).length;
  const flagCount = (flags || []).length;
  const teamSize = summary?.teamSize || "your team";
  const useCase = summary?.useCase || "your workflows";

  if (savings === 0) {
    return `Based on the audit of your AI tool stack, your current subscriptions appear reasonably aligned with your team's size and use case. No significant plan mismatches or redundant subscriptions were detected at this time. As your team scales or your usage patterns evolve, it is worth revisiting this audit — plan tiers that are cost-efficient today can become overprovisioned quickly as headcount grows. Continue monitoring actual usage against licensed seats to ensure you maintain an optimized spend profile.`;
  }

  const highRec = (recommendations || []).filter((r) => r.severity === "high");
  const highRecText =
    highRec.length > 0
      ? ` The most impactful change is ${highRec[0].tool}: downgrading from ${highRec[0].currentPlan} to ${highRec[0].recommendedPlan} alone saves $${highRec[0].monthlySavings}/month without any reduction in capability for a team of ${teamSize}.`
      : "";

  return `Your AI tool stack audit has identified $${savings.toFixed(0)}/month ($${annual.toFixed(0)}/year) in actionable savings — a ${pct}% reduction from your current $${monthly.toFixed(0)}/month spend.${highRecText} Across ${recCount} specific plan recommendation${recCount !== 1 ? "s" : ""} and ${flagCount} additional insight${flagCount !== 1 ? "s" : ""}, the primary drivers of overspend are enterprise-tier plans provisioned for team sizes that do not require their advanced features, and overlapping tools serving the same function. For a ${useCase} team, consolidating to right-sized plans would preserve all core capabilities while materially reducing your monthly AI infrastructure cost. Implementing these changes requires no workflow disruption — only subscription adjustments in your existing vendor portals.`;
}

module.exports = { generateAISummary };
