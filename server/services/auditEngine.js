/**
 * SpendPilot Audit Engine
 * Rule-based AI spend analysis with financially defensible recommendations.
 * Each rule targets a specific overspend pattern with a clear business rationale.
 */

// Official / benchmark monthly pricing per seat (USD)
const PRICING = {
  Cursor:     { Hobby: 0,   Pro: 20,  Business: 40,  Enterprise: 60 },
  ChatGPT:    { Plus: 20,   Team: 30, Enterprise: 60, API: 0 },
  Claude:     { Free: 0,    Pro: 20,  Max: 100, Team: 30, Enterprise: 60 },
  Copilot:    { Individual: 10, Business: 19, Enterprise: 39 },
  Midjourney: { Basic: 10,  Standard: 30, Pro: 60, Mega: 120 },
  Perplexity: { Free: 0,    Pro: 20,  Enterprise: 40 },
  Notion:     { Free: 0,    Plus: 10, Business: 15, Enterprise: 25 },
  Linear:     { Free: 0,    Standard: 8, Plus: 14, Enterprise: 22 },
  Vercel:     { Hobby: 0,   Pro: 20,  Enterprise: 40 },
  GitHub:     { Free: 0,    Team: 4,  Enterprise: 21 },
};

// Tools that overlap significantly in functionality
const OVERLAP_GROUPS = [
  { tools: ["ChatGPT", "Claude"], label: "general-purpose AI assistants" },
  { tools: ["Cursor", "Copilot"], label: "AI coding assistants" },
  { tools: ["Notion", "Linear"], label: "project management / docs tools" },
];

/**
 * Calculate the benchmark price for a tool/plan.
 * Falls back to the user-reported spend if no benchmark exists.
 */
function getBenchmarkPrice(name, plan) {
  return PRICING[name]?.[plan] ?? null;
}

/**
 * Core audit function.
 * @param {Object} data - { tools: [{name, plan, seats, spend}], teamSize, useCase }
 * @returns {Object} audit result with recommendations and savings
 */
function runAudit({ tools, teamSize, useCase }) {
  const recommendations = [];
  const flags = [];
  let totalMonthlySavings = 0;

  const teamCount = parseTeamSize(teamSize);
  const toolNames = tools.map((t) => t.name);

  tools.forEach((tool) => {
    const { name, plan, seats, spend } = tool;
    const numSeats = parseInt(seats) || 1;
    const numSpend = parseFloat(spend) || 0;
    const totalToolCost = numSpend * numSeats;
    const benchmark = getBenchmarkPrice(name, plan);

    // ── RULE 1: Cursor Business overkill for ≤ 2 seats ──────────────────────
    if (name === "Cursor" && plan === "Business" && numSeats <= 2) {
      const savings = (40 - 20) * numSeats;
      recommendations.push({
        tool: name,
        currentPlan: plan,
        recommendedPlan: "Pro",
        monthlySavings: savings,
        reason:
          "Cursor Business adds admin controls and SSO that are unnecessary for teams under 3 people. Pro delivers identical coding assistance at half the cost.",
        severity: "high",
      });
      totalMonthlySavings += savings;
    }

    // ── RULE 2: Cursor Business overkill for ≤ 5 seats ──────────────────────
    if (name === "Cursor" && plan === "Business" && numSeats > 2 && numSeats <= 5) {
      const savings = (40 - 20) * numSeats;
      recommendations.push({
        tool: name,
        currentPlan: plan,
        recommendedPlan: "Pro",
        monthlySavings: savings,
        reason:
          "Cursor Business is designed for enterprise compliance needs. Teams of 5 or fewer rarely require SSO or audit logs — Pro covers all core AI features.",
        severity: "medium",
      });
      totalMonthlySavings += savings;
    }

    // ── RULE 3: ChatGPT Team unnecessary for < 3 seats ──────────────────────
    if (name === "ChatGPT" && plan === "Team" && numSeats < 3) {
      const savings = (30 - 20) * numSeats;
      recommendations.push({
        tool: name,
        currentPlan: plan,
        recommendedPlan: "Plus",
        monthlySavings: savings,
        reason:
          "ChatGPT Team's shared workspace and admin features only add value at 3+ seats. Individual Plus accounts provide the same GPT-4 access at a lower per-seat cost.",
        severity: "medium",
      });
      totalMonthlySavings += savings;
    }

    // ── RULE 4: ChatGPT Enterprise for small teams ───────────────────────────
    if (name === "ChatGPT" && plan === "Enterprise" && numSeats < 10) {
      const savings = (60 - 30) * numSeats;
      recommendations.push({
        tool: name,
        currentPlan: plan,
        recommendedPlan: "Team",
        monthlySavings: savings,
        reason:
          "ChatGPT Enterprise pricing is optimized for 10+ seat deployments with dedicated support. Teams under 10 pay a significant premium for features they rarely use.",
        severity: "high",
      });
      totalMonthlySavings += savings;
    }

    // ── RULE 5: Claude Max for non-power users ───────────────────────────────
    if (name === "Claude" && plan === "Max" && numSeats <= 3) {
      const savings = (100 - 20) * numSeats;
      recommendations.push({
        tool: name,
        currentPlan: plan,
        recommendedPlan: "Pro",
        monthlySavings: savings,
        reason:
          "Claude Max is designed for users who hit Pro's message limits daily. Unless your team is running intensive long-context workflows, Pro provides the same model access at 80% less cost.",
        severity: "high",
      });
      totalMonthlySavings += savings;
    }

    // ── RULE 6: Claude Team for very small teams ─────────────────────────────
    if (name === "Claude" && plan === "Team" && numSeats < 3) {
      const savings = (30 - 20) * numSeats;
      recommendations.push({
        tool: name,
        currentPlan: plan,
        recommendedPlan: "Pro",
        monthlySavings: savings,
        reason:
          "Claude Team's collaboration features require a minimum of 5 users to be cost-effective. For 1–2 users, individual Pro plans are cheaper and functionally equivalent.",
        severity: "low",
      });
      totalMonthlySavings += savings;
    }

    // ── RULE 7: Copilot Enterprise for small dev teams ───────────────────────
    if (name === "Copilot" && plan === "Enterprise" && numSeats < 8) {
      const savings = (39 - 19) * numSeats;
      recommendations.push({
        tool: name,
        currentPlan: plan,
        recommendedPlan: "Business",
        monthlySavings: savings,
        reason:
          "GitHub Copilot Enterprise adds Copilot Chat in GitHub.com and fine-tuning on private repos — features that require significant GitHub Enterprise infrastructure. Business plan covers all core AI coding features.",
        severity: "high",
      });
      totalMonthlySavings += savings;
    }

    // ── RULE 8: Midjourney Pro/Mega for non-design teams ────────────────────
    if (
      name === "Midjourney" &&
      (plan === "Pro" || plan === "Mega") &&
      useCase !== "Design & Creative" &&
      useCase !== "Content Creation"
    ) {
      const downgrade = plan === "Mega" ? "Standard" : "Basic";
      const savings = (PRICING.Midjourney[plan] - PRICING.Midjourney[downgrade]) * numSeats;
      recommendations.push({
        tool: name,
        currentPlan: plan,
        recommendedPlan: downgrade,
        monthlySavings: savings,
        reason: `Midjourney ${plan} is built for professional image generation workflows. For a ${useCase} team, the ${downgrade} plan's generation limits are more than sufficient.`,
        severity: "medium",
      });
      totalMonthlySavings += savings;
    }

    // ── RULE 9: Perplexity Enterprise for small teams ────────────────────────
    if (name === "Perplexity" && plan === "Enterprise" && numSeats < 5) {
      const savings = (40 - 20) * numSeats;
      recommendations.push({
        tool: name,
        currentPlan: plan,
        recommendedPlan: "Pro",
        monthlySavings: savings,
        reason:
          "Perplexity Enterprise is priced for org-wide deployments with SSO and admin controls. Teams under 5 get identical search quality on Pro at half the cost.",
        severity: "medium",
      });
      totalMonthlySavings += savings;
    }

    // ── RULE 10: Notion Business for tiny teams ──────────────────────────────
    if (name === "Notion" && plan === "Business" && numSeats <= 3) {
      const savings = (15 - 10) * numSeats;
      recommendations.push({
        tool: name,
        currentPlan: plan,
        recommendedPlan: "Plus",
        monthlySavings: savings,
        reason:
          "Notion Business adds SAML SSO and advanced permissions that are unnecessary for teams of 3 or fewer. Plus covers unlimited pages, guests, and API access.",
        severity: "low",
      });
      totalMonthlySavings += savings;
    }

    // ── RULE 11: Linear Plus for solo/duo teams ──────────────────────────────
    if (name === "Linear" && plan === "Plus" && numSeats <= 2) {
      const savings = (14 - 8) * numSeats;
      recommendations.push({
        tool: name,
        currentPlan: plan,
        recommendedPlan: "Standard",
        monthlySavings: savings,
        reason:
          "Linear Plus adds advanced analytics and priority support that provide minimal value for 1–2 person teams. Standard covers all core project tracking features.",
        severity: "low",
      });
      totalMonthlySavings += savings;
    }

    // ── RULE 12: Vercel Pro for non-production hobby projects ────────────────
    if (name === "Vercel" && plan === "Pro" && numSeats === 1 && useCase !== "Software Development") {
      const savings = 20 * numSeats;
      recommendations.push({
        tool: name,
        currentPlan: plan,
        recommendedPlan: "Hobby",
        monthlySavings: savings,
        reason:
          "Vercel Pro is designed for production deployments with team collaboration. For a solo non-developer use case, the free Hobby plan covers personal projects with no cost.",
        severity: "medium",
      });
      totalMonthlySavings += savings;
    }

    // ── RULE 13: GitHub Enterprise for small teams ───────────────────────────
    if (name === "GitHub" && plan === "Enterprise" && numSeats < 10) {
      const savings = (21 - 4) * numSeats;
      recommendations.push({
        tool: name,
        currentPlan: plan,
        recommendedPlan: "Team",
        monthlySavings: savings,
        reason:
          "GitHub Enterprise requires a minimum 10-seat commitment and is priced for large organizations needing SAML SSO, audit logs, and dedicated support. Team plan covers all standard collaboration features.",
        severity: "high",
      });
      totalMonthlySavings += savings;
    }

    // ── RULE 14: Overpaying vs benchmark price ───────────────────────────────
    if (benchmark !== null && numSpend > benchmark * 1.15) {
      const overpay = (numSpend - benchmark) * numSeats;
      flags.push({
        tool: name,
        type: "overpay",
        message: `You're reporting $${numSpend}/seat for ${name} ${plan}, but the benchmark price is $${benchmark}/seat. Verify your billing — you may be on an older pricing tier or have add-ons enabled.`,
        potentialSavings: overpay,
        severity: "medium",
      });
    }
  });

  // ── RULE 15: Duplicate coding assistants ────────────────────────────────────
  const codingTools = toolNames.filter((n) => ["Cursor", "Copilot"].includes(n));
  if (codingTools.length >= 2) {
    const cheaperTool = tools
      .filter((t) => codingTools.includes(t.name))
      .sort((a, b) => (parseFloat(a.spend) || 0) - (parseFloat(b.spend) || 0))[0];
    const expensiveTool = tools
      .filter((t) => codingTools.includes(t.name))
      .sort((a, b) => (parseFloat(b.spend) || 0) - (parseFloat(a.spend) || 0))[0];
    const redundantCost =
      (parseFloat(cheaperTool.spend) || 0) * (parseInt(cheaperTool.seats) || 1);
    flags.push({
      tool: `${codingTools.join(" + ")}`,
      type: "overlap",
      message: `Your team is paying for both Cursor and GitHub Copilot — two AI coding assistants with heavily overlapping functionality. Most developers find one sufficient. Consolidating to ${expensiveTool.name} alone could save ~$${redundantCost}/mo.`,
      potentialSavings: redundantCost,
      severity: "high",
    });
    totalMonthlySavings += redundantCost;
  }

  // ── RULE 16: Duplicate general AI assistants ────────────────────────────────
  const aiAssistants = toolNames.filter((n) => ["ChatGPT", "Claude"].includes(n));
  if (aiAssistants.length >= 2) {
    const costs = tools
      .filter((t) => aiAssistants.includes(t.name))
      .map((t) => ({ name: t.name, cost: (parseFloat(t.spend) || 0) * (parseInt(t.seats) || 1) }))
      .sort((a, b) => a.cost - b.cost);
    const redundantCost = costs[0].cost;
    flags.push({
      tool: `${aiAssistants.join(" + ")}`,
      type: "overlap",
      message: `Your team subscribes to both ChatGPT and Claude — both are general-purpose AI assistants with significant feature overlap. Consider consolidating to one. Dropping ${costs[0].name} could save ~$${redundantCost}/mo.`,
      potentialSavings: redundantCost,
      severity: "high",
    });
    totalMonthlySavings += redundantCost;
  }

  // ── RULE 17: Too many paid AI tools for a small team ────────────────────────
  const paidTools = tools.filter((t) => (parseFloat(t.spend) || 0) > 0);
  if (paidTools.length >= 4 && teamCount <= 5) {
    flags.push({
      tool: "Stack",
      type: "sprawl",
      message: `Your team of ${teamSize} is paying for ${paidTools.length} AI tools simultaneously. AI tool sprawl is one of the fastest-growing budget leaks in small teams. A focused audit of actual usage frequency could eliminate 1–2 subscriptions.`,
      potentialSavings: null,
      severity: "medium",
    });
  }

  // ── RULE 18: Non-dev team paying for dev-focused tools ──────────────────────
  const devTools = toolNames.filter((n) => ["Cursor", "Copilot", "Vercel", "GitHub", "Linear"].includes(n));
  if (
    devTools.length >= 2 &&
    useCase &&
    !["Software Development"].includes(useCase)
  ) {
    flags.push({
      tool: devTools.join(", "),
      type: "mismatch",
      message: `Your primary use case is "${useCase}" but your stack includes ${devTools.length} developer-focused tools (${devTools.join(", ")}). Verify these are actively used — unused dev tools are a common source of silent spend.`,
      potentialSavings: null,
      severity: "low",
    });
  }

  // ── RULE 19: Midjourney Mega overkill ───────────────────────────────────────
  const midjourneyTool = tools.find((t) => t.name === "Midjourney" && t.plan === "Mega");
  if (midjourneyTool && parseInt(midjourneyTool.seats) <= 2) {
    const savings = (120 - 60) * (parseInt(midjourneyTool.seats) || 1);
    if (!recommendations.find((r) => r.tool === "Midjourney")) {
      recommendations.push({
        tool: "Midjourney",
        currentPlan: "Mega",
        recommendedPlan: "Pro",
        monthlySavings: savings,
        reason:
          "Midjourney Mega provides 60 fast GPU hours/month — a volume that requires generating hundreds of images daily. For 1–2 users, Pro's 30 fast hours is more than sufficient for professional creative work.",
        severity: "high",
      });
      totalMonthlySavings += savings;
    }
  }

  // ── RULE 20: High absolute spend with no enterprise-grade tools ─────────────
  const totalCurrentSpend = tools.reduce(
    (sum, t) => sum + (parseFloat(t.spend) || 0) * (parseInt(t.seats) || 1),
    0
  );
  if (totalCurrentSpend > 500 && teamCount <= 10 && recommendations.length === 0) {
    flags.push({
      tool: "Stack",
      type: "high_spend",
      message: `Your team is spending $${totalCurrentSpend.toFixed(0)}/mo on AI tools. While no specific plan downgrades were flagged, a usage audit is recommended — teams at this spend level often have 20–30% of licenses going unused.`,
      potentialSavings: Math.round(totalCurrentSpend * 0.2),
      severity: "medium",
    });
  }

  // ── Build summary ────────────────────────────────────────────────────────────
  const totalCurrentMonthly = tools.reduce(
    (sum, t) => sum + (parseFloat(t.spend) || 0) * (parseInt(t.seats) || 1),
    0
  );

  const optimizedMonthly = Math.max(0, totalCurrentMonthly - totalMonthlySavings);
  const savingsPercent =
    totalCurrentMonthly > 0
      ? Math.round((totalMonthlySavings / totalCurrentMonthly) * 100)
      : 0;

  return {
    summary: {
      totalCurrentMonthly: parseFloat(totalCurrentMonthly.toFixed(2)),
      totalCurrentAnnual: parseFloat((totalCurrentMonthly * 12).toFixed(2)),
      totalMonthlySavings: parseFloat(totalMonthlySavings.toFixed(2)),
      totalAnnualSavings: parseFloat((totalMonthlySavings * 12).toFixed(2)),
      optimizedMonthly: parseFloat(optimizedMonthly.toFixed(2)),
      optimizedAnnual: parseFloat((optimizedMonthly * 12).toFixed(2)),
      savingsPercent,
      toolsAudited: tools.length,
      teamSize,
      useCase,
    },
    recommendations,
    flags,
  };
}

/**
 * Parse team size string to a number for rule comparisons.
 */
function parseTeamSize(teamSize) {
  if (!teamSize) return 5;
  const map = { "1": 1, "2–5": 3, "6–15": 10, "16–50": 30, "51–200": 100, "200+": 200 };
  return map[teamSize] ?? 5;
}

module.exports = { runAudit };
