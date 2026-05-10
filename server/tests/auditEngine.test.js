const { runAudit } = require("../services/auditEngine");

// ─────────────────────────────────────────────────────────────────────────────
// Helper: build a minimal valid audit payload
// ─────────────────────────────────────────────────────────────────────────────
const makePayload = (tools, teamSize = "2–5", useCase = "Software Development") => ({
  tools,
  teamSize,
  useCase,
});

// ─────────────────────────────────────────────────────────────────────────────
// 1. Cursor Business downgrade detection
// ─────────────────────────────────────────────────────────────────────────────
describe("Rule 1 & 2 — Cursor Business downgrade", () => {
  test("flags Cursor Business for a 2-seat team as high severity", () => {
    const result = runAudit(
      makePayload([{ name: "Cursor", plan: "Business", seats: 2, spend: 40 }])
    );
    expect(result.recommendations).toHaveLength(1);
    expect(result.recommendations[0].tool).toBe("Cursor");
    expect(result.recommendations[0].recommendedPlan).toBe("Pro");
    expect(result.recommendations[0].severity).toBe("high");
    expect(result.recommendations[0].monthlySavings).toBe(40); // (40-20)*2
  });

  test("flags Cursor Business for a 4-seat team as medium severity", () => {
    const result = runAudit(
      makePayload([{ name: "Cursor", plan: "Business", seats: 4, spend: 40 }])
    );
    expect(result.recommendations).toHaveLength(1);
    expect(result.recommendations[0].severity).toBe("medium");
    expect(result.recommendations[0].monthlySavings).toBe(80); // (40-20)*4
  });

  test("does NOT flag Cursor Pro — already optimal", () => {
    const result = runAudit(
      makePayload([{ name: "Cursor", plan: "Pro", seats: 3, spend: 20 }])
    );
    const cursorRecs = result.recommendations.filter((r) => r.tool === "Cursor");
    expect(cursorRecs).toHaveLength(0);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 2. ChatGPT Team overkill for small teams
// ─────────────────────────────────────────────────────────────────────────────
describe("Rule 3 — ChatGPT Team optimization", () => {
  test("recommends Plus over Team for a 2-seat team", () => {
    const result = runAudit(
      makePayload([{ name: "ChatGPT", plan: "Team", seats: 2, spend: 30 }])
    );
    const rec = result.recommendations.find((r) => r.tool === "ChatGPT");
    expect(rec).toBeDefined();
    expect(rec.recommendedPlan).toBe("Plus");
    expect(rec.monthlySavings).toBe(20); // (30-20)*2
  });

  test("does NOT flag ChatGPT Team for a 5-seat team", () => {
    const result = runAudit(
      makePayload([{ name: "ChatGPT", plan: "Team", seats: 5, spend: 30 }])
    );
    const rec = result.recommendations.find(
      (r) => r.tool === "ChatGPT" && r.recommendedPlan === "Plus"
    );
    expect(rec).toBeUndefined();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 3. Annual savings calculation
// ─────────────────────────────────────────────────────────────────────────────
describe("Summary — annual savings calculation", () => {
  test("annual savings equals monthly savings × 12", () => {
    const result = runAudit(
      makePayload([{ name: "Cursor", plan: "Business", seats: 2, spend: 40 }])
    );
    expect(result.summary.totalAnnualSavings).toBe(
      result.summary.totalMonthlySavings * 12
    );
  });

  test("savings percent is correctly calculated", () => {
    const result = runAudit(
      makePayload([{ name: "Cursor", plan: "Business", seats: 2, spend: 40 }])
    );
    const expected = Math.round(
      (result.summary.totalMonthlySavings / result.summary.totalCurrentMonthly) * 100
    );
    expect(result.summary.savingsPercent).toBe(expected);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 4. Low / zero savings scenario
// ─────────────────────────────────────────────────────────────────────────────
describe("No-recommendation scenario", () => {
  test("returns zero savings for an already-optimal stack", () => {
    const result = runAudit(
      makePayload([
        { name: "Cursor", plan: "Pro", seats: 3, spend: 20 },
        { name: "ChatGPT", plan: "Plus", seats: 3, spend: 20 },
      ])
    );
    expect(result.summary.totalMonthlySavings).toBe(0);
    expect(result.summary.totalAnnualSavings).toBe(0);
    expect(result.recommendations).toHaveLength(0);
  });

  test("returns empty recommendations array (not null/undefined)", () => {
    const result = runAudit(makePayload([{ name: "GitHub", plan: "Free", seats: 5, spend: 0 }]));
    expect(Array.isArray(result.recommendations)).toBe(true);
    expect(Array.isArray(result.flags)).toBe(true);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 5. Duplicate tool overlap detection
// ─────────────────────────────────────────────────────────────────────────────
describe("Rule 15 & 16 — Duplicate tool overlap", () => {
  test("flags Cursor + Copilot as overlapping coding assistants", () => {
    const result = runAudit(
      makePayload([
        { name: "Cursor", plan: "Pro", seats: 3, spend: 20 },
        { name: "Copilot", plan: "Business", seats: 3, spend: 19 },
      ])
    );
    const overlapFlag = result.flags.find((f) => f.type === "overlap");
    expect(overlapFlag).toBeDefined();
    expect(overlapFlag.severity).toBe("high");
  });

  test("flags ChatGPT + Claude as overlapping AI assistants", () => {
    const result = runAudit(
      makePayload([
        { name: "ChatGPT", plan: "Plus", seats: 2, spend: 20 },
        { name: "Claude", plan: "Pro", seats: 2, spend: 20 },
      ])
    );
    const overlapFlag = result.flags.find((f) => f.type === "overlap");
    expect(overlapFlag).toBeDefined();
  });

  test("does NOT flag a single coding assistant", () => {
    const result = runAudit(
      makePayload([{ name: "Cursor", plan: "Pro", seats: 3, spend: 20 }])
    );
    const overlapFlag = result.flags.find((f) => f.type === "overlap");
    expect(overlapFlag).toBeUndefined();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 6. Claude Max downgrade
// ─────────────────────────────────────────────────────────────────────────────
describe("Rule 5 — Claude Max downgrade", () => {
  test("recommends Pro over Max for a 2-seat team", () => {
    const result = runAudit(
      makePayload([{ name: "Claude", plan: "Max", seats: 2, spend: 100 }])
    );
    const rec = result.recommendations.find((r) => r.tool === "Claude");
    expect(rec).toBeDefined();
    expect(rec.recommendedPlan).toBe("Pro");
    expect(rec.monthlySavings).toBe(160); // (100-20)*2
    expect(rec.severity).toBe("high");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 7. GitHub Enterprise downgrade
// ─────────────────────────────────────────────────────────────────────────────
describe("Rule 13 — GitHub Enterprise downgrade", () => {
  test("recommends Team over Enterprise for a 5-seat team", () => {
    const result = runAudit(
      makePayload([{ name: "GitHub", plan: "Enterprise", seats: 5, spend: 21 }])
    );
    const rec = result.recommendations.find((r) => r.tool === "GitHub");
    expect(rec).toBeDefined();
    expect(rec.recommendedPlan).toBe("Team");
    expect(rec.monthlySavings).toBe(85); // (21-4)*5
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 8. Summary shape validation
// ─────────────────────────────────────────────────────────────────────────────
describe("Summary object shape", () => {
  test("summary contains all required fields", () => {
    const result = runAudit(
      makePayload([{ name: "Cursor", plan: "Business", seats: 1, spend: 40 }])
    );
    const keys = [
      "totalCurrentMonthly",
      "totalCurrentAnnual",
      "totalMonthlySavings",
      "totalAnnualSavings",
      "optimizedMonthly",
      "optimizedAnnual",
      "savingsPercent",
      "toolsAudited",
    ];
    keys.forEach((key) => {
      expect(result.summary).toHaveProperty(key);
    });
  });

  test("toolsAudited matches input length", () => {
    const tools = [
      { name: "Cursor", plan: "Pro", seats: 2, spend: 20 },
      { name: "ChatGPT", plan: "Plus", seats: 2, spend: 20 },
      { name: "Claude", plan: "Pro", seats: 2, spend: 20 },
    ];
    const result = runAudit(makePayload(tools));
    expect(result.summary.toolsAudited).toBe(3);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 9. AI tool sprawl detection
// ─────────────────────────────────────────────────────────────────────────────
describe("Rule 17 — AI tool sprawl", () => {
  test("flags sprawl for 4+ paid tools on a small team", () => {
    const result = runAudit(
      makePayload(
        [
          { name: "Cursor", plan: "Pro", seats: 2, spend: 20 },
          { name: "ChatGPT", plan: "Plus", seats: 2, spend: 20 },
          { name: "Claude", plan: "Pro", seats: 2, spend: 20 },
          { name: "Midjourney", plan: "Standard", seats: 2, spend: 30 },
        ],
        "2–5"
      )
    );
    const sprawlFlag = result.flags.find((f) => f.type === "sprawl");
    expect(sprawlFlag).toBeDefined();
    expect(sprawlFlag.severity).toBe("medium");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 10. Edge cases
// ─────────────────────────────────────────────────────────────────────────────
describe("Edge cases", () => {
  test("handles zero spend gracefully", () => {
    const result = runAudit(
      makePayload([{ name: "GitHub", plan: "Free", seats: 10, spend: 0 }])
    );
    expect(result.summary.totalCurrentMonthly).toBe(0);
    expect(result.summary.savingsPercent).toBe(0);
  });

  test("handles missing teamSize gracefully", () => {
    const result = runAudit({
      tools: [{ name: "Cursor", plan: "Business", seats: 2, spend: 40 }],
      teamSize: undefined,
      useCase: "Software Development",
    });
    expect(result.summary).toBeDefined();
    expect(result.recommendations.length).toBeGreaterThan(0);
  });

  test("optimizedMonthly is never negative", () => {
    const result = runAudit(
      makePayload([{ name: "Claude", plan: "Max", seats: 1, spend: 100 }])
    );
    expect(result.summary.optimizedMonthly).toBeGreaterThanOrEqual(0);
  });
});
